export interface Env {
  PORT: number;

  // gRPC (servidor, entrada síncrona desde api-gateway)
  PRODUCTS_GRPC_URL: string;

  // Database
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;

  // Storage (Cloudinary)
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}
