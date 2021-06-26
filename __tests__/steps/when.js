require("dotenv").config();
const AWS = require("aws-sdk");

const we_invoke_confirmUserSignup = async (username, name, email) => {
  const handler = require("../../functions/confirm-user-sign-up").handler;

  const context = {};
  const event = {
    version: "1",
    region: process.env.AWS_REGION,
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    userName: username,
    triggerSource: "PostConfirmation_ConfirmSignUp",
    request: {
      userAttributes: {
        sub: username,
        "cognito:email_alias": email,
        "cognito:user_status": "CONFIRMED",
        email_verified: "false",
        name: name,
        email: email,
      },
    },
    response: {},
  };

  await handler(event, context);
};

const a_user_signs_up = async (name, email, password) => {
  const cognito = new AWS.CognitoIdentityServiceProvider();

  const userpoolId = process.env.COGNITO_USER_POOL_ID;
  const clientId = process.env.WEB_COGNITO_USER_POOL_CLIENT_ID;

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

module.exports = {
  we_invoke_confirmUserSignup,
  a_user_signs_up,
};
