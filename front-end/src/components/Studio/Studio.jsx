import React, {useState, useContext} from 'react';
import {videoRef,imageRef} from '../../firebase';
import {fireDB} from '../../firebase';
import firebase from 'firebase/app';
import {firebaseContext} from '../../provider/FirebaseProvider';
import {v4 as uuidv4} from 'uuid';
import {Link, useHistory} from 'react-router-dom';
import ProductionNav from '../../components/ProductionNav/ProductionNav';
import addIcon from '../../assets/icons/add1.svg';
// import addIconFocus from '../../assets/icons/add2.svg';
import recordIcon from '../../assets/icons/record.svg'
import stopIcon from '../../assets/icons/stop.svg'
import editIcon from '../../assets/icons/edit.svg';
import deleteIcon from '../../assets/icons/delete.svg';
import saveIcon from '../../assets/icons/save.svg';
import './Studio.scss'

function Studio() {
  const [videoData, setVideoData] = useState({
    videoTitle: "",
    videoFile: null,
    videoId: null,
    videoInitTime: null,
    videoEndTime: null,
    videoQuestions: [],
  })
  const {user, dataLoad} = useContext(firebaseContext);
  const [interviewStage,setInterviewStage] = useState("setup");
  const [titleEdit,setTitleEdit] = useState(false);
  const [recording, setRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);


  const uploadVideoRef = videoRef.child(user.uid).child(`${videoData.videoId}${videoData.videoTitle}.mp4`)
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
        let videoId = uuidv4()
        fireDB.collection("usersTwo").doc(user.uid).set({
          userUploads:[
            {
              title: videoData.videoTitle,
              videoId: videoId,
              videoSrc: downloadURL,
              videoInitTime: videoData.videoInitTime,
              videoEndTime: videoData.videoEndTime,
              videoQuestions: videoData.videoQuestions
            }
          ]
        }, {merge: true})
      });
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
    setInterviewStage("record");
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
      let start = document.querySelector('.studio__container-recorder-init-start')
      let end = document.querySelector('.studio__container-recorder-init-end')
      let mediaRecorder = new MediaRecorder(mediaStreamObj);
      let chunks = [];
      console.log(mediaRecorder.state);
      start.addEventListener('click', ()=>{
          mediaRecorder.start();
          setRecording(true);
      end.addEventListener('click', () => {
        console.log(mediaRecorder.state);
        console.log("Start Media Ran");
        mediaRecorder.stop();
        setRecording(false);
        let stream = video.srcObject;
        stream.getTracks().forEach(function(track){
          if (track.readyState === 'live') {
            track.stop();
          }
        })
      })
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
      };
    })
    .catch(function(err) {
      console.log(err.name, err.message);
    })
  }

  const timeTrack = (event) => {
    let questionId = event.currentTarget.getAttribute("data-id");
    event.target.setAttribute('qInit', Date.now());
    const itemTime = event.target.getAttribute('qInit');
    const timeDiff = Math.floor((itemTime - videoData.videoInitTime)/1000)
    let questionClone = Object.assign([],videoData.videoQuestions)
    let indexPos = questionClone.findIndex(question => question.id===questionId);
    let targetedValue = questionClone[indexPos]
    targetedValue = {
      ...targetedValue,
      qInit: timeDiff
    };
    questionClone.splice(indexPos,1,targetedValue).shift();
    setVideoData({
      ...videoData,
      videoQuestions: questionClone,
    })
    event.currentTarget.classList.add("--inactive");
    event.currentTarget.nextSibling && event.currentTarget.nextSibling.classList.remove("--inactive");
    console.log(videoData.videoInitTime);
  }

  const addQuestion = () => {
    dataLoad.userData.membershipTier==="Basic"?
    videoData.videoQuestions.length<5 &&
    setVideoData({
      ...videoData,
      videoQuestions: [
        ...videoData.videoQuestions,
        {
          id: uuidv4(),
          detail:"",
          editState: false
        }
      ]
    })
    :
    videoData.videoQuestions.length<10 &&
    setVideoData({
      ...videoData,
      videoQuestions: [
        ...videoData.videoQuestions,
        {
          id: uuidv4(),
          detail:"",
          editState: false
        }
      ]
    })
  }
  
  const enableQuestionEdit = (event) => {
    let questionId = event.target.getAttribute("data-id");
    let questionClone = Object.assign([],videoData.videoQuestions)
    let indexPos = questionClone.findIndex(question => question.id===questionId);
    let targetedValue = questionClone[indexPos]
    targetedValue = {
      ...targetedValue,
      editState: true
    };
    questionClone.splice(indexPos,1,targetedValue).shift();
    setVideoData({
      ...videoData,
      videoQuestions: questionClone,
    })
  }

  const saveQuestion = (event) => {
    let questionId = event.target.getAttribute("data-id");
    let fieldValue = document.querySelector(`#qRef${questionId}`).value;
    let questionClone = Object.assign([],videoData.videoQuestions)
    let indexPos = questionClone.findIndex(question => question.id===questionId);
    let targetedValue = questionClone[indexPos]
    targetedValue = {
      ...targetedValue,
      editState: false,
      detail: fieldValue
    };
    questionClone.splice(indexPos,1,targetedValue).shift();
    setVideoData({
      ...videoData,
      videoQuestions: questionClone,
    })
  }

  const deleteQuestion = (event) => {
    let questionId = event.target.getAttribute("data-id");
    let questionClone = Object.assign([],videoData.videoQuestions)
    let indexPos = questionClone.findIndex(question => question.id===questionId);
    questionClone.splice(indexPos,1).shift();
    setVideoData({
      ...videoData,
      videoQuestions: questionClone,
    })
  }

  const saveVideoTitle = () => {
  let fieldValue = document.querySelector('#videoTitleRef').value;
    setVideoData({
      ...videoData,
      videoTitle: fieldValue,
    });
    setTitleEdit(false);
  }

  console.log(dataLoad.userData);
  console.log(videoData);
  return (
    <div className="studio">
      <div className="studio__container">
      <ProductionNav stage={interviewStage}/>
        <div className="studio__container-recorder">
          <video className="studio__container-recorder-preview"autoPlay muted/>
          <div className={`studio__container-recorder-devices${interviewStage!=="setup"?" --disable":""}`}>
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
            <button className={`studio__container-recorder-init-start${recording===true?" --active":""}`} onClick={()=>{
              interviewStage==="setup"&&setInterviewStage("prompt")}}>
              <img src={recordIcon} alt="record icon" className="studio__container-recorder-init-start-icon"/>
              {interviewStage==="setup"?"LAUNCH ENVIRONMENT":"START RECORDING"}
            </button>
            <button className={`studio__container-recorder-init-end${recording===false?" --active":""}`}>
              <img src={stopIcon} alt="record icon" className="studio__container-recorder-init-start-icon"/>
              STOP RECORDING
            </button>
            {/* #ToDo - Add smoother transition between recording and stop recording icons*/}
            {/* #ToDo - Add a check for any questions with no title or unsaved changes (prevent load)*/}
          </div>
        </div>
      </div>
      {interviewStage==="prompt" &&
      <div className="studio__modal">
        <div className="studio__modal-wrapper">
          <h2 className="studio__modal-wrapper-heading">
            {videoData.videoQuestions.length===0 || videoData.videoTitle.length===0?"Uh-oh":"Before you start!"}
          </h2>
          {videoData.videoQuestions.length===0?
            <p className="studio__modal-wrapper-detail">
              Houston we have a problem! Looks like you didn't select any questions for your intervew. These
              questions are a must for Acumen to deliver an effective recording to a prospective employer. If you
              are uncertain, consider checking out the <Link to="/how" className="launch-emph">Guides and FAQ's</Link>.
            </p>
          :
          videoData.videoTitle.length===0?
          <p className="studio__modal-wrapper-detai">
            Looks like you're not fully set up. You're missing a title! You'll need this later in order to be able
            to reference your videos. Set up a memorable title and we'll see you in a moment!
          </p>
          :
          <p className="studio__modal-wrapper-detail">
            Before you proceed, make sure that you are <span className="studio__questions-emph">comfortable with the 
            questions</span> that you have selected. You won't be able to edit them mid-interview. On the next screen
            you will first have a preview of your webcam, if you are comfortable with how your interview environment looks
            , click <span className="studio__questions-emph">Start Recording</span>. When the interview starts
            , <span className="studio__questions-emph"> begin by introducing yourself</span> along with any key
            information you would like to disclose. Acumen works by tracking the question you are currently answering.
            So, when you are ready, <span className="studio__questions-emph"> click the first question</span> to begin
            recording your response. Once complete you can click the next question and so on.
            You will be able to review your recording afterwards. <span className="studio__questions-emph">Good luck!</span>
          </p>
          }
          <div className="studio__modal-wrapper-buttons">
            {videoData.videoQuestions.length===0 || videoData.videoTitle.length===0?
            <button className="studio__modal-wrapper-buttons-cancel" onClick={()=>{setInterviewStage("setup")}}>
              Sorry, my bad!
            </button>
            :
            <>
              <button className="studio__modal-wrapper-buttons-cancel" onClick={()=>{setInterviewStage("setup")}}>
                I'm not ready yet!
              </button>
              <button className="studio__modal-wrapper-buttons-start" onClick={()=>{launchStudio()}}>
                I'm ready, Let's do this!
              </button>
            </>
            }
          </div>
        </div>
      </div>
      }
      <div className="studio__questions">
        {interviewStage!=="record" &&
          <h2 className="studio__questions-heading">Select a Title</h2>
        }
          {titleEdit===false?
          videoData.videoTitle.length>0?
          <div className="studio__questions-title --add">
            <p className="studio__questions-title-content --add">{videoData.videoTitle}</p>
            {interviewStage!=="record"&&
            <img src={editIcon} alt="edit icon" className="studio__questions-title-editicon"
            onClick={()=>{setTitleEdit(true)}}/>
            }
          </div>
          :
          <div className="studio__questions-title" onClick={()=>{setTitleEdit(true)}}>
            <img src={addIcon} alt="add icon" className="studio__questions-title-icon"/>
            <p className="studio__questions-title-content">Select a Title</p>
          </div>
          :
          <div className="studio__questions-title">
            <input type="text" className="studio__questions-title-content-edit" id="videoTitleRef"
            maxLength="24" defaultValue={videoData.videoTitle}/>
            <img src={saveIcon} alt="save icon" className="studio__questions-title-icon"
            onClick={()=>{saveVideoTitle()}}/>
          </div>
          }
        {interviewStage!=="record" &&
        <>
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
            Your questions should be <span className="studio__questions-emph">1-2 sentences</span> long at most.
            Take some time to consider what questions would allow you to showcase the best of your character,
            skill-set and experience.
         </p>
         </>
         }
         {videoData.videoQuestions.map((question,index) => {
           return (
            <div className={`studio__questions-prompt${interviewStage==="record"&&index!==0?" --inactive":""}`}
              data-id={question.id} key={question.id} onClick={(event)=>{
              interviewStage==="record" && timeTrack(event)
            }}>
              <h4 className="studio__questions-prompt-number">0{index+1}</h4>
              {question.editState===true?
                <input type="text" className="studio__questions-prompt-question-edit"
                id={`qRef${question.id}`} defaultValue={question.detail} maxLength="121"/>
              :
                <p className="studio__questions-prompt-question">{question.detail}</p>
              }
              {question.editState===true?
                <img src={saveIcon} alt="edit icon" className="studio__questions-prompt-edit"
                data-id={question.id} onClick={(event)=>{saveQuestion(event)}}/>
              :
              interviewStage!=="record"&&
              <img src={editIcon} alt="edit icon" className="studio__questions-prompt-edit"
              data-id={question.id} onClick={(event)=>{enableQuestionEdit(event)}}/>
            }
            {interviewStage!=="record"&&
              <img src={deleteIcon} alt="delete icon" className="studio__questions-prompt-delete"
              data-id={question.id} onClick={(event)=>{deleteQuestion(event)}}/>
            }
            </div>
            )
         })}
        {interviewStage!=="record" &&
        <div className="studio__questions-prompt --add" onClick={()=>{addQuestion()}}>
            <img src={addIcon} alt="add icon" className="studio__questions-prompt-icon"/>
          <p className="studio__questions-prompt-question">Add a new question</p>
        </div>
        }
      </div>
    </div>
  )
}

export default Studio
