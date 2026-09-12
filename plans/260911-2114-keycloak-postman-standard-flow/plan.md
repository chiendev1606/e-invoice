# Postman collection: Keycloak Standard Flow + BFF API

Status: done — 2026-09-11

## Outcome

Một bộ Postman (collection + environment) chạy được toàn bộ Authorization Code
flow (Standard Flow, không PKCE) của Keycloak 26.5.2 trong
`docker-compose.provider.yaml`, và dùng access token thu được để gọi các endpoint
BFF hiện có. Đổi domain hoặc token chỉ cần sửa biến môi trường, không sửa request.

## Constraints

- Keycloak 26.5.2, `start-dev`, mặc định `http://localhost:8080`.
- BFF chạy port 3300, global prefix `api/v1`.
- Standard Flow, confidential client có `client_secret`, không PKCE.
- Postman Collection Format v2.1.0.
- Repo chưa có realm/client nào — collection phải chạy được với bất kỳ tên realm
  và client nào do người dùng khai báo qua biến.
- Không hardcode secret vào file commit: `client_secret` để rỗng, kiểu `secret`.

## Non-goals

- Không viết code tích hợp Keycloak vào NestJS (guard, strategy, middleware).
- Không tạo realm import file hay sửa docker-compose.
- Không thêm grant type khác (password, client_credentials, PKCE).
- Không thêm Keycloak Admin REST API.

## Deliverables

- `postman/einvoice-keycloak.postman_collection.json`
- `postman/einvoice-local.postman_environment.json`
- `docs/keycloak-postman-testing.md` — hướng dẫn tạo client trong Keycloak và
  chạy flow theo thứ tự.

## Design

URL của mọi request được ghép trực tiếp từ `{{keycloak_base_url}}` + `{{realm}}`
theo đường dẫn OIDC chuẩn, thay vì đọc từ discovery. Chỉ cần đổi 2 biến là trỏ
sang môi trường khác; discovery chỉ đóng vai trò request kiểm chứng.

Collection auth mặc định là Bearer `{{access_token}}`; các request Keycloak dùng
`noauth` hoặc form body, nên đổi token cũng chỉ là đổi 1 biến.

### Folder 01 — Keycloak OIDC

| #   | Request       | Endpoint                                                                                             |
| --- | ------------- | ---------------------------------------------------------------------------------------------------- |
| 1   | Discovery     | `GET /realms/{realm}/.well-known/openid-configuration`                                               |
| 2   | JWKS certs    | `GET /realms/{realm}/protocol/openid-connect/certs`                                                  |
| 3   | Authorize     | `GET .../protocol/openid-connect/auth` (sinh `state`, `nonce`, log URL ra console để mở trình duyệt) |
| 4   | Exchange code | `POST .../token` grant_type=authorization_code                                                       |
| 5   | Refresh token | `POST .../token` grant_type=refresh_token                                                            |
| 6   | UserInfo      | `GET .../userinfo` (Bearer)                                                                          |
| 7   | Introspect    | `POST .../token/introspect`                                                                          |
| 8   | Logout        | `POST .../logout` (refresh_token + client creds)                                                     |

Test script của (4) và (5) lưu `access_token`, `refresh_token`, `id_token`,
`token_expires_at` vào environment; (4) xoá `auth_code` sau khi dùng vì code chỉ
dùng được một lần; (8) xoá toàn bộ token.

### Folder 02 — BFF API

Dùng Bearer `{{access_token}}` kế thừa từ collection, body khớp DTO thật:

- `GET {{bff_base_url}}/{{global_prefix}}/app`
- `GET .../app/invoice`
- `POST .../user` — `firstName`, `lastName`, `email`, `roles[]` (ObjectId hợp lệ)
- `POST .../product` — `name`, `description?`, `sku`, `unit`, `price`, `vatRate`
- `POST .../invoices` — `client{name,address,email}`, `items[]{productId,name,quantity,vatRate,unitPrice}`

## Acceptance criteria

1. Import 2 file vào Postman không lỗi schema.
2. Đổi `keycloak_base_url` + `realm` là mọi request Keycloak trỏ đúng host mới.
3. Đổi `access_token` là mọi request BFF dùng token mới, không phải sửa request.
4. Request Authorize in ra URL đăng nhập đầy đủ kèm `state`/`nonce` ngẫu nhiên.
5. Exchange code trả 200 và tự lưu 3 token vào environment.
6. Body BFF khớp `CreateUserRequestDto`, `CreateProductRequestDto`, `CreateInvoiceDto`.
7. Không có secret thật nào bị commit.

