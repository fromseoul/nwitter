import React, { useState } from 'react';
import { dbService, storageService } from "../fbase";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

function NweetFactory({userObj}) {

  const [nweet, setNweet] = useState('');
  const [attachment, setAttachment] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();

    let attachmentUrl = "";

    if (attachment !== "") {
      const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl
    }

    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setAttachment("");
  };

  const onChange = (event) => {
    const {value} = event.target;
    setNweet(value);
  }

  const onFileChange = (event) => {
    const {files} = event.target;
    const theFile = files[0];

    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {result} = finishedEvent.currentTarget;
      setAttachment(result);
    }
    reader.readAsDataURL(theFile);
  }

  const onClearAttachment = () => setAttachment(null);

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input className="factoryInput__input" value={nweet} onChange={onChange} type="text"
               placeholder="What's on your mind?" maxLength={120}/>
        <input type="submit" value="&rarr;" className="factoryInput__arrow"/>
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus}/>
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        style={{
        opacity: 0,
        }}
        onChange={onFileChange}
      />
      {attachment &&
      <div className="factoryForm__attachment">
        <img
          alt=""
          src={attachment}
          width={50}
          height={50}
          style={{
          backgroundImage: attachment,
          }}
        />
        <div className="factoryForm__clear" onClick={onClearAttachment}>
          <span>Remove</span>
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>
      }
    </form>
  );
}

export default NweetFactory;