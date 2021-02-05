import React, {useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import {videoRef,imageRef} from '../../firebase';
import {fireDB} from '../../firebase';
import firebase from 'firebase/app';
import acumenLogo from '../../assets/logos/acumenLogoSmall.svg';
import {firebaseContext} from '../../provider/FirebaseProvider';
import Studio from '../../components/Studio/Studio';
import './NewVideo.scss';

// #ToDo - Add video uploading bar
// #ToDo -  Add Question order editing
// #ToDo - Add functionality to choose input devices
// #ToDo - Add limitations for no. of questions and video length based on account type

export default function NewVideo (props) {
  const [productionStage, setProductionState] = useState("launch")
  const {user, dataLoad} = useContext(firebaseContext);
  
  return (
    <div className="newvideo">
      <div className="newvideo__overview">
        <div className="newvideo__overview-border"></div>
        <h2 className="newvideo__overview-heading">Upload Your Digital Resume</h2>
      </div>
      {productionStage!=="launch"&&<Studio routeProps={props}/>}
      {productionStage==="launch"&&
      <div className="launch">
        {dataLoad.userData.userUploads.init===false&&
          <h4 className="launch__firstinit">
            <span className="launch-emph">Oh wow! </span>
            I see it's your first time uploading a digital resume, how exciting! Now, I'm sure you're
            going to be a pro at this ...but on the off-chance you'd like to give yourself a head start,
            feel free to check out our <Link to="/how" className="launch-emph">Guides and FAQ's</Link> which
            will introduce you to the interface and give some pointers and best practices for
            aceing your recording. Have fun!
          </h4>
        }
        <div className="launch__overview">
          <ul className="launch__overview-desc">
            Uploading your digital resume is extremely easy, we've focused on simplifying the interface so
            that you can focus on doing what you do... being awesome. Before you get started, you might want to <span className="launch-emph">
            consider the following:</span>
            <li className="launch__overview-desc-consider">
              Have you taken the time to <span className="launch-emph">brainstorm the role</span> that you are applying for? What excites you about this opportunity?
            </li>
            <li className="launch__overview-desc-consider">
              Have you done research on the organization or individual that will be reviewing your submission? Take the time to <span className="launch-emph">truly
              understand their values</span> and what is important to them.
            </li>
            <li className="launch__overview-desc-consider">
              Have you set up the perfect interview environment? There's a lot to consider, but we'd recommend that you focus on <span className="launch-emph">ELAD</span>:
              <ul>
                <li className="launch__overview-desc-consider-point">
                  <span className="launch-emph --heading">
                  <img src={acumenLogo} alt="bullet point" className="launch__overview-desc-consider-point-icon"/>
                    Equipment: </span>
                  Technology can be "special" from time-to-time, is everything working the way it should be?
                </li>
                <li className="launch__overview-desc-consider-point">
                  <span className="launch-emph --heading">
                  <img src={acumenLogo} alt="bullet point" className="launch__overview-desc-consider-point-icon"/>
                    Lighting: </span>
                  Hey, good looking! People want to see you, make sure that your face is clearly visible and about one arms length from
                  your camera.
                </li>
                <li className="launch__overview-desc-consider-point">
                  <span className="launch-emph --heading">
                  <img src={acumenLogo} alt="bullet point" className="launch__overview-desc-consider-point-icon"/>
                    Audio: </span>
                  You have so many wise and insightful things to say, it would be a shame if no-one heard them! Make sure that you are
                  recording from an environment with as little noise polution as possible.
                </li>
                <li className="launch__overview-desc-consider-point">
                  <span className="launch-emph --heading">
                  <img src={acumenLogo} alt="bullet point" className="launch__overview-desc-consider-point-icon"/>
                    Distraction-free: </span>
                  Let's focus on bringing our A-game here. That means, phone off, tv off, all other tabs/programs closed on your
                  computer and anything you might fiddle with out of arms-reach. You'll thank us later.
                </li>
              </ul>
            </li>
            <li className="launch__overview-desc-consider">
              Last but not least, make sure that you are in the right state of mind. Clear your head of any worries and envision where this
              interview will take you. In fact, <span className="launch-emph">take a deep breath...</span> ...now exhale... feeling ready?
              Great, <span className="launch-emph">let's do this!</span>
            </li>
          </ul>
        </div>
        <div className="launch__start">
          <button className="launch__start-button" onClick={()=>{setProductionState("create")}}>LETS GET STARTED</button>
        </div>
      </div>
      }
    </div>
  )
}
