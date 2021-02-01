import React, {useState, useContext} from 'react';
import {videoRef,imageRef} from '../../firebase';
import {fireDB} from '../../firebase';
import firebase from 'firebase/app';
import {firebaseContext} from '../../provider/FirebaseProvider';
import {v4 as uuidv4} from 'uuid';
import ProductionNav from '../../components/ProductionNav/ProductionNav';
import addIcon from '../../assets/icons/add1.svg';
// import addIconFocus from '../../assets/icons/add2.svg';
import recordIcon from '../../assets/icons/record.svg'
import stopIcon from '../../assets/icons/stop.svg'
import editIcon from '../../assets/icons/edit.svg';
import deleteIcon from '../../assets/icons/delete.svg';
import './Studio.scss'

function Studio() {
  const [videoData, setVideoData] = useState({
    videoFile: null,
    videoId: null,
    videoInitTime: null,
    videoEndtime: null,
    videoQuestions: [],
  })
  const {user, dataLoad} = useContext(firebaseContext);
  const [interviewStage,setinterviewStage] = useState("setup")
  const [recording, setRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);


  const uploadVideoRef = videoRef.child(user.uid).child(`${videoData.videoId}.mp4`)
  // #ToDo - Ensure that dynamic videoId is working as intended
  let constraintObj = {
    audio: true,
    video: {
      facingMode: "user",
      width: {min: 640, ideal: 1280, max: 1920},
      height: {min: 480, ideal: 720, max: 1080}
    }
  }

  const uploadVideoBlob = (blob) => {
    setVideoData({
      ...videoData,
      videoEndTime: Date.now(),
    })
    let vidDuration = Math.floor((videoData.videoEndTime - videoData.videoInitTime)/1000)
    console.log(videoData.videoInitTime);
    console.log(videoData.videoEndTime);

    const metadata = {
      contentType: 'video/mp4'
    }
    const uploadTask = uploadVideoRef.put(blob,metadata)
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,(snapshot) => {
      const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      console.log(`Upload is ${progress}% done`);
      setUploadProgress(progress)
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING:
          console.log('Upload is running');
          break;
      }
    }, function(error) {
      console.error(error);
    }, function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
        console.log(`File available at ${downloadURL}`);
        setVideoData({
          ...videoData,
          videoId: uuidv4(),
        })
        fireDB.collection("usersTwo").doc(user.uid).set({
          userUploads:[
            {
              title: "Testicles",
              videoId: videoData.videoId,
              videoSrc: downloadURL,
              duration: vidDuration
            }
          ]
        }, {merge: true})
      })
    }
    )
  }

  const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const options = videoDevices.map(videoDevice => {
      return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
    });
    document.querySelector('#camera-select').innerHTML = options.join('')
  }
  const getMicrophoneSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const micDevices = devices.filter(device => device.kind === 'audioinput');
    const options = micDevices.map(micDevice => {
      return `<option value="${micDevice.deviceId}">${micDevice.label}</option>`;
    });
    document.querySelector('#mic-select').innerHTML = options.join('')
  }
  getCameraSelection()
  getMicrophoneSelection()
  // #To-Do: If possible, update constraints so that they change on user selection. Reference this:
  //https://www.digitalocean.com/community/tutorials/front-and-rear-camera-access-with-javascripts-getusermedia

  const launchStudio = () => {
    setRecording(true);
    navigator.mediaDevices.getUserMedia(constraintObj)
    .then(function(mediaStreamObj) {
      let video = document.querySelector('.studio__container-recorder-preview');
      if ("srcObject" in video) {
        video.srcObject = mediaStreamObj;
      } else {
        video.src = window.URL.createObjectURL(mediaStreamObj);
      }
      video.onloadedmetadata = function(ev) {
        video.play();
      };
      let init = document.querySelector('.studio__container-recorder-init-button')
      let mediaRecorder = new MediaRecorder(mediaStreamObj);
      let chunks = [];
      init.addEventListener('click', ()=>{
        if(recording===false){
          mediaRecorder.start();
          setVideoData({
            ...videoData,
            videoInitTime: Date.now(),
          })
          console.log(mediaRecorder.state);
          setRecording(true)
        } else{
          mediaRecorder.stop();
          console.log(mediaRecorder.state);
          setRecording(false)
        }
      })
      mediaRecorder.ondataavailable = (streamData) =>{
        chunks.push(streamData.data);
      }
      mediaRecorder.onstop = ()=>{
        let blob = new Blob(chunks, {'type':'video/mp4;'});
        chunks = [];
        let videoURL = window.URL.createObjectURL(blob);
        console.log(videoURL);
        setVideoData({
          ...videoData,
          videoFile: blob
        })
        uploadVideoBlob(blob);
      }
    })
    .catch(function(err) {
      console.log(err.name, err.message);
    })
  }

  const unlaunchStudio = () => {
    setRecording(false);
    let stream = document.querySelector('.recorder__preview').srcObject;
    stream.getTracks().forEach(function(track) {
      if (track.readyState === 'live') {
        track.stop();
      }
      let vidDuration = Math.floor((videoData.videoEndTime - videoData.videoInitTime)/1000)
      console.log(vidDuration);
    })
  }

  const timeTrack = (event) => {
    event.target.setAttribute('qInit', Date.now());
    const itemTime = event.target.getAttribute('qInit');
    const timeDiff = Math.floor((itemTime - videoData.videoInitTime)/1000)
    console.log(`The difference in time between when the video started and this question started
     is ${timeDiff} seconds`);
  }

  const addQuestion = () => {
    setVideoData({
      ...videoData,
      videoQuestions: [
        ...videoData.videoQuestions,
        {
          key: uuidv4(),
          number: videoData.videoQuestions.length+1,
          detail:""
        }
      ]
    })
  }

  return (
    <div className="studio">
      <div className="studio__container">
      <ProductionNav stage={interviewStage}/>
        <div className="studio__container-recorder">
          <video className="studio__container-recorder-preview"autoPlay muted/>
          <div className="studio__container-recorder-actions">
            {recording?
              <button className="studio__container-recorder-actions-unlaunch" onClick={()=>{unlaunchStudio()}}>Close Studio</button>
            :
              <button className="studio__container-recorder-actions-launch" onClick={()=>{launchStudio()}}>Launch Studio</button>
            }
            <button className="studio__container-recorder-actions-start">Start Recording</button>
            <button className="studio__container-recorder-actions-stop">Stop Recording</button>
            <button className="studio__container-recorder-actions-upload">Upload Recording</button>
          </div>
          <div className="studio__container-recorder-devices">
            <div className="studio__container-recorder-devices-camera">
              <label htmlFor="camera-select" className="studio__container-recorder-devices-camera-heading">
                Select your camera
              </label>
              <select name="cameras" id="camera-select" className="studio__container-recorder-devices-camera-select">
                <option value="">No camera found</option>
              </select>
            </div>
            <div className="studio__container-recorder-devices-mic">
              <label htmlFor="mic-select" className="studio__container-recorder-devices-mic-heading">
                Select your mic
              </label>
              <select name="mics" id="mic-select" className="studio__container-recorder-devices-mic-select">
                <option value="">No microphone found</option>
              </select>
            </div>
          </div>
          <div className="studio__container-recorder-init">
            <button className="studio__container-recorder-init-button" onClick={()=>{setinterviewStage("record")}}>
              <img src={interviewStage==="setup"?recordIcon:stopIcon} alt="record icon" 
              className="studio__container-recorder-init-button-icon"/>
              {interviewStage==="setup"?"START RECORDING":"STOP RECORDING"}
            </button>
            {/* #ToDo - Add smoother transition between recording and stop recording icons*/}
          </div>
        </div>
      </div>
      <div className="studio__questions">
        <h2 className="studio__questions-heading">Question Selection</h2>
        {dataLoad.userData.membershipTier==="Basic"?
          <p className="studio__questions-desc">
            As a <span className="studio__questions-emph">Basic Member</span>, you can
            choose <span className="studio__questions-emph">only 5</span> custom questions.
          </p>
        :
          <p className="studio__questions-desc">
            As a <span className="studio__questions-emph">Professional Member</span>, you can have
            up to <span className="studio__questions-emph">10 questions</span> and have access to our
            suite of <span className="studio__questions-emph">interview enhancement tools</span>.
          </p>
        }
          {/* #ToDo - Add additional controls for membership tier*/}
         <p className="studio__questions-desc">
            Your questions should be <span className="studio__questions-emph">1-2 sentences</span> long at most. Take some time to consider what questions would allow you to showcase
            the best of your character, skill-set and experience.
         </p> 
         {videoData.videoQuestions.map(question => {
          <div className="studio__questions-prompt" key={question.id}
          onClick={(event)=>{timeTrack(event)}}>
            <h4 className="studio__questions-prompt-number">{question.number}</h4>
            <p className="studio__questions-prompt-question">{question.detail}</p>
            <img src={editIcon} alt="edit icon" className="studio__questions-prompt-edit"/>
            <img src={deleteIcon} alt="delete icon" className="studio__questions-prompt-delete"/>
          </div>
         })}
        <div className="studio__questions-prompt" onClick={(event)=>{timeTrack(event)}}>
          <h4 className="studio__questions-prompt-number">01</h4>
          <p className="studio__questions-prompt-question">Where do you see yourself in five years?</p>
          <img src={editIcon} alt="edit icon" className="studio__questions-prompt-edit"/>
          <img src={deleteIcon} alt="delete icon" className="studio__questions-prompt-delete"/>
        </div>
        <div className="studio__questions-prompt" onClick={(event)=>{timeTrack(event)}}>
          <h4 className="studio__questions-prompt-number">02</h4>
          <p className="studio__questions-prompt-question">What do you consider to be your greatest weakness?</p>
          <img src={editIcon} alt="edit icon" className="studio__questions-prompt-edit"/>
          <img src={deleteIcon} alt="delete icon" className="studio__questions-prompt-delete"/>
        </div>
        <div className="studio__questions-prompt --add" onClick={()=>{addQuestion()}}>
            <img src={addIcon} alt="add icon" className="studio__questions-prompt-icon"/>
            {/* #ToDo: Decide if you want to come back and adjust icon to change on hover state see import above */}
          <p className="studio__questions-prompt-question">Add a new question</p>
        </div>
      </div>
    </div>
  )
}

export default Studio
