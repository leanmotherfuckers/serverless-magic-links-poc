module.exports.handler = async(event) => {

    // Stop if user can't be found
    if (event.request.userNotFound) {
        event.response.failAuthentication = true;
        event.response.issueTokens = false;
        return event;
    }

    // Check result of last challenge
    if (event.request.session && event.request.session.length && event.request.session.slice(-1)[0].challengeResult === true) {
        // The user provided the right answer - issue their tokens
        event.response.failAuthentication = false;
        event.response.issueTokens = true;
        return event;
    }

    // Present a new challenge if we haven't received a correct answer yet
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = 'CUSTOM_CHALLENGE';
    return event;

};
