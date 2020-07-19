import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Main from "./routes/Main";
import FinishSignIn from "./routes/FinishSignIn";


export default () => (
    <BrowserRouter basename="/dev">
        <Switch>
            <Route path="/sign-in/:challenge" component={FinishSignIn}/>
            <Route path="/" component={Main}/>
        </Switch>
    </BrowserRouter>
)
