import React, { Component } from 'react';
import defaultProfileImage from '../../assets/icons/account_box.svg';
import profileExample from '../../assets/images/profile-example.jpg';
import mailIcon from '../../assets/icons/mail_outline.svg';
import telIcon from '../../assets/icons/call.svg';
import cameraIcon from '../../assets/icons/camera.svg';
import memberIcon from '../../assets/icons/membership.svg';
import addVideoIcon from '../../assets/icons/add_video.svg';
import './UserProfile.scss';

export class UserProfile extends Component {
    state = {
        profileDetail: "about",
        editMode: false,
    }

    toggleProfileDetail = () => {
        this.state.profileDetail === "about"?
        this.setState({
            profileDetail: "experience"
        })
        :
        this.setState({
            profileDetail: "about"
        })
    }
    toggleEditSave = () => {
        this.state.editMode === false?
        this.setState({
            editMode: true,
        })
        :
        this.setState({
            editMode: false,
        })
    }

    render() {
        return (
            <div className="userprofile">
                <div className="userprofile__container">
                    <div className="userprofile__container-border"></div>
                    <div className="userprofile__container-profile">
                        <div className="userprofile__container-profile-card">
                            <img src={profileExample} alt="user profile image" className="userprofile__container-profile-card-image"/>
                            {this.state.editMode===true &&
                                <div className="userprofile__container-profile-card-upload">
                                    <img src={cameraIcon} alt="upload photo icon" className="userprofile__container-profile-card-upload-icon"/>
                                    <p className="userprofile__container-profile-card-upload-desc">Upload/Change Photo</p>
                                </div>
                            }
                            <div className="userprofile__container-profile-card-details">
                                {this.state.editMode===false?
                                    <h2 className="userprofile__container-profile-card-details-data">John Doe</h2>
                                :
                                    <div className="userprofile__container-profile-card-details-edit">
                                        <input type="text" className="userprofile__container-profile-card-details-edit-name" id="firstNameRef" placeholder="First Name"/>
                                        <input type="text" className="userprofile__container-profile-card-details-edit-name" id="lastNameRef" placeholder="Last Name"/>
                                    </div>
                                }
                                <h4 className="userprofile__container-profile-card-details-data">
                                    <img src={mailIcon} alt="email icon" className="userprofile__container-profile-card-details-data-icon"/>
                                    Email:</h4>
                                {this.state.editMode===false?
                                    <p className="userprofile__container-profile-card-details-value">John.Doe@gmail.com</p>
                                :
                                    <input type="email" className="userprofile__container-profile-card-details-edit-email" id="emailRef" placeholder="Email Address"/>
                                }
                                <h4 className="userprofile__container-profile-card-details-data">
                                    <img src={telIcon} alt="tel icon" className="userprofile__container-profile-card-details-data-icon"/>
                                    Tel:</h4>
                                {this.state.editMode===false?
                                    <p className="userprofile__container-profile-card-details-value">+1 587-834-6559</p>
                                :
                                    <input type="tel" className="userprofile__container-profile-card-details-edit-phone" id="phoneRef" placeholder="Phone Number"/>
                                }
                                <h4 className="userprofile__container-profile-card-details-data"> 
                                    <img src={memberIcon} alt="member icon" className="userprofile__container-profile-card-details-data-icon"/>
                                    Member Since:</h4>
                                <p className="userprofile__container-profile-card-details-value">29th January 2021</p>
                            </div>
                        </div>
                        <div className="userprofile__container-profile-editsave" 
                            onClick={()=>{this.toggleEditSave()}}>
                            {this.state.editMode===false?"Edit Profile":"Save Changes"}
                        </div>
                    </div>
                    <div className="userprofile__container-content">
                        <div className="userprofile__container-content-wrapper">
                            <div className="userprofile__container-content-wrapper-titles">
                                <h2 className={`userprofile__container-content-wrapper-titles-heading
                                ${this.state.profileDetail==="about"?" --active":""}`} onClick={()=>{this.toggleProfileDetail()}}>
                                    About Me
                                </h2>
                                <h2 className={`userprofile__container-content-wrapper-titles-heading
                                ${this.state.profileDetail==="experience"?" --active":""}`} onClick={()=>{this.toggleProfileDetail()}}>
                                    Experience
                                </h2>
                            </div>
                            {this.state.profileDetail ==="about"?
                                <div className="userprofile__container-content-wrapper-detail">
                                    {this.state.editMode===false?
                                        <p className="userprofile__container-content-wrapper-detail-values">
                                            This is a section passed down from the server which gives detail about the user such 
                                            as their passions or what motivates them. It can be considered an electronic version of the cover letter.
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit nisi similique voluptate eum asperiores
                                            quos quis, eaque, ipsum dolore, sequi excepturi maiores cum quo deleniti. Dolor soluta repellat perspiciatis hic!
                                        </p>
                                    :
                                        <textarea id="aboutRef" className="userprofile__container-content-wrapper-detail-edit-about"
                                        placeholder="Tell us a little about yourself. Think of this as your digital cover letter"
                                        ></textarea>
                                    }
                                </div>
                                :
                                this.state.editMode===false?
                                <>
                                    <div className="userprofile__container-content-wrapper-detail">
                                        <h4 className="userprofile__container-content-wrapper-detail-heading">My Last Job</h4>
                                        <p className="userprofile__container-content-wrapper-detail-values">
                                            This is a section passed down from the server which gives detail about a recent job
                                            that the user has opted to share. They can include whatever they choose and closely resmebles or at least
                                            emulates the typical job sections that they would have on their resume. This will be generated by mapping over
                                            an array of experiences added by the user to a max of 3 prior roles they wish to share.
                                        </p>
                                    </div>
                                    <div className="userprofile__container-content-wrapper-detail">
                                        <h4 className="userprofile__container-content-wrapper-detail-heading">My Last Job</h4>
                                        <p className="userprofile__container-content-wrapper-detail-values">
                                            This is a section passed down from the server which gives detail about a recent job
                                            that the user has opted to share. They can include whatever they choose and closely resmebles or at least
                                            emulates the typical job sections that they would have on their resume. This will be generated by mapping over
                                            an array of experiences added by the user to a max of 3 prior roles they wish to share.
                                        </p>
                                    </div>
                                    <div className="userprofile__container-content-wrapper-detail">
                                        <h4 className="userprofile__container-content-wrapper-detail-heading">My Last Job</h4>
                                        <p className="userprofile__container-content-wrapper-detail-values">
                                            This is a section passed down from the server which gives detail about a recent job
                                            that the user has opted to share. They can include whatever they choose and closely resmebles or at least
                                            emulates the typical job sections that they would have on their resume. This will be generated by mapping over
                                            an array of experiences added by the user to a max of 3 prior roles they wish to share.
                                        </p>
                                    </div>
                                </>
                                :
                                <div className="userprofile__Container-content-wrapper-detail">
                                    <div className="userprofile__container-content-wrapper-detail-edit">
                                        <input type="text" id="expOneHeadRef" className="userprofile__container-content-wrapper-detail-heading-edit"
                                        placeholder="Company Name, Organisation Name etc..."/>
                                        <textarea id="expOneDetRef" className="userprofile__container-content-wrapper-detail-values-edit"
                                        placeholder="Explain in brief terms (2-3 sentences) what you took away from this experience and how it highlights your strengths."/>
                                    </div>
                                    <div className="userprofile__container-content-wrapper-detail-edit">
                                        <input type="text" id="expTwoHeadRef" className="userprofile__container-content-wrapper-detail-heading-edit"
                                        placeholder="Company Name, Organisation Name etc..."/>
                                        <textarea id="expTwoDetRef" className="userprofile__container-content-wrapper-detail-values-edit"
                                        placeholder="Explain in brief terms (2-3 sentences) what you took away from this experience and how it highlights your strengths."/>
                                    </div>
                                    <div className="userprofile__container-content-wrapper-detail-edit">
                                        <input type="text" id="expThreeHeadRef" className="userprofile__container-content-wrapper-detail-heading-edit"
                                        placeholder="Company Name, Organisation Name etc..."/>
                                        <textarea id="expThreeDetRef" className="userprofile__container-content-wrapper-detail-values-edit"
                                        placeholder="Explain in brief terms (2-3 sentences) what you took away from this experience and how it highlights your strengths."/>
                                    </div>
                                </div>
                            }
                        </div>
                        {this.state.editMode===false?this.state.profileDetail==="about" &&
                        <div className="userprofile__container-content-uploads">
                            <div className="userprofile__container-content-uploads-stack">
                                <h2 className="userprofile__container-content-uploads-stack-heading">Digital Resume's</h2>
                                <div className="userprofile__container-content-uploads-stack-card">
                                    <h4 className="userprofile__container-content-uploads-stack-card-title">Title</h4>
                                </div>
                                <div className="userprofile__container-content-uploads-stack-card">
                                    <h4 className="userprofile__container-content-uploads-stack-card-title">Title</h4>
                                </div>
                                <div className="userprofile__container-content-uploads-stack-card">
                                    <h4 className="userprofile__container-content-uploads-stack-card-title">Title</h4>
                                </div>
                                <div className="userprofile__container-content-uploads-stack-card">
                                    <h4 className="userprofile__container-content-uploads-stack-card-title">Title</h4>
                                </div>
                                <div className="userprofile__container-content-uploads-stack-card">
                                    <img src={addVideoIcon} alt="Add video icon" className="userprofile__container-content-uploads-stack-card-icon"/>
                                </div>
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
}

export default UserProfile
