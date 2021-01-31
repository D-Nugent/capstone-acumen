import React, { useState, useContext } from 'react';
import {Link} from 'react-router-dom';
import {firebaseContext} from '../../provider/FirebaseProvider';
import { fireDB, fireAuth } from '../../firebase';
import firebase from 'firebase/app';
import defaultProfileImage from '../../assets/icons/account_box.svg';
import profileExample from '../../assets/images/profile-example.jpg';
import mailIcon from '../../assets/icons/mail_outline.svg';
import telIcon from '../../assets/icons/call.svg';
import cameraIcon from '../../assets/icons/camera.svg';
import memberIcon from '../../assets/icons/membership.svg';
import addVideoIcon from '../../assets/icons/add_video.svg';
import './UserProfile.scss';

// #ToDo - Consider adding another tab for 'Links' where users can add links to their GitHub, LinkedIn etc
// #Todo - Add image upload functionality
/* #ToDo - Add option to cancel changes to profile*/
//REMINDER = consider using a spread useState to make it easier to reference values from profile on update. Use onKeyUp and store.
//then when Save is clicked, values from state values willuse fireDB to update database (remember merge)

function UserProfile() {
  const {user, dataLoad,dataMonitor, updateEmailAddress, unsubscribe} = useContext(firebaseContext);
  const [profileDetail, setProfileDetail] = useState("about");
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = 
    useState({
      firstName: dataLoad.userData.firstName,
      lastName: dataLoad.userData.lastName,
      email: dataLoad.userData.profile.email,
      phone: dataLoad.userData.profile.phone,
      aboutMe: dataLoad.userData.profile.aboutMe,
      experienceOne: dataLoad.userData.profile.experience.length>=1?dataLoad.userData.profile.experience[0]:[],
      experienceTwo: dataLoad.userData.profile.experience.length>=2?dataLoad.userData.profile.experience[1]:[],
      experienceThree: dataLoad.userData.profile.experience.length>=3?dataLoad.userData.profile.experience[2]:[],
    })

  const toggleProfileDetail = () => {
    profileDetail === "about"?
    setProfileDetail("experience")
    :
    setProfileDetail("about")
  }

  const toggleEditSave = () => {
    if (editMode === false){
      return setEditMode(true)
    } else{
      // updateEmailAddress(profileData.email);
      dataMonitor("usersTwo", user.uid);
      let experienceArray = [profileData.experienceOne,profileData.experienceTwo,profileData.experienceThree];
      fireDB.collection("usersTwo").doc(user.uid).update({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        profile: {
          "email": profileData.email,
          "phone": profileData.phone,
          "aboutMe": profileData.aboutMe,
          experience: firebase.firestore.FieldValue.arrayUnion("test")
        }
      }).catch(function(error){
          console.error(error);
      }).then(()=>{
        // unsubscribe();
      }).then(()=>{
        setEditMode(false)
      })
    }
  }


  const cancelProfileChanges = () => {
    setProfileData({
      firstName: dataLoad.userData.firstName,
      lastName: dataLoad.userData.lastName,
      email: dataLoad.userData.profile.email,
      phone: dataLoad.userData.profile.phone,
      aboutMe: dataLoad.userData.profile.aboutMe,
      experienceOne: dataLoad.userData.profile.experience.length>=1?dataLoad.userData.profile.experience[0]:[],
      experienceTwo: dataLoad.userData.profile.experience.length>=2?dataLoad.userData.profile.experience[1]:[],
      experienceThree: dataLoad.userData.profile.experience.length>=3?dataLoad.userData.profile.experience[2]:[],
    })
    setEditMode(false);
    console.log(profileData);
  }

  const editProfileData = () => {
    setProfileData({
      ...profileData,
      firstName: document.querySelector('#firstNameRef').value,
      lastName: document.querySelector('#lastNameRef').value,
      email: document.querySelector('#emailRef').value,
      phone: document.querySelector('#phoneRef').value,
      aboutMe: document.querySelector('#aboutMeRef').value,
    })
  console.log(profileData);
  }

  const editExperienceData = () => {
    setProfileData({
      ...profileData,
      experienceOne: {
        experienceTitle: document.querySelector('#expOneTitleRef').value,
        experienceDetail: document.querySelector('#expOneDetailRef').value,
      },
      experienceTwo: {
        experienceTitle: document.querySelector('#expTwoTitleRef').value,
        experienceDetail: document.querySelector('#expTwoDetailRef').value,
      },
      experienceThree: {
        experienceTitle: document.querySelector('#expThreeTitleRef').value,
        experienceDetail: document.querySelector('#expThreeDetailRef').value,
      },
    })
  console.log(profileData);
  }

  console.log(dataLoad);
  console.log(user);
  return (
    <div className="userprofile">
        <div className="userprofile__container">
          <div className="userprofile__container-border"></div>
          <div className="userprofile__container-profile">
            <div className="userprofile__container-profile-card">
              <img src={dataLoad.userData.profileImageSrc} alt="user profile" className="userprofile__container-profile-card-image"/>
              {editMode===true &&
                <div className="userprofile__container-profile-card-upload">
                  <img src={cameraIcon} alt="upload icon" className="userprofile__container-profile-card-upload-icon"/>
                  <p className="userprofile__container-profile-card-upload-desc">Upload/Change Photo</p>
                </div>
              }
              <div className="userprofile__container-profile-card-details">
                {editMode===false?
                  <h2 className="userprofile__container-profile-card-details-data">{dataLoad.userData.firstName} {dataLoad.userData.lastName}</h2>
                :
                  <div className="userprofile__container-profile-card-details-edit">
                    <input type="text" className="userprofile__container-profile-card-details-edit-name" id="firstNameRef"
                      placeholder="First Name" defaultValue={dataLoad.userData.firstName} onKeyUp={()=>{editProfileData()}} 
                      maxLength="24" required/>
                    <input type="text" className="userprofile__container-profile-card-details-edit-name" id="lastNameRef" 
                      placeholder="Last Name" defaultValue={dataLoad.userData.lastName} onKeyUp={()=>{editProfileData()}}
                      maxLength="24" required/>
                  </div>
                }
              <h4 className="userprofile__container-profile-card-details-data">
                <img src={mailIcon} alt="email icon" className="userprofile__container-profile-card-details-data-icon"/>
                Email:</h4>
              {editMode===false?
                <p className="userprofile__container-profile-card-details-value">{dataLoad.userData.profile.email}</p>
              :
                <input type="email" className="userprofile__container-profile-card-details-edit-email" id="emailRef"
                 placeholder="Email Address" defaultValue={dataLoad.userData.profile.email} onKeyUp={()=>{editProfileData()}}
                 maxLength="32"/>
              }
                <h4 className="userprofile__container-profile-card-details-data">
                  <img src={telIcon} alt="tel icon" className="userprofile__container-profile-card-details-data-icon"/>
                  Tel:</h4>
                {editMode===false?
                  <p className="userprofile__container-profile-card-details-value">
                    {dataLoad.userData.profile.phone?dataLoad.userData.profile.phone:"Please contact me by email"}
                  </p>
                :
                  <input type="tel" className="userprofile__container-profile-card-details-edit-phone" id="phoneRef"
                   placeholder="i.e. (+1) 587-456-7891" defaultValue={dataLoad.userData.profile.phone} maxLength="24"
                   onKeyUp={()=>{editProfileData()}}/>
                }
                <h4 className="userprofile__container-profile-card-details-data"> 
                  <img src={memberIcon} alt="member icon" className="userprofile__container-profile-card-details-data-icon"/>
                    Member Since:</h4>
                  <p className="userprofile__container-profile-card-details-value">
                    {new Date((dataLoad.userData.accountCreated.seconds)*1000).toLocaleDateString(undefined,{day:'numeric', month:'long', year:'numeric'})}
                  </p>
            </div>
          </div>
          <div className="userprofile__container-profile-editsave" 
            onClick={()=>{toggleEditSave()}}>
            {editMode===false?"Edit Profile":"Save Changes"}
          </div>
          {editMode===true&&<div className="userprofile__container-profile-cancel"
            onClick={()=>{cancelProfileChanges()}}>
            Cancel Changes
            </div>}
        </div>
        <div className="userprofile__container-content">
          <div className="userprofile__container-content-wrapper">
            <div className="userprofile__container-content-wrapper-titles">
              <h2 className={`userprofile__container-content-wrapper-titles-heading
                ${profileDetail==="about"?" --active":""}`} onClick={()=>{toggleProfileDetail()}}>
                About Me
              </h2>
              <h2 className={`userprofile__container-content-wrapper-titles-heading
                ${profileDetail==="experience"?" --active":""}`} onClick={()=>{toggleProfileDetail()}}>
                Experience
              </h2>
            </div>
            {profileDetail ==="about"?
              <div className="userprofile__container-content-wrapper-detail">
                {editMode===false?
                  <p className="userprofile__container-content-wrapper-detail-values">
                    {dataLoad.userData.profile.aboutMe?dataLoad.userData.profile.aboutMe:"I'm new to Acumen, watch this space!"}
                  </p>
                :
                  <textarea id="aboutMeRef" className="userprofile__container-content-wrapper-detail-edit-about"
                    placeholder="Tell us a little about yourself. Think of this as your digital cover letter"
                    defaultValue={profileData.aboutMe} onKeyUp={()=>{editProfileData()}} maxLength="422">
                  </textarea>
                }
              </div>
            :
              editMode===false?
                <>
                {dataLoad.userData.profile.experience.length>0?
                dataLoad.userData.profile.experience[0].experienceTitle!==""?
                dataLoad.userData.profile.experience.map((experience, index) => {
                  return (
                    <div className="userprofile__container-content-wrapper-detail" key={index}>
                      <h4 className="userprofile__container-content-wrapper-detail-heading">
                        {experience.experienceTitle}
                      </h4>
                      <p className="userprofile__container-content-wrapper-detail-values">
                        {experience.experienceDetail}
                      </p>
                    </div>
                  )
                })
                :
                <p className="userprofile__container-content-wrapper-detail-construction">
                  I'm bursting with experience, I just haven't had time to add it to my profile yet!
                </p>
                :
                  <p className="userprofile__container-content-wrapper-detail-construction">
                    I'm bursting with experience, I just haven't had time to add it to my profile yet!
                  </p>
                }
                </>
              :
                <div className="userprofile__Container-content-wrapper-detail">
                  <div className="userprofile__container-content-wrapper-detail-edit">
                    <input type="text" id="expOneTitleRef" className="userprofile__container-content-wrapper-detail-heading-edit"
                    placeholder="Company Name, Organisation Name etc..." maxLength="32" onKeyUp={()=>{editExperienceData()}}
                    onChange={()=>{editExperienceData()}} defaultValue={profileData.experienceOne.experienceTitle}/>
                    <textarea id="expOneDetailRef" className="userprofile__container-content-wrapper-detail-values-edit" maxLength="222"
                    placeholder="Explain in brief terms (2-3 sentences) what you took away from this experience and how it highlights your strengths."
                    defaultValue={profileData.experienceOne.experienceDetail}
                    onKeyUp={()=>{editExperienceData()}} onChange={()=>{editExperienceData()}}/>
                </div>
                <div className="userprofile__container-content-wrapper-detail-edit">
                  <input type="text" id="expTwoTitleRef" className="userprofile__container-content-wrapper-detail-heading-edit"
                    placeholder="Company Name, Organisation Name etc..."  maxLength="32" onKeyUp={()=>{editExperienceData()}}
                    onChange={()=>{editExperienceData()}} defaultValue={profileData.experienceTwo.experienceTitle}/>
                  <textarea id="expTwoDetailRef" className="userprofile__container-content-wrapper-detail-values-edit" maxLength="222"
                    placeholder="Explain in brief terms (2-3 sentences) what you took away from this experience and how it highlights your strengths."
                    defaultValue={profileData.experienceTwo.experienceDetail}
                    onKeyUp={()=>{editExperienceData()}} onChange={()=>{editExperienceData()}}/>
                </div>
                <div className="userprofile__container-content-wrapper-detail-edit">
                  <input type="text" id="expThreeTitleRef" className="userprofile__container-content-wrapper-detail-heading-edit"
                    placeholder="Company Name, Organisation Name etc..."  maxLength="32" onKeyUp={()=>{editExperienceData()}}
                    onChange={()=>{editExperienceData()}} defaultValue={profileData.experienceThree.experienceTitle}/>
                  <textarea id="expThreeDetailRef" className="userprofile__container-content-wrapper-detail-values-edit" maxLength="222"
                    placeholder="Explain in brief terms (2-3 sentences) what you took away from this experience and how it highlights your strengths."
                    defaultValue={profileData.experienceThree.experienceDetail}
                    onKeyUp={()=>{editExperienceData()}} onChange={()=>{editExperienceData()}}/>
                </div>
              </div>
              }
            </div>
            {/* #ToDo - Look at adding 'clear' button for the larger text fields*/}
            {editMode===false?profileDetail==="about" &&
            <div className="userprofile__container-content-uploads">
              <div className="userprofile__container-content-uploads-stack">
                <h2 className="userprofile__container-content-uploads-stack-heading">Digital Resume's</h2>
                {dataLoad.userData.userUploads.length>0 &&
                  <>
                    {dataLoad.userData.userUploads.map(upload => {
                      return(
                        <Link className="userprofile__container-content-uploads-stack-card" to={`/user/${user.uid}/${upload.videoId}`} key={upload.videoId}>
                            <h4 className="userprofile__container-content-uploads-stack-card-title">{upload.title}</h4>
                        </Link>
                      )
                    })}
                  </>
                }
                  <Link className="userprofile__container-content-uploads-stack-card" to={`/user/${user.uid}/newVideo`}>
                    <img src={addVideoIcon} alt="Add video icon" className="userprofile__container-content-uploads-stack-card-icon"/>
                    <h4 className="userprofile__container-content-uploads-stack-card-desc">Upload</h4>
                  </Link>                  
              </div>
            </div>
            :
            null
            }
        </div>
      </div>
    </div>
  )
}

export default UserProfile
