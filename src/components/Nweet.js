import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService } from "../fbase";

const Nweet = ({ nweetObj, isOwner }) => {

  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);

    if (ok) await deleteDoc(NweetTextRef);
  }

  const toogleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(dbService, "nweets", `${nweetObj.id}`),
      { text: newNweet });
    await toogleEditing();
  }

  const onChange = (e) => {
    const { target: { value }} = e;
    setNewNweet(value);
  }

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input type="text" onChange={onChange} placeholder="Edit your nweet" value={newNweet} required />
            <input type="submit" />
          </form>
          <button onClick={toogleEditing}>Cancel</button>
        </>
      ) :
        (
          <>
            <h4>{nweetObj.text}</h4>
            {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} alt={nweetObj.id} height={50} width={50} />}
            {isOwner &&
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toogleEditing}>Edit Nweet</button>
            </>}
          </>
        )
      }
    </div>
  );
};
export default Nweet;