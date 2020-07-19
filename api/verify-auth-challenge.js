const LINK_TIMEOUT = 30 * 60; // number of seconds the magic link should be valid

module.exports.handler = async(event) => {

    // Get challenge and timestamp from user attributes
    const [authChallenge, timestamp] = (event.request.privateChallengeParameters.challenge || '').split(',');

    // 1. Check if code is equal to what we expect...
    if (event.request.challengeAnswer === authChallenge) {
        // 2. And whether the link hasn't timed out...
        if (Number(timestamp) > (new Date()).valueOf() / 1000 - LINK_TIMEOUT) {
            event.response.answerCorrect = true;
            return event;
        }
    }

    // Fallback
    event.response.answerCorrect = false;
    return event;

};
