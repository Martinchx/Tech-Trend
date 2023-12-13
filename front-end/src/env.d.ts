interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly NG_APP_ENV: string;
  readonly NG_APP_ANGULAR_ENV: string;
  readonly NG_APP_BACKEND_URL_DEVELOPMENT: string;
  readonly NG_APP_BACKEND_URL_PRODUCTION: string;
  readonly NG_APP_FRONTEND_URL_DEVELOPMENT: string;
  readonly NG_APP_FRONTEND_URL_PRODUCTION: string;
  [key: string]: any;
}