import React, { Component, useContext, useState, useEffect } from 'react';
import {videoRef,imageRef} from '../../firebase';
import {fireDB} from '../../firebase';
import firebase from 'firebase/app';
import {firebaseContext} from '../../provider/FirebaseProvider';
import ProductionNav from '../../components/ProductionNav/ProductionNav';
import './ViewVideo.scss'

function ViewVideo () {
    const {user, dataLoad} = useContext(firebaseContext);
    const [interviewStage,setInterviewStage] = useState("review");
    const [bookmarkDetails, setBookmarkDetails] = useState(null);
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
      function check() {
        if (!window.screenTop && !window.screenY) {
           setFullscreen(false);
           console.log("false");
        } else {
          setFullscreen(true);
          console.log("true");
        }
    }
      ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange"].forEach(
        eventType => document.addEventListener(eventType, check(), false)
    );
    }, [])

    const videoDurationCalc = (duration)=> {
      let seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
      hours = (hours < 10) ? `0${hours}` : hours;
      minutes = (minutes <10) ? `0${minutes}` : minutes;
      seconds = (seconds <10) ? `0${seconds}` : seconds;
      return hours==="00"?minutes==="00"?`${seconds}s`:`${minutes}:${seconds}`:`${hours}:${minutes}:${seconds}`
    }

    const bookmarkJump = (bookmarkTime, bookmarkDet) => {
      const video = document.querySelector('.viewvideo__main-container-wrapper-player');
      let timeSkip = (bookmarkTime - dataLoad.userData.userUploads[0].videoInitTime)/1000;
      video.currentTime = timeSkip;
      video.pause();
      setBookmarkDetails(bookmarkDet);
      setTimeout(()=> {
        video.play();
      }, 2000)
      setTimeout(() => {
        setBookmarkDetails(null);
      }, 4000);
    }

    console.log(dataLoad.userData);
    console.log(fullscreen);
    return (
      <div className="viewvideo">
        <div className="viewvideo__overview">
          <div className="viewvideo__overview-border"></div>
          <h2 className="viewvideo__overview-heading">
            <span className="viewvideo__emph">
              {dataLoad.userData.firstName} {dataLoad.userData.lastName}'s</span> Digital Resume
          </h2>
        </div>
        <div className="viewvideo__main">
          <div className="viewvideo__main-container">
            <ProductionNav stage={interviewStage}/>
            <div className="viewvideo__main-container-wrapper">
              <video className="viewvideo__main-container-wrapper-player" src={dataLoad.userData.userUploads[0].videoSrc}
              controls controlsList="nodownload"/>
              {bookmarkDetails!==null &&
              <div className="viewvideo__main-container-wrapper-bookmarkmodal">
                <h2 className="viewvideo__main-container-wrapper-bookmarkmodal-det">{bookmarkDetails}</h2>
              </div>
              }
            </div>
            <div className="viewvideo__main-container-redo">
              <h4 className="viewvideo__main-container-redo-heading">What do you think?</h4>
              <p className="viewvideo__main-container-redo-desc">
                We think it looks great! Beauty is in the eye of the beholder however, if you're not confident
                it's 100% perfect yet, you can give it another go?
              </p>
              <div className="viewvideo__main-container-redo-action">
                <button className="viewvideo__main-container-redo-action-button">
                  START OVER
                </button>
              </div>
            </div>
          </div>
          <div className="viewvideo__main-questions">
            <h2 className="viewvideo__main-questions-heading">{dataLoad.userData.userUploads[0].title}</h2>
            <p className="viewvideo__main-questions-desc">
              For this interview, <span className="viewvideo__emph">{dataLoad.userData.firstName}</span> has 
              selected <span className="viewvideo__emph">{dataLoad.userData.userUploads[0].videoQuestions.length}</span> questions
              that will highlight character, strengths and key skills. 
            </p>
            <p className="viewvideo__main-questions-desc">
              We would encourage you to view the full video interview, however if you're strapped for time or are
              particularly excited to listen to a particular answer, you may <span className="viewvideo__emph">skip to this section</span> of
              the interview by clicking on the buttons below at any time. 
            </p>
            <p className="viewvideo__main-questions-desc">
              We think you've stumbled across a winner here - <span className="viewvideo__emph">The Acumen Team</span>.
            </p>
          {dataLoad.userData.userUploads[0].videoQuestions.map((question,index) => {
           return (
            <div className={`viewvideo__main-questions-prompt${fullscreen===true?" --fullscreen":""}`}
            onClick={()=>{bookmarkJump(question.qInit,question.detail)}} key={question.id}>
              <h4 className="viewvideo__main-questions-prompt-number">0{index+1}</h4>
              <p className="viewvideo__main-questions-prompt-question">{question.detail}</p>
              <p className="viewvideo__main-questions-prompt-bookmark">{videoDurationCalc(question.qInit - dataLoad.userData.userUploads[0].videoInitTime)}</p>
            </div>
            )
         })}
          </div>
        </div>
      </div>
    )
}

export default ViewVideo
