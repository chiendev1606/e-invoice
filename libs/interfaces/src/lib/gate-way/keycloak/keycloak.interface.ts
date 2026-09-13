export type exchangeClientTokenType = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  id_token: string;
  scope: string;
};

export type createKeycloakUserRequestType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
