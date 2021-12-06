import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";

const Home = ({ userObj }) => {

  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  const getNweets = async () => {
    const dbNweets = await getDocs(collection(dbService, "nweets"));
    dbNweets.forEach(document => {
      const nweetObject = {
        ...document.data(),
        id: document.id,
      }
      setNweets(prev => [nweetObject, ...prev]);
    });
  }

  useEffect(() => {
    onSnapshot(collection(dbService, "nweets"), snapshot => {
       const nweetArray = snapshot.docs.map(doc => ({
         id: doc.id,
         ...doc.data()
       }));
      setNweets(nweetArray);
    });

   }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    await addDoc(collection(dbService, "nweets"), {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    await setNweet("");
  };

  const onChange = (event) => {
    const { target : { value } } = event;
    setNweet(value);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets.map(nweet =>
            <div key={nweet.id}>
              <h4>{nweet.text}</h4>
            </div>
        )}
      </div>
    </div>
      )
}

;
export default Home;