import React, { useEffect, useState } from "react";
import Auth from "@aws-amplify/auth";
import { Redirect } from "react-router";

export default ({ match: { params: { challenge } } }) => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const finishSignin = async(challenge) => {
        try {
            const [email, code] = challenge.split(',');
            const user = await Auth.signIn(email);
            await Auth.sendCustomChallengeAnswer(user, code);
            await Auth.currentSession();
            setSuccess(true);
        } catch (e) {
            setError(e);
        }
    };

    useEffect(() => {
        finishSignin(challenge);
    }, [challenge]);

    if (error) {
        return (
            <>
                <h1>Failed finishing sign-in</h1>
                <pre>{JSON.stringify(error, null, 2)}</pre>
            </>
        );
    }

    if (success) {
        return (
            <Redirect to="/"/>
        );
    }

    return (<p>Signing you in...</p>);
}
