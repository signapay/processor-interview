declare module "bun" {
  interface Env {
    KINDE_DOMAIN: string;
    KINDE_CLIENT_ID: string;
    KINDE_CLIENT_SECRET: string;
    KINDE_REDIRECT_URI: string;
    KINDE_LOGOUT_REDIRECT_URI: string;
    ENCRYPTION_KEY: string;
  }
}
