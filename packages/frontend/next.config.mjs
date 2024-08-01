/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: process.env.API_URL,
        REGION: process.env.REGION,
        TABLE_NAME: process.env.TABLE_NAME,
        BUCKET: process.env.BUCKET,
        IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID,
        USER_POOL_ID: process.env.USER_POOL_ID,
        USER_POOL_CLIENT_ID: process.env.USER_POOL_CLIENT_ID,
    },
};

export default nextConfig;
