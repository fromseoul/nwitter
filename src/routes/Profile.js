import React, { useState } from 'react';
import { authService } from "../fbase";
import { useHistory } from "react-router";

function Profile({ userObj, refreshUser }) {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  // const getMyNweets = async () => {
  //   const nweets = await dbService.collection("nweets")
  //     .where("creatorId", "==", userObj.uid)
  //     .orderBy("createdAt", "desc")
  //     .get();
  //   console.log(nweets.docs.map(doc => doc.data()));;
  // }

  // useEffect(() => {
  //   getMyNweets();
  // }, []);

  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
  }

  const onChange = (event) => {
    const { value } = event.target;
    setNewDisplayName(value);
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      await refreshUser();
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} value={newDisplayName} placeholder="Display name" type="text" />
        <input placeholder="Update Profile" type="submit" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  );
}

export default Profile;