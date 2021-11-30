import React, { useState } from "react";
import { authService } from "../fbase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import firebase from "firebase/compat";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
      event.preventDefault();
      const { target: { name, value } } = event;
      if (name === "email") {
        setEmail(value);
      } else if (name === "password") {
        setPassword(value);
      }
    };

    const onsubmit = async (event) => {
      event.preventDefault();
      try {
        let data;
        if (newAccount) {
          data = await createUserWithEmailAndPassword(
              authService,
              email,
              password
          );
        } else {
          data = await signInWithEmailAndPassword(authService, email, password);
        }
        console.log(data);
      } catch(error) {
        setError(error.message);
      }
    };

    const toggleAccount = () => setNewAccount((prev) => !prev);
    const onSocialClick = async (event) => {
      const { target: { name } } = event;
      console.log(name);
      let provider;
      if (name === 'google') {
        provider = new GoogleAuthProvider();
      } else if (name === 'github') {
        provider = new GithubAuthProvider();
      }
      const data = await signInWithPopup(authService, provider);
      console.log(data);
    }

    return (
        <div>
          <form onSubmit={onsubmit}>
            <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange} />
            <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} />
            <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
            {error}
          </form>
          <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
          <div>
            <button onClick={onSocialClick} name="google">Continue with Google</button>
            <button onClick={onSocialClick} name="github">Continue with Github</button>
          </div>
        </div>
    );
};
export default Auth;