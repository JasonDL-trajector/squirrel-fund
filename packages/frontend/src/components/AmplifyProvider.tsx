// src/components/AmplifyProvider.tsx
"use client";
import { ReactNode, useEffect } from 'react';
import { Amplify} from 'aws-amplify';
import config from '../config';

interface AmplifyProviderProps {
  children: ReactNode;
}

const AmplifyProvider = ({ children }: AmplifyProviderProps) => {
  useEffect(() => {
    console.log("Configuring Amplify");
    Amplify.configure({
      Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID,
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
  }, []);

  return <>{children}</>;
};

export default AmplifyProvider;