## Risks

- `redirect_uri` phải được khai báo trong Valid redirect URIs của client, nếu
  không Keycloak trả lỗi trước cả màn hình login. Ghi rõ trong docs.
- BFF hiện chưa xác thực token, nên request BFF vẫn 200 dù token sai. Docs phải
  nói rõ đây là bước chuẩn bị, chưa phải kiểm chứng phân quyền.

## Verification

Chạy trên Keycloak 26.5.2 đang sống ở `localhost:8080` (realm `master`), 30/30 check pass:

- 13/13 request resolve thành URL tuyệt đối, không còn placeholder nào sót lại.
- `redirect_uri` ghép từ `{{bff_base_url}}/{{global_prefix}}/app` resolve đúng qua biến lồng nhau.
- Mọi biến collection tham chiếu đều có trong environment.
- 6 đường dẫn endpoint collection hardcode đều khớp discovery document do chính server phát ra.
- Replay test script của request 4, 5, 8 với body lỗi `invalid_grant`: không ném exception,
  giữ nguyên token cũ, vẫn xoá `auth_code` dùng-một-lần, và in `error_description` ra console.

Folder BFF chưa test live vì gateway port 3300 không chạy tại thời điểm kiểm tra.

## Code review — đã xử lý

Reviewer tìm ra 3 lỗi cao và 5 lỗi trung bình. Đã sửa toàn bộ phần thuộc phạm vi:

- Test script của request 4 và 5 ném `RangeError: Invalid time value` với mọi response
  lỗi (vì `body.expires_in` là `undefined`), che mất lỗi thật của Keycloak, ghi `undefined`
  đè lên token đang tốt, và bỏ qua bước xoá `auth_code`. Đã thêm nhánh kiểm tra status,
  đưa lệnh xoá `auth_code` lên trước mọi assertion, và in `error_description`.
- Thiếu guard `client_secret` — nguyên nhân lỗi phổ biến nhất ở lần chạy đầu. Đã thêm cho
  request 4, 5, 7, 8 kèm thông báo chỉ tới tab Credentials.
- `redirect_uri` hardcode host BFF. Đã đổi thành ghép từ `bff_base_url` + `global_prefix`,
  và script dùng `pm.variables.replaceIn` vì `pm.variables.get` không resolve biến lồng nhau.
- Guard cấp collection bắt buộc `client_id` cho cả request BFF. Đã tách thành guard theo
  từng folder.
- Request 8 xoá sạch token kể cả khi logout thất bại. Đã chỉ xoá khi thành công.
- Assertion discovery so khớp URL tuyệt đối nên vỡ vì dấu `/` thừa hoặc `127.0.0.1` vs
  `localhost`. Đã đổi sang so khớp pathname, phần issuer lệch chuyển thành cảnh báo.
- Request 3 follow redirect nên khi Postman còn cookie SSO sẽ đốt mất code vào BFF mà vẫn
  báo pass. Đã tắt follow redirect và tự lấy code từ header `Location`, có đối chiếu `state`.
- `id` của environment không phải UUID hợp lệ. Đã sửa.

## Dọn phần Postgres-cho-Keycloak (đã xử lý theo yêu cầu)

Keycloak không hề dùng Postgres: service không có biến `KC_DB` nào, không `depends_on`,
database `keycloak` không tồn tại, và realm nằm trong H2 tại
`/opt/keycloak/data/h2/keycloakdb.mv.db`. Toàn bộ scaffolding cho việc wire dở dang đã
được bỏ theo quyết định của người dùng:

- Xoá `docker/postgres-init/` cùng script tạo database `keycloak` (script này chưa từng
  chạy vì volume Postgres đã có dữ liệu từ trước).
- Bỏ mount `./docker/postgres-init:/docker-entrypoint-initdb.d` khỏi service `postgres`.
- Bỏ healthcheck của `postgres` — nó được thêm vào chỉ để Keycloak chờ database, mà
  quan hệ phụ thuộc đó không tồn tại.
- Bỏ exception `!docker/postgres-init` trong `.gitignore`, trả file này về nguyên trạng
  vì không còn gì dưới `docker/` là source code.
- Sửa comment ở volume của Keycloak để nói đúng sự thật: dữ liệu nằm trong H2 trong
  bind mount và sẽ mất nếu xoá thư mục đó.

`docker compose config` validate sạch sau thay đổi. Dữ liệu Postgres nằm trong bind mount
trên host nên việc container được tạo lại ở lần `up` kế tiếp không làm mất dữ liệu.
