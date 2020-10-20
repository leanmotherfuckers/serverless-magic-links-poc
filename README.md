# Cognito magic links POC

This simple POC shows a good way to create a [user-friendly magic link login system](https://uxdesign.cc/user-friendly-magic-links-e39023ec3e2) using AWS Cognito, Lambda and the Serverless framework.

While functional and safe, this is not production-style code.

## How to run this example

### 1. Download and install dependencies

```
git clone git@github.com:mojitocoder/serverless-magic-links-poc.git
cd serverless-magic-links-poc
npm install
```

### 2. Create your unique environment

This step is optional. You can skip this step if you are the only person to deploy this solution to a unique combination of AWS Account + AWS Region.

To ensure the deployment does not fail or interupt with another deployment from a different user, make two changes as follows::

1. Open `$/frontend/package.json`, change the value of `homepage` to a unique value, e.g. `lewis`.
2. Open `$/frontend/src/App.js`, change the value of `basename` to your value, e.g. `lewis`
3. Open `$/serverless.yml`, make a similar change for `custom.stage` tag, e.g from ` stage: ${opt:stage, 'dev'}` to ` stage: ${opt:stage, 'lewis'}`

### 3. Deploy the project

You will need to deploy the project twice to make it work properly. The sequence is: Deploy => Get some returned values to make changes to the frontend's settings => Deploy again to push updated frontend.

1. Run `npm run deploy` to do the first deployment

2. Capture the URL listed in `endpoints`' `POST` value, it looks like this:
   ```
   endpoints:
     POST - https://h3avtopjn8.execute-api.eu-west-1.amazonaws.com/dev/login
   ```

Note: If you lost the output of the previous `npm run deploy` command on the terminal, you can run `npm run sls -- info` to get the information back.

3. Open `$/frontend/src/components/LoginForm.js`, replace the value of constant `loginUrl` (line 4) with the captured URL.

4. Run `npm run sls -- info --verbose` to get the values of `UserPoolClientId` and `UserPoolId` from the `Stack Outputs`. They look like this:

   ```
   Stack Outputs
   UserPoolClientId: 3l4s9hjp44tiq0jpab3f4nlhrj
   UserPoolId: eu-west-1_v0L9STrqo
   ```

5. Put these two values into the appropriate places in `$/frontend/src/authConfig.js`. Whilst you are here, remember to change the `region` value in this file if this service is deployed to a different region from the default of `eu-west-1`.

6. Deploy the project again using `npm run deploy` to push the latest changes to the frontend to AWS.

### 4. Create users

Before you can test the magic link, you need to create at least one user in the UserPool.

1. Head AWS web console, go to `Cognito` service then `Manage User Pools`, e.g. https://eu-west-1.console.aws.amazon.com/cognito/users/?region=eu-west-1
2. Select the pool created by your service, e.g. `sls-magic-link-poc-user-pool-lewis`
3. Go to `General settings \ Users and groups` to create a user. Use an email for username.

### 5. Test magic links 

1. Go to the login page's URL of your service, e.g. `https://h3avtopjn8.execute-api.eu-west-1.amazonaws.com/dev`
2. Make sure you put in an email address of a user you have already created in the previous step.

## Clean up

Once you have finished with your testing, make sure you run:
```
npm run sls -- remove
```
to remove all the artefacts of your service from AWS.


## User experience

Some important things to note about this approach, which is different from most other tutorials and example code found online:

* This creates login links that are valid for longer than the default 3 minutes limit in Cognito. Link expiry can be configured without any limits.
* You don't need to open the magic link in the same browser you requested the link in for your session to be approved.


## Online demo

[**View a live demo here »**](https://h7swmj8oc1.execute-api.eu-west-1.amazonaws.com/dev/)

Note that we've replaced the part of the code that would normally send the email with something that just outputs it to the browser, to simplify the demo code.


## How does it work?

1. When you click 'Sign in' after entering your email address, the React app performs a `POST /login`.
2. This triggers a lambda that sets a custom user attribute called `authChallenge` with a value in the form of `{authChallenge},{timestamp}`. It will fail if there is no user with that email address defined. `authChallenge` is a random UUID.
3. When the user clicks on the email link (which will have a format of `/sign-in/{email},{authChallenge}`), the Amplify javascript library is used to sign the user in.
4. It will call `signIn(email)` first, followed by `sendCustomChallengeAnswer(authChallenge)`. Upon completion, Amplify automatically stores the resulting JWT in a cookie.
5. It then redirects back to the home route, where the user will now be signed in.


## How safe is it?

You won't be able to get access to a user's account without knowing their email address and having access to their inbox.

Having the `authChallenge` as a random UUID adds enough entropy to make brute-force attacks unlikely, especially in combination with the login throttling that AWS Cognito has as a built-in feature.

Adding an expiry date to the links (30 minutes in this example) means gaining access to old emails won't give attackers access to their accounts.


## How scalable is this?

This does a `AdminUpdateUserAttributes` request on every login. That method has a soft limit of 5 calls per second, which should be sufficient for most user bases, as the chance of more than 5 users signing in at the exact same second is probably very unlikely unless you have 50k+ active users.

If so, you could ask AWS to raise that soft limit, and you should be good for at least another 250k MAUs. After that, it be time to start looking into something more robust to manage your authentication needs :)


## How can we further improve UX?

* Use a more deterministic method for generating `authChallenge`, so that if the user accidentally sends themselves more than one magic link email in a short period of time, the second send doesn't make the first link invalid. However, introducing determinism might make the system less safe if done incorrectly.
