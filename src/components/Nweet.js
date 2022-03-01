import React, { useState } from 'react';
import { dbService } from "../fbase";

function Nweet({ nweetObj, isOwner }) {

  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this nweet?');
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
    }
  };

  const toggleEditing = () => {
    setEditing(prev => !prev);
  }

  const onChange = (event) => {
    const { value } = event.target;
    setNewNweet(value);
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({ text: newNweet });
    setEditing(false);
  }

  return (
    <div>
      {editing ?
        <>
          <form onSubmit={onSubmit}>
            <input onChange={onChange} type="text" placeholder="Edit your nweet" value={newNweet} required />
            <input type="submit" value="Update Nweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
        :
        <>
          <h4>{nweetObj.text}</h4>
          {isOwner &&
          <>
            <button onClick={onDeleteClick}>Delete Nweet</button>
            <button onClick={toggleEditing}>Edit Nweet</button>
          </>}
        </>
        }
    </div>
  );
}

export default Nweet;