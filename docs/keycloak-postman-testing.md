# Testing Keycloak Standard Flow with Postman

Bộ Postman trong `postman/` chạy trọn vẹn Authorization Code flow (Standard Flow,
không PKCE) của Keycloak trong `docker-compose.provider.yaml`, rồi dùng access
token thu được để gọi các endpoint BFF.

| File                                                | Nội dung                                                    |
| --------------------------------------------------- | ----------------------------------------------------------- |
| `postman/einvoice-keycloak.postman_collection.json` | Collection: 8 request Keycloak + 5 request BFF              |
| `postman/einvoice-local.postman_environment.json`   | Environment: domain, client, và các token được điền tự động |

## 1. Chuẩn bị Keycloak

```sh
docker compose -f docker-compose.provider.yaml up -d keycloak
```

Keycloak lắng nghe ở `http://localhost:8080`, tài khoản quản trị khởi tạo là
`admin` / `admin` (khai báo trong `docker-compose.provider.yaml`).

Vì chạy `start-dev` mà không khai báo `KC_DB`, Keycloak dùng H2 nhúng đặt trong
bind mount `docker/docker_data/keycloak_data`. Realm, client và user bạn tạo ở
bước dưới nằm hết trong đó, và sẽ mất nếu xoá thư mục này.

Repo chưa có realm hay client nào được commit, nên tạo thủ công một lần trong
Admin Console:

1. **Realm** — tạo realm mới, ví dụ `einvoice`.
2. **Client** — `Clients` → `Create client`:
   - Client ID: `einvoice-bff`
   - Client authentication: **On** (client dạng confidential, có secret)
   - Authentication flow: chỉ tick **Standard flow**
   - Valid redirect URIs: `http://localhost:3300/api/v1/app` _(phải khớp tuyệt
     đối với giá trị biến `redirect_uri`, nếu sai Keycloak báo lỗi trước cả màn
     hình đăng nhập). Biến này được ghép từ `{{bff_base_url}}/{{global_prefix}}/app`,
     nên khi đổi domain BFF thì phải đăng ký lại URI mới trong Keycloak. Request
     `3. Authorize` in ra giá trị đã resolve trong console để bạn copy._
   - Sau khi tạo, mở tab `Credentials` để lấy **Client secret**.
   - Nếu client đã bật PKCE, vào `Advanced` → đặt `Proof Key for Code Exchange
Code Challenge Method` về rỗng, vì bộ request này không gửi `code_verifier`.
3. **User** — `Users` → `Create new user`, đặt mật khẩu ở tab `Credentials` và
   tắt `Temporary`.

## 2. Import và cấu hình

Import cả hai file vào Postman, chọn environment **E-Invoice — Local**, rồi điền:

| Biến                            | Ý nghĩa                                                                                 |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| `keycloak_base_url`             | Đổi biến này là toàn bộ request Keycloak trỏ sang domain khác                           |
| `realm`                         | Tên realm                                                                               |
| `client_id`                     | Client ID vừa tạo                                                                       |
| `client_secret`                 | Client secret (kiểu `secret`, để rỗng trong file commit)                                |
| `redirect_uri`                  | Ghép từ `bff_base_url` + `global_prefix`; phải nằm trong Valid redirect URIs của client |
| `scope`                         | Mặc định `openid profile email`                                                         |
| `bff_base_url`, `global_prefix` | Đổi domain của BFF                                                                      |

Các biến `access_token`, `refresh_token`, `id_token`, `token_expires_at`,
`state`, `nonce`, `issuer` do test script tự ghi — không cần điền tay, nhưng vẫn
sửa tay được nếu muốn thử một token khác.

## 3. Chạy flow

Chạy folder `01 - Keycloak OIDC` theo đúng thứ tự:

1. **Discovery** — xác nhận realm tồn tại và các endpoint khớp với đường dẫn
   collection đang dùng.
2. **JWKS** — lấy khoá công khai của realm.
3. **Authorize** — Postman chỉ tải được trang đăng nhập, không đăng nhập thay bạn
   được. Chạy request, mở **Postman Console** (`View → Show Postman Console`),
   copy URL đã in ra, dán vào trình duyệt và đăng nhập. Sau khi Keycloak
   redirect, copy giá trị `code` trên thanh địa chỉ vào biến `auth_code`.

   BFF nên chạy sẵn để trang redirect mở được; nếu BFF tắt, trình duyệt báo
   `ERR_CONNECTION_REFUSED` nhưng `code` vẫn nằm trên thanh địa chỉ và vẫn dùng
   được. Request này cố tình không follow redirect: nếu Postman đã giữ cookie
   phiên SSO, Keycloak trả thẳng 302 và script tự lấy `code` từ header
   `Location`, đồng thời đối chiếu `state`.

4. **Exchange authorization code** — đổi code lấy token. Script tự lưu 3 token
   vào environment và luôn xoá `auth_code` (kể cả khi request lỗi) vì Keycloak
   vô hiệu hoá code ngay cả trong lần đổi thất bại. Khi lỗi, script giữ nguyên
   token cũ và in `error_description` của Keycloak ra console thay vì ghi đè.
5. **Refresh** — gia hạn token mà không cần mở lại trình duyệt.
6. **UserInfo** — dùng bearer token ở cấp collection, nên xác nhận luôn rằng
   `access_token` được realm chấp nhận.
7. **Introspect** — kiểm tra token còn `active` theo RFC 7662.
8. **Logout** — kết thúc phiên SSO và xoá token khỏi environment.

Folder `02 - BFF API` kế thừa bearer `{{access_token}}` từ collection. Body của
các request `POST` bám đúng `CreateUserRequestDto`, `CreateProductRequestDto` và
`CreateInvoiceDto`, nên chỉ cần thay id mẫu bằng id thật trong database.

## 4. Điều kiện chạy folder `02 - BFF API`

`GET /app` do một mình gateway phục vụ, nên dùng nó để phân biệt lỗi BFF với lỗi
microservice. Bốn request còn lại đều đi tiếp qua TCP:

| Request                              | Cần chạy thêm                    |
| ------------------------------------ | -------------------------------- |
| `GET /app/invoice`, `POST /invoices` | service `einvoice`               |
| `POST /product`                      | service `product`                |
| `POST /user`                         | service `user-access` và MongoDB |

Thiếu service nào thì BFF trả 500 chứ không phải lỗi xác thực.

## 5. Giới hạn hiện tại

BFF **chưa** xác thực token — chưa có guard hay strategy Keycloak nào trong code,
Keycloak mới chỉ tồn tại ở tầng docker. Vì vậy các request trong folder
`02 - BFF API` vẫn thành công (200 cho `GET`, 201 cho `POST`) kể cả khi
`access_token` sai hoặc rỗng. Bộ Postman này xác minh Keycloak phát hành token
đúng và chuẩn bị sẵn đường đi cho token; việc BFF từ chối token không hợp lệ chỉ
kiểm chứng được sau khi tích hợp guard.

Không commit `client_secret` hay token thật vào các file trong `postman/`.
