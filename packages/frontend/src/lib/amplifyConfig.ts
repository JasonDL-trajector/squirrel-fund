// eslint-disable-next-line @typescript-eslint/naming-convention
import { Amplify, API } from 'aws-amplify';
import config from '../config'; 

const configureAmplify = () => {

  console.log(config);
  
  Amplify.configure({

    Auth: {
      mandatorySignIn: true,
      region: config.cognito.REGION,
      UserPoolId: config.cognito.USER_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      
    },
    Storage: {
      region: config.s3.REGION,
      bucket: config.s3.BUCKET,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
    },
    API: {
      endpoints: [
        {
          name: "deposit",
          endpoint: config.apiGateway.API_URL,
          region: config.apiGateway.REGION,
        },
      ],
    },
  });

  API.configure({
    Auth: {
      mandatorySignIn: true,
      region: config.cognito.REGION,
      UserPoolId: config.cognito.USER_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      
    },
    Storage: {
      region: config.s3.REGION,
      bucket: config.s3.BUCKET,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
    },
    API: {
      endpoints: [
        {
          name: "deposit",
          endpoint: config.apiGateway.API_URL,
          region: config.apiGateway.REGION,
        },
      ],
    },
  })
};

export default configureAmplify;
