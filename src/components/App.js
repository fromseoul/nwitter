import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user);
      }
      setInit(true);
    });
   }, [])

  const refreshUser = () => {
    setUserObj({ displayName: userObj.displayName, uid: userObj.uid, updateProfile: (args) => userObj.updateProfile(args) });
  }

  return <>
    {init ? <AppRouter
      isLoggedIn={Boolean(userObj)}
      userObj={userObj}
      refreshUser={refreshUser}
      />
      : "Initializing..."}
    <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
  </>;
}

export default App;
