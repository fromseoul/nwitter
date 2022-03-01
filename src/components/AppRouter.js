import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Navigation from "./Navigation";
import Profile from "../routes/Profile";
import {Redirect} from "react-router";

function AppRouter({ isLoggedIn }) {

    return (
        <Router>
            {isLoggedIn && <Navigation />}
            <Switch>
                {isLoggedIn ?
                    <>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route exact path="/profile">
                            <Profile />
                        </Route>
                        <Redirect from="*" to="/" />
                    </>
                    :
                    <>
                        <Route exact path="/">
                            <Auth />
                        </Route>
                        <Redirect from="*" to="/" />
                    </>
                }
            </Switch>
        </Router>
    )
}

export default AppRouter;