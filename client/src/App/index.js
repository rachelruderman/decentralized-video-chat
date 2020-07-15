import React from 'react';
import { Chat } from './Chat';
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

export const App = () => {
    // todo: add react router and other pages
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/chat">
                    <Chat />
                </Route>
                <Route path="/newcall">
                    <div style={{ color: 'white' }}>New call page</div>
                </Route>
                <Route exact path="/">
                    <div style={{ color: 'white' }}>home page</div>
                </Route>
                <Redirect to='/' />
            </Switch>
        </BrowserRouter>
    );
}