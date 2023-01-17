/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.gravatar.com", "nicecode.cf"],
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
