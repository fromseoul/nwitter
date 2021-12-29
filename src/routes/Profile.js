import React, { useCallback, useEffect, useState } from "react";
import { authService, dbService } from "../fbase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useHistory } from "react-router";

const Profile = ({ userObj, refreshUser }) => {

  const history = useHistory();

  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = async () => {
    await authService.signOut();
    history.push('/');
  }

  const getMyNweets = useCallback(async () => {
    const nweets = await query(collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt")
      );
    const querySnapshot = await getDocs(nweets);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, ">", doc.data());
    })
  }, [userObj.uid]);

  useEffect(() => {
    getMyNweets();
   }, [getMyNweets]);

  const onChange = (event) => {
    const { target: { value } } = event;
    setNewDisplayName(value);
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    if (userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, { displayName: newDisplayName });
    }
    refreshUser();
  }

  return (
      <>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Display name"
            onChange={onChange}
            value={newDisplayName}
          />
          <input type="submit" value="Update Profile" />
        </form>
        <button onClick={onLogOutClick}>Log Out</button>
      </>
  )
};

export default Profile;