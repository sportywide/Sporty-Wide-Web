export interface ITokenPayload {
  iat: number;
  exp: number;
  userId: string;
  scope: string;
  brand: string;
  region: string;
  environment: string;
  userType: string;
  provider: string;
  aud: string;
  iss: string;
  sub: string;
  jti: string;
}
