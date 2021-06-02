import React, {useContext, useState, useEffect } from 'react';
import QrCodeWithLogo from "qrcode-with-logos";
import ClipboardJS from 'clipboard';
import {firebaseContext} from '../../provider/FirebaseProvider';
import ProductionNav from '../../components/ProductionNav/ProductionNav';
import PageLoading from '../../components/PageLoading/PageLoading';
import acumenLogo from '../../assets/logos/acumenLogoSmall.svg';
import './ViewVideo.scss'

function ViewVideo (props) {
    const {user, dataLoad} = useContext(firebaseContext);
    const [interviewStage] = useState("review");
    const [bookmarkDetails, setBookmarkDetails] = useState(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [playStatus, setPlayStatus] = useState(false);
    const [selectedUser] = useState({
      user: dataLoad.userData,
      selectedVideo: dataLoad.userData.userUploads.filter(video => video.videoId===props.match.params.videoid).shift(),
      loaded: true,
    })
    
    // useEffect(() => {
    //   setSelectedUser({
    //     user: dataLoad.userData,
    //     selectedVideo: dataLoad.userData.userUploads.filter(video => video.videoId===props.match.params.videoid).shift(),
    //     loaded: true,
    //   })
    // }, [])

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
    /* #ToDo - Review potential of having Bookmarks in fullscreen mode.*/

    const activateQR = () => {

      new QrCodeWithLogo({
        canvas: document.querySelector('.viewvideo__main-questions-share-qr-code'),
        content: window.location.href,
        width: 96,
        logo: {
          src: acumenLogo,
          logoSize: .6,
          borderRadius: 24,
          borderColor: "#FFFFFF00",
        }
      }).toCanvas().then(()=>{})

      new QrCodeWithLogo({
        canvas: document.querySelector('.viewvideo__main-questions-share-qr-code-alt2'),
        content: window.location.href,
        width: 96,
        logo: {
          src: acumenLogo,
          logoSize: .20,
          borderRadius: 0,
          borderColor: "#FFFFFF",
        }
      }).toCanvas().then(()=>{})

    }

    useEffect(() => {
      new ClipboardJS('.viewvideo__main-questions-share-qr-buttons-copy');
    }, [])
    
    useEffect(()=> {
      activateQR();
    },[playStatus])

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
      if (bookmarkTime){
        const video = document.querySelector('.viewvideo__main-container-wrapper-player');
        let timeSkip = (bookmarkTime - selectedUser.selectedVideo.videoInitTime)/1000;
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
    }

    console.log(selectedUser);
    console.log(props);
    console.log(selectedUser.selectedVideo);
    if(selectedUser.loaded===false){
      return (
      <PageLoading/>
      )
    } else {
    return (
      <div className="viewvideo">
        <div className="viewvideo__overview">
          <div className="viewvideo__overview-border"></div>
          <h2 className="viewvideo__overview-heading">
            <span className="viewvideo__emph">
              {selectedUser.user.firstName} {selectedUser.user.lastName}'s</span> Digital Resume
          </h2>
        </div>
        <div className="viewvideo__main">
          <div className="viewvideo__main-container">
            {user.uid === props.match.params.userid &&
            <ProductionNav stage={interviewStage}/>
            }
            <div className="viewvideo__main-container-wrapper">
              <video className="viewvideo__main-container-wrapper-player" src={selectedUser.selectedVideo.videoSrc}
              controls controlsList="nodownload" onPlay={()=>{setPlayStatus(true)}}/>
              {bookmarkDetails!==null &&
              <div className="viewvideo__main-container-wrapper-bookmarkmodal">
                <h2 className="viewvideo__main-container-wrapper-bookmarkmodal-det">{bookmarkDetails}</h2>
              </div>
              }
            </div>
            {user.uid === props.match.params.userid &&
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
            }
          </div>
          <div className="viewvideo__main-questions">
            <h2 className="viewvideo__main-questions-heading">{selectedUser.selectedVideo.title}</h2>
            <p className="viewvideo__main-questions-desc">
              For this interview, <span className="viewvideo__emph">{selectedUser.user.firstName}</span> has 
              selected <span className="viewvideo__emph">{selectedUser.selectedVideo.videoQuestions.length}</span> questions
              that will highlight character, strengths and key skills. 
            </p>
            {playStatus===false&&
            <>
            <p className="viewvideo__main-questions-desc">
              We would encourage you to view the full video interview, however if you're strapped for time or are
              particularly excited to listen to a particular answer, you may <span className="viewvideo__emph">skip to this section</span> of
              the interview by clicking on the buttons below at any time. 
            </p>
            <p className="viewvideo__main-questions-desc">
              We think you've stumbled across a winner here - <span className="viewvideo__emph">The Acumen Team</span>.
            </p>
            </>
            }
          {selectedUser.selectedVideo.videoQuestions.map((question,index) => {
           return (
            <div className={`viewvideo__main-questions-prompt${fullscreen===true?" --fullscreen":""}`}
            onClick={()=>{bookmarkJump(question.qInit,question.detail)}} key={question.id}>
              <h4 className="viewvideo__main-questions-prompt-number">0{index+1}</h4>
              <p className="viewvideo__main-questions-prompt-question">{question.detail}</p>
              <p className="viewvideo__main-questions-prompt-bookmark">{!question.qInit?"No bookmark":videoDurationCalc(question.qInit - selectedUser.selectedVideo.videoInitTime)}</p>
            </div>
            )
         })}
         {playStatus===true&&
          <div className="viewvideo__main-questions-share">
            <h2 className="viewvideo__main-questions-share-heading">Want To Share This Profile?</h2>
            <p className="viewvideo__main-questions-share-desc">
              Easily share this candidate by copying the below QR code and/or link anywhere you like!
            </p>
            <div className="viewvideo__main-questions-share-qr">
              <canvas className="viewvideo__main-questions-share-qr-code" onLoad={()=>{activateQR()}}></canvas>
              <canvas className="viewvideo__main-questions-share-qr-code-alt2" onLoad={()=>{activateQR()}}></canvas>
              <div className="viewvideo__main-questions-share-qr-buttons">
                <button data-clipboard-text={window.location.href} className="viewvideo__main-questions-share-qr-buttons-copy">
                  Copy Digital Resume Link
                </button>
                <a className="viewvideo__main-questions-share-qr-buttons-email" href={`mailto:?subject=Great Candidate - ${selectedUser.firstName} ${selectedUser.lastName}&body=
${new Date().getHours()<12?"Good Morning":new Date().getHours()<18?"Good Afternoon":"Good Evening"},%0D%0A%0D%0AI found this great candidate on Acumen and thought you might want to review their profile:%0D%0A${window.location.href}%0D%0A%0D%0AKind Regards,%0D%0A`}>
                  Share by Email
                </a>
              </div>
            </div>
          </div>
        }
          </div>
        </div>
      </div>
    )
  }
}

export default ViewVideo
