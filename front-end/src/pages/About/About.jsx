import React, { Component, useContext, useState } from 'react';
import './About.scss';
import {videoRef,imageRef} from '../../firebase';
import {fireDB} from '../../firebase';
import firebase from 'firebase/app';
import {firebaseContext} from '../../provider/FirebaseProvider';

function About () {
const [videoSrc, setVideoSrc] = useState("");
const {user, dataLoad} = useContext(firebaseContext);


    const loadVideoData = () => {
        setVideoSrc(dataLoad.userData.userUploads[0].videoSrc)
    }

    console.log(dataLoad);
    return (
        <div className="about">
            <div className="about__container">
                <h2 className="about__container-heading">About and FAQS's</h2>
                <video className="recorder__player" src={videoSrc} controls controlsList="nodownload"/>
                <button onClick={()=>{loadVideoData()}}>Load</button>
            </div>
        </div>
    )
}

export default About
