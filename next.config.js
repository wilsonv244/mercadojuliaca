/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_URL_PATH: "http://10.5.81.17",
    NEXT_PUBLIC_URL_KATA:
      "https://gateway.losandes.pe/kata-services/1.0/catalogos",
    NEXT_PUBLIC_URL_BACK: "http://localhost:5234",
    NEXT_URL_CPLATAM:
      "https://81y2hgfms8.execute-api.us-east-1.amazonaws.com/dev",
    NEXT_PUBLIC_URL_BUSINESS_LAYER: "http://127.0.0.1:8000",
  },
  webpack: (config, { isServer }) => {
    // Agregar regla para manejar archivos .node
    config.module.rules.push({
      test: /\.node$/,
      use: "null-loader",
    });

    return config;
  },
};

module.exports = nextConfig;
