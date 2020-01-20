variable "env_vars" {
  type = object({
    postgres_username: string,
    postgres_password: string,
    postgres_db: string,
    mongo_username: string,
    mongo_password: string,
    mongo_db: string,
    jwt_secret: string,
    facebook_client_secret: string,
    google_client_secret: string,
    cookie_secret: string,
    smtp_username: string,
    smtp_password: string,
    logz_token: string
  })
}
