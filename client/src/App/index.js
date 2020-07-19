import React from 'react';
import { Chat } from './Chat';
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

export const App = () => {

    const renderHeader = () => (
        <div id="header">
            <a target="_blank" href="/">
                <img src="/images/logo.svg" alt="Neon" width="48" height="48" />
                <p>Zipcall</p>
            </a>
        </div>
    )

    return (
        <BrowserRouter>
            {renderHeader()}
            <Switch>
                <Route path="/chat" component={Chat} />
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