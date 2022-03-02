import React, { useEffect, useState } from 'react';
import { dbService } from "../fbase";
import Nweet from "../components/Nweet";

function Home({ userObj }) {

  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState();

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

  const onFileChange = (event) => {
    const { files } = event.target;
    const theFile = files[0];

    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const { result } = finishedEvent.currentTarget;
      setAttachment(result);
    }
    reader.readAsDataURL(theFile);
  }

  const onClearAttachment = () => setAttachment(null);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
        <input type="file" accept="image/*"  onChange={onFileChange} />
        <input type="submit" value="Nweet"/>
        {attachment &&
        <div>
          <img src={attachment} width={50} height={50} />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
        }
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