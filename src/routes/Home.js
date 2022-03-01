import React, { useEffect, useState } from 'react';
import { dbService } from "../fbase";
import Nweet from "../components/Nweet";

function Home({ userObj }) {

  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    dbService.collection("nweets").onSnapshot(snapshot => {
      const nweetArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNweets(nweetArray);
    });
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    dbService.collection("nweets").add({
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setNweet("");
  };

  const onChange = (event) => {
    const {value} = event.target;
    setNweet(value);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
        <input type="submit" value="Nweet"/>
      </form>
      {nweets.map((nweet) => {
        return (
          <Nweet nweetObj={nweet} key={nweet.id} isOwner={nweet.creatorId === userObj.uid} />
        )
      })}
    </div>
  );
}

export default Home;