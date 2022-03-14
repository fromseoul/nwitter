import React, { useState } from 'react';
import { authService } from "../fbase";

function AuthForm() {

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

  return (
    <div>
      <form onSubmit={onSubmit} className="container">
        <input className="authInput" name="email" placeholder="Email" type="email" required value={email} onChange={onChange}/>
        <input className="authInput" name="password" placeholder="Password" type="password" required value={password} onChange={onChange}/>
        <input className="authInput authSubmit" value={newAccount ? "Create Account" : "Log In"} type="submit"/>
        {error && <span className="authError">{error}</span>}
      </form>
      <span className="authSwitch" onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
    </div>
  );
}

export default AuthForm;