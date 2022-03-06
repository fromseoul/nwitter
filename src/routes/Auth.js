import React, { useState } from 'react';
import { authService, firebaseInstance } from "../fbase";

function Auth() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');

  const onChange = (event) => {
    const {target: {name, value}} = event;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      if (newAccount) {
        await authService.createUserWithEmailAndPassword(email, password);
      } else {
        await authService.signInWithEmailAndPassword(email, password);
      }
    }catch (e) {
      setError(e.message);
    }

  };

  const toggleAccount = () => setNewAccount(prev => !prev);

  const onSocialClick = async (event) => {
    const {name} = event.target;
    let provider;

    if (name === 'google') {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    await authService.signInWithPopup(provider);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="email" placeholder="Email" type="email" required value={email} onChange={onChange}/>
        <input name="password" placeholder="Password" type="password" required value={password} onChange={onChange}/>
        <input value={newAccount ? "Create Account" : "Log In"} type="submit"/>
        {error}
      </form>
      <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
      <div>
        <button onClick={onSocialClick} name="google">Continue with Google</button>
        <button onClick={onSocialClick} name="github">Continue with Github</button>
      </div>
    </div>
  );
}

export default Auth;