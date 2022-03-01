import React from 'react';
import {authService} from "../fbase";

function Profile() {

    const onLogOutClick = () => {
        authService.signOut();
    }

    return (
        <div><button onClick={onLogOutClick}>Log Out</button></div>
    );
}

export default Profile;