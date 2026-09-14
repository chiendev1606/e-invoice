export enum InvoicePattern {
  GET = 'invoice.get',
  LIST = 'invoice.list',
  CREATE = 'invoice.create',
  UPDATE = 'invoice.update',
  DELETE = 'invoice.delete',
}

export enum ProductPattern {
  GET = 'product.get',
  LIST = 'product.list',
  CREATE = 'product.create',
  UPDATE = 'product.update',
  DELETE = 'product.delete',
}

export enum UserPattern {
  GET = 'user.get',
  LIST = 'user.list',
  CREATE = 'user.create',
  UPDATE = 'user.update',
  DELETE = 'user.delete',
}

export enum AuthorizerPattern {
  CREATE_KEYCLOAK_USER = 'keycloak.create-user',
  DELETE_KEYCLOAK_USER = 'keycloak.delete-user',
  UPDATE_KEYCLOAK_USER = 'keycloak.update-user',
  LOGIN_KEYCLOAK_USER = 'keycloak.login-user',
}
