const config = {

  apiGateway: {
    REGION: process.env.REGION,
    API_URL: process.env.API_URL,
  },

  s3: {
    REGION: process.env.REGION,
    BUCKET: process.env.BUCKET,
  },

  cognito: {
    REGION: process.env.REGION,
    USER_POOL_ID: process.env.USER_POOL_ID,
    APP_CLIENT_ID: process.env.USER_POOL_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID,
    
  },
}

export default config;