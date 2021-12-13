import React, { useEffect, useState } from "react";
import { dbService, storageService } from "../fbase";
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import Nweet from "../components/Nweet";
import { v4 as uuidv4 } from 'uuid';
import * as url from "url";

const Home = ({ userObj }) => {

  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");

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
    const fileRef = await ref(storageService, `${userObj.uid}/${uuidv4()}`);
    const response = await uploadString(fileRef, attachment, "data_url");
    const attachmentUrl = await getDownloadURL(response.ref);
    console.log(attachmentUrl);
    // console.log(response.reference.getDownloadURL());

    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await addDoc(collection(dbService, "nweets"), nweetObj);
    await setNweet("");
  };

  const onChange = (event) => {
    const { target : { value } } = event;
    setNweet(value);
  }

  const onFileChange = (event) => {
    const { target: { files }} = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {

      const { currentTarget: { result }} = finishedEvent;
      setAttachment(result);
    }
    reader.readAsDataURL(theFile);
  }

  const onClearAttachmentClick = () => setAttachment(null);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment &&
        <div>
          <img src={attachment} width="50px" height="50px" />
          <button onClick={onClearAttachmentClick}>Clear</button>
        </div>
        }
      </form>
      <div>
        {nweets.map(nweet =>
            <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
        )}
      </div>
    </div>
      )
}

;
export default Home;