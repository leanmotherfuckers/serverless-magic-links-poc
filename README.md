# Cognito magic links POC

This simple POC shows a good way to create a [user-friendly magic link login system](https://uxdesign.cc/user-friendly-magic-links-e39023ec3e2) using AWS Cognito, Lambda and the Serverless framework.

While functional and safe, this is not production-style code.

## User experience

Some important things to note about this approach, which is different from most other tutorials and example code found online:

* This creates login links that are valid for longer than the default 3 minutes limit in Cognito. Link expiry can be configured without any limits.
* You don't need to open the magic link in the same browser you requested the link in for your session to be approved.


## Online demo

[**View a live demo here »**](https://h7swmj8oc1.execute-api.eu-west-1.amazonaws.com/dev/)

Note that we've replaced the part of the code that would normally send the email with something that just outputs it to the browser, to simplify the demo code.


## How it works

1. When you click 'Sign in' after entering your email address, the React app performs a `POST /login`.
2. This triggers a lambda that sets a custom user attribute called `authChallenge` with a value in the form of `{authChallenge},{timestamp}`. It will fail if there is no user with that email address defined. `authChallenge` is a random UUID.
3. When the user clicks on the email link (which will have a format of `/sign-in/{email},{authChallenge}`), the Amplify javascript library is used to sign the user in.
4. It will call `signIn(email)` first, followed by `sendCustomChallengeAnswer(authChallenge)`. Upon completion, Amplify automatically stores the resulting JWT in a cookie.
5. It then redirects back to the home route, where the user will now be signed in.


## Room for improvement

* Use a more deterministic method for generating `authChallenge`, so that if the user accidentally sends themselves more than one magic link email in a short period of time, the second send doesn't make the first link invalid.


## How scalable is this?

This does a `AdminUpdateUserAttributes` request on every login. That method has a soft limit of 5 calls per second, which should be sufficient for most user bases, as the chance of more than 5 users signing in at the exact same second is probably very unlikely unless you have 50k+ active users.

If so, you could ask AWS to raise that soft limit, and you should be good for at least another 250k MAUs. After that, it be time to start looking into something more robust to manage your authentication needs :)
