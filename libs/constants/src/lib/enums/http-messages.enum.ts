export enum HttpMessage {
  // 2xx
  OK = 'Success',
  CREATED = 'Resource created successfully',
  ACCEPTED = 'Request accepted for processing',
  NO_CONTENT = 'No content',

  // 3xx
  MOVED_PERMANENTLY = 'Resource has moved permanently',
  NOT_MODIFIED = 'Resource not modified',

  // 4xx
  BAD_REQUEST = 'Invalid request',
  UNAUTHORIZED = 'Authentication required',
  PAYMENT_REQUIRED = 'Payment required',
  FORBIDDEN = 'You do not have permission to access this resource',
  NOT_FOUND = 'Resource not found',
  METHOD_NOT_ALLOWED = 'HTTP method not allowed',
  NOT_ACCEPTABLE = 'Requested format not acceptable',
  REQUEST_TIMEOUT = 'Request timed out',
  CONFLICT = 'Resource conflict',
  GONE = 'Resource is no longer available',
  PRECONDITION_FAILED = 'Precondition failed',
  PAYLOAD_TOO_LARGE = 'Request payload too large',
  URI_TOO_LONG = 'Request URI too long',
  UNSUPPORTED_MEDIA_TYPE = 'Unsupported media type',
  UNPROCESSABLE_ENTITY = 'Validation failed',
  TOO_MANY_REQUESTS = 'Too many requests, please try again later',

  // 5xx
  INTERNAL_SERVER_ERROR = 'Internal server error',
  NOT_IMPLEMENTED = 'Feature not implemented',
  BAD_GATEWAY = 'Bad gateway',
  SERVICE_UNAVAILABLE = 'Service temporarily unavailable',
  GATEWAY_TIMEOUT = 'Gateway timeout',
  INSUFFICIENT_STORAGE = 'Insufficient storage',
}
