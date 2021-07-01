require("dotenv").config();
const AWS = require("aws-sdk");

const userpoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.WEB_COGNITO_USER_POOL_CLIENT_ID;

const sign_user_up = async (name, email, password) => {
  const cognito = new AWS.CognitoIdentityServiceProvider();

  const response = await cognito
    .signUp({
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: "name",
          Value: name,
        },
      ],
    })
    .promise();

  const userName = response.UserSub;
  console.log(`[${email}] - user has signed up ${userName}`);

  await cognito
    .adminConfirmSignUp({
      UserPoolId: userpoolId,
      Username: userName,
    })
    .promise();

  console.log(`[${email} - confirmed sign up]`);

  return {
    username: userName,
    name,
    email,
  };
};

const sign_user_in = async (username, password) => {
  const cognito = new AWS.CognitoIdentityServiceProvider();

  const auth = await cognito
    .initiateAuth({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    })
    .promise();

  console.log(`[${username} - confirm sign in]`);

  return {
    idToken: auth.AuthenticationResult.IdToken,
    accessToken: auth.AuthenticationResult.AccessToken,
  };
};

module.exports = {
  sign_user_up,
  sign_user_in,
};
