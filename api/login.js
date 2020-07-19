const { v4: uuid } = require('uuid');
const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.handler = async(event) => {

    try {
        const { email } = JSON.parse(event.body);

        // Store challenge as a custom attribute in Cognito
        const authChallenge = uuid();
        await cognito.adminUpdateUserAttributes({
            UserAttributes: [
                {
                    Name: 'custom:authChallenge',
                    Value: `${authChallenge},${Math.round((new Date()).valueOf() / 1000)}`
                }
            ],
            UserPoolId: process.env.USER_POOL_ID,
            Username: email
        }).promise();

        // NOTE: Normally, here is where you would send an email with this URL, not output it back to the user!

        const url = `${process.env.URL}/sign-in/${email},${authChallenge}`;
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                demoUrl: url
            })
        };
    } catch (e) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Sorry, we could not find your account.',
                errorDetail: e.message
            })
        };
    }
};
