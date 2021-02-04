import React, { Component, useContext, useState } from 'react';
import {videoRef,imageRef} from '../../firebase';
import {fireDB} from '../../firebase';
import firebase from 'firebase/app';
import {firebaseContext} from '../../provider/FirebaseProvider';

function ViewVideo () {
    const [videoSrc, setVideoSrc] = useState("");
    const {user, dataLoad} = useContext(firebaseContext);

    return (
        <div>
            <p>This is the page for viewing an uploaded video</p>
            <video className="recorder__player" src={dataLoad.userData.userUploads[0].videoSrc} controls controlsList="nodownload"/>
        </div>
    )
}

export default ViewVideo
