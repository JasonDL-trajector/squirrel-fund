/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: process.env.API_URL,
        REGION: process.env.REGION,
        TABLE_NAME: process.env.TABLE_NAME,
    },
};

export default nextConfig;
