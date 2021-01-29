import React, { Component, useState, useEffect } from 'react';
import addIcon from '../../assets/icons/add1.svg';
// import addIconFocus from '../../assets/icons/add2.svg';
import editIcon from '../../assets/icons/edit.svg';
import deleteIcon from '../../assets/icons/delete.svg';
import './NewVideo.scss';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import {useReactMediaRecorder} from 'react-media-recorder';

export default function NewVideo () {
  const [recording, setRecording] = useState(false);
  const [videofile, setVideofile] = useState("");
  const [videoInitTime,setVideoInitTime] = useState(0);

  let constraintObj = {
    audio: true,
    video: {
      facingMode: "user",
      width: {min: 640, ideal: 1280, max: 1920},
      height: {min: 480, ideal: 720, max: 1080}
    }
  }

  const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const options = videoDevices.map(videoDevice => {
      return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
    });
    document.querySelector('.video-select').innerHTML = options.join('')
  }
  const getMicrophoneSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const micDevices = devices.filter(device => device.kind === 'audioinput');
    const options = micDevices.map(micDevice => {
      return `<option value="${micDevice.deviceId}">${micDevice.label}</option>`;
    });
    document.querySelector('.mic-select').innerHTML = options.join('')
  }
  getCameraSelection()
  getMicrophoneSelection()
  // #To-Do: If possible, update constraints so that they change on user selection. Reference this:
  //https://www.digitalocean.com/community/tutorials/front-and-rear-camera-access-with-javascripts-getusermedia

  const launchStudio = () => {
    setRecording(true);
    navigator.mediaDevices.getUserMedia(constraintObj)
    .then(function(mediaStreamObj) {
      let video = document.querySelector('.recorder__preview');
      if ("srcObject" in video) {
        video.srcObject = mediaStreamObj;
      } else {
        video.src = window.URL.createObjectURL(mediaStreamObj);
      }
      video.onloadedmetadata = function(ev) {
        video.play();
      };
      let start = document.querySelector('.recorder__actions-start')
      let stop = document.querySelector('.recorder__actions-stop')
      let vidPlayer = document.querySelector('.recorder__player')
      let mediaRecorder = new MediaRecorder(mediaStreamObj);
      let chunks = [];
      start.addEventListener('click', ()=>{
        mediaRecorder.start();
        setVideoInitTime(Date.now())
        console.log(mediaRecorder.state);
      })
      stop.addEventListener('click', ()=>{
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
      });
      mediaRecorder.ondataavailable = (streamData) =>{
        chunks.push(streamData.data);
      }
      mediaRecorder.onstop = ()=>{
        let blob = new Blob(chunks, {'type':'video/mp4;'});
        chunks = [];
        let videoURL = window.URL.createObjectURL(blob);
        vidPlayer.src = videoURL;
        setVideofile(videoURL);
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
      if (track.readyState == 'live') {
        track.stop();
      }
    })
    console.log(videoInitTime);
  }

  const timeTrack = (event) => {
    event.target.setAttribute('qInit', Date.now());
    const itemTime = event.target.getAttribute('qInit');
    const timeDiff = Math.floor((itemTime - videoInitTime)/1000)
    console.log(`The difference in time between when the video started and this question started is ${timeDiff} seconds`);
  }

  return (
    <div className="newvideo">
      <div className="newvideo__overview">
        <div className="newvideo__overview-border"></div>
        <h2 className="newvideo__overview-heading">Upload Your Profile</h2>
        <p className="newvideo__overview-description">Sentence explaining the key steps to updating a strong profile</p>
        {/* #ToDo: Update description to real content */}
      </div>
      <div className="newvideo__container">
        <div className="newvideo__container-studio">
          {/* ---------Recording---------- */}

        <div className="recorder">
          <video className="recorder__preview"autoPlay muted/>
          <video className="recorder__player" controls autoPlay controlsList="nodownload"/>
          <div className="recorder__actions">
            {recording?
              <button className="recorder__actions-unlaunch" onClick={()=>{unlaunchStudio()}}>Close Studio</button>
              :
              <button className="recorder__actions-launch" onClick={()=>{launchStudio()}}>Launch Studio</button>
            }
            <button className="recorder__actions-start">Start Recording</button>
            <button className="recorder__actions-stop">Stop Recording</button>
          </div>
          <div className="video-options">
            <select name="" id="" className="video-select">
              <option value="">Select camera</option>
            </select>
            <select name="" id="" className="mic-select">
              <option value="">Select microphone</option>
            </select>
          </div>
        </div>
          {/* ---------Recording---------- */}
        </div>
        <div className="newvideo__container-controls">
          <div className="newvideo__container-controls-prompt" onClick={(event)=>{timeTrack(event)}}>
            <h4 className="newvideo__container-controls-prompt-number">01</h4>
            <p className="newvideo__container-controls-prompt-question">Where do you see yourself in five years?</p>
            <img src={editIcon} alt="edit icon" className="newvideo__container-controls-prompt-edit"/>
            <img src={deleteIcon} alt="delete icon" className="newvideo__container-controls-prompt-delete"/>
          </div>
          <div className="newvideo__container-controls-prompt" onClick={(event)=>{timeTrack(event)}}>
            <h4 className="newvideo__container-controls-prompt-number">02</h4>
            <p className="newvideo__container-controls-prompt-question">What do you consider to be your greatest weakness?</p>
            <img src={editIcon} alt="edit icon" className="newvideo__container-controls-prompt-edit"/>
            <img src={deleteIcon} alt="delete icon" className="newvideo__container-controls-prompt-delete"/>
          </div>
          <div className="newvideo__container-controls-prompt --add">
              <img src={addIcon} alt="add icon" className="newvideo__container-controls-prompt-icon"/>
              {/* #ToDo: Decide if you want to come back and adjust icon to change on hover state see import above */}
            <p className="newvideo__container-controls-prompt-question">Add a new question</p>
          </div>
        </div>
      </div>
    </div>
  )
}
