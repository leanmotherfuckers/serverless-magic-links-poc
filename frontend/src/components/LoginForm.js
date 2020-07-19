import React, { useState } from "react";
import axios from "axios";

const loginUrl = 'https://h7swmj8oc1.execute-api.eu-west-1.amazonaws.com/dev/login'; // TODO: should be an env var

export default () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const submit = async(e) => {
        e.preventDefault();

        const email = e.target.getElementsByTagName("input")[0].value

        setLoading(true);
        try {
            const {data} = await axios.post(loginUrl, {email})
            setResult(data)
            setLoading(false)
        }catch(e){
            console.log('Request failed', e)
            setResult(e.response.data)
            setLoading(false)
        }

    };

    if (loading) {
        return (<p>Loading...</p>);
    }

    if (result) {
        if (result.error) {
            return (
                <>
                    <h1>Login error</h1>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </>
            );
        } else {
            return (
                <>
                    <h1>Nice!</h1>
                    <p>Normally, you would now get a message in your email with the login link.</p>
                    <p>For this demo however, we immediately return the login confirm URL to the client, so click below
                        to finish your sign-in:</p>
                    <p><a href={result.demoUrl} target="_blank">{result.demoUrl}</a></p>
                </>
            );
        }
    }

    return (
        <>
            <h1>Sign in</h1>
            <p>Enter your email address below <strong>(use thomas@schof.co for demo!)</strong></p>
            <form onSubmit={(e) => submit(e)}>
                <input type="email" required placeholder="john@appleseed.com"/>
                <button type={submit}>Sign in</button>
            </form>
        </>
    );
}
