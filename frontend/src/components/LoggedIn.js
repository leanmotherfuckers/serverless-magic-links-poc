import React, { useEffect, useState } from "react";
import Auth from "@aws-amplify/auth";

export default () => {
    const [session, setSession] = useState(null);

    const getSession = async() => {
        try {
            const user = await Auth.currentSession();
            setSession(user);
        } catch (e) {
        }
    };

    const signOut = async() => {
        await Auth.signOut();
        typeof window !== 'undefined' && window.location.reload();
    };

    useEffect(() => {
        getSession();
    }, []);

    return (
        <>
            <h1>Hi, user!</h1>

            <p>You're now signed in. Awesome, right?</p>
            <button onClick={signOut}>Sign out</button>

            <p>Session object:</p>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </>
    );
}
