import React, { useCallback, useEffect } from "react";
import { authService, dbService } from "../fbase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useHistory } from "react-router";

const Profile = ({ userObj }) => {

  const history = useHistory();

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

  return (
      <>
        <button onClick={onLogOutClick}>Log Out</button>
      </>
  )
};

export default Profile;