import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";
import { Redirect } from "react-router";

const AppRouter = ({ isLoggedIn, userObj }) => {

  return (
      <Router>
        {isLoggedIn && <Navigation />}
        <Switch>
          {isLoggedIn ?
              <>
                <Route exact path="/">
                  <Home userObj={userObj} />
                </Route>
                <Route exact path="/profile">
                  <Profile userObj={userObj} />
                </Route>
                <Redirect from="*" to="/" />
              </>
              :
              <>
                <Route exact path="/">
                  <Auth/>
                </Route>
                <Redirect from="*" to="/" />
              </>
              }
        </Switch>
      </Router>
  )
};
export default AppRouter;
