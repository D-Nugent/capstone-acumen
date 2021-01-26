import React, { Component } from 'react';
import {fireAuth, fireDB, fireAuthGoogle, fireAuthLinkedIn} from '../../firebase';
import firebase from 'firebase/app';
import ActionClose from '../ActionClose/ActionClose';
import googleIcon from '../../assets/icons/btn_google.svg';
import linkedinIcon from '../../assets/icons/btn_linkedIn.svg';
import passHidIcon from '../../assets/icons/visibility_off.svg';
import passVisIcon from '../../assets/icons/visibility.svg';
import './SignInModal.scss';

export class SignInModal extends Component {
    state = {
        modalState: "login",
        passVisible: false,
        passVal: true,
        accountType: "user",
    }

    loginUser = (event) => {
        event.preventDefault();
        const userEmail = event.target.emailRef.value;
        const userPass = event.target.passRef.value;
        fireAuth.signInWithEmailAndPassword(userEmail, userPass)
        .then((userCredential) => {
            const user = userCredential.user
            console.log("Successful Sign In");
            this.props.loginModalClose(userCredential.additionalUserInfo.isNewUser)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`${errorCode}, ${errorMessage}`);
        })
    }

    loginGoogle = () => {
        fireAuth.signInWithPopup(fireAuthGoogle)
        .then((result) => {
            const credential = result.credential;
            const token = credential.accessToken;
            const user = result.user;
            const addInfo = result.additionalUserInfo;
            addInfo.isNewUser === false &&
            fireDB.collection("usersTwo").doc(user.uid).set({
                firstName: addInfo.profile.given_name,
                lastName: addInfo.profile.family_name,
                profile: {
                    email: user.email,
                    aboutMe: "I'm new to Acumen, watch this space!"
                },
                profileImageSrc: addInfo.profile.picture,
                accountCreated: firebase.firestore.Timestamp.now(),
                membershipTier: "Basic",
                userUploads: [
                   "Nothing to see here.", 
                ]
            });
            this.props.loginModalClose(addInfo.isNewUser)
        }).catch((error) => {
            console.log(error);
        })        
    }

    // <button className="topnav__signin-anon" onClick={async () => {
    //     await firebase.app().auth().signInAnonymously();
    //     this.setState({isLoading: false});
    //     }}>
    //     Sign in anonymously
    //     </button>


    registerUser = (event) => {
        event.preventDefault();
            const userEmail = event.target.emailRef.value;
            const userPass = event.target.passRef.value;
        fireAuth.createUserWithEmailAndPassword(userEmail, userPass)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(userCredential);
            console.log(user);
            if (this.state.accountType === "user") {
                const userFirstName = event.target.firstNameRef.value
                const userLastName = event.target.lastNameRef.value
                fireDB.collection("usersTwo").doc(user.uid).set({
                    firstName: userFirstName,
                    lastName: userLastName,
                    profile: {
                        email: user.email,
                        aboutMe: "I'm new to Acumen, watch this space!"
                    },
                    accountCreated: firebase.firestore.Timestamp.now(),
                    membershipTier: "Basic",
                    userUploads: [
                       "Nothing to see here.", 
                    ]
                })
                .then(this.props.loginModalClose(userCredential.additionalUserInfo.isNewUser))
            } else {
            const userCompanyName = event.target.companyRef.value
                fireDB.collection("businessesTwo").doc(user.uid).set({
                    companyName: userCompanyName,
                    profile: {
                        email: user.email,
                        companyBio: "We're new to Acumen, watch this space!"
                    },
                    accountCreated: firebase.firestore.Timestamp.now(),
                    membershipTier: "Basic",
                    interviewEnvironments: [
                       "Nothing to see here.", 
                    ]
                })
                .then(this.props.loginModalClose(userCredential.additionalUserInfo.isNewUser))
            }
        })
        .catch((error) => {
            switch (error.code) {
                case 'auth/email-already-in-use':
                  console.error(`Email address ${userEmail} already in use.`);
                  break;
                case 'auth/invalid-email':
                  console.error(`Email address ${userEmail} is invalid.`);
                  break;
                case 'auth/operation-not-allowed':
                  console.error(`Error during sign up.`);
                  break;
                case 'auth/weak-password':
                  console.error('Password is not strong enough. Add additional characters including special characters and numbers.');
                  break;
                default:
                  console.error(error.message);
                  break;
              }
        })
    }

    sendPassReset = (event) => {
        event.preventDefault();
        fireAuth.sendPasswordResetEmail(event.target.emailRef.value)
        .then(()=> {
            window.alert("A password reset email has been sent to you")
        })
        .catch((error) => {
            window.alert(error)
        })
    }

    passwordValidation = () => {
        document.querySelector('#passRef').value !== document.querySelector('#confirmPassRef').value?
        this.setState({
            passVal: false
        })
        :
        this.setState({
            passVal: true
        })
    }

    toggleAccountType = () => {
        this.state.accountType === "user"?
        this.setState({accountType:"business"})
        :this.setState({accountType:"user"})
    }

    render() {
        return (
            <div className="account">
                <div className="account__container">
                    <div className="account__container-close" onClick={()=>{this.props.loginModalClose()}}>
                        <ActionClose/>
                    </div>
                    <h2 className="account__container-heading">
                        {this.state.modalState==="login"?"Let's get you signed in":
                        this.state.modalState==="register"?"Let's get you signed up":"Let's reset that password"}
                    </h2>
                    {this.state.modalState==="register" &&
                    <div className="account__container-type" onClick={()=>{this.toggleAccountType()}}>
                        <div className={`account__container-type-toggle${this.state.accountType==="user"?"--active":""}`}>User</div>
                        <div className={`account__container-type-toggle${this.state.accountType==="business"?"--active":""}`}>Business</div>
                    </div>
                    }
                    <form className="account__container-form" onSubmit={(event)=>{
                        this.state.passVal !==false &&
                        this.state.modalState==="login"?this.loginUser(event):
                        this.state.modalState==="register"?this.registerUser(event):this.sendPassReset(event)
                    }}>
                        {this.state.modalState==="register" &&
                            <>
                            {this.state.accountType==="user"?
                                <>
                                    <input type="text" className="account__container-form-field" id="firstNameRef" required placeholder="First Name"/>
                                    <input type="text" className="account__container-form-field" id="lastNameRef" required placeholder="Last Name"/>
                                </>
                            :
                            <input type="text" className="account__container-form-field" id="companyRef" required placeholder="Company Name"/>
                            }
                            </>
                        }
                        <input type="email" className="account__container-form-field" id="emailRef" required placeholder="Email"/>
                        {this.state.modalState!=="reset" &&
                            <div className="account__container-form-passcontainer">
                                <input type={this.state.passVisible===false?"password":"text"} className="account__container-form-field"
                                    id="passRef" required placeholder="Password"
                                    onKeyUp={()=>{this.passwordValidation()}}/>
                                <img src={this.state.passVisible===false?passHidIcon:passVisIcon} className="account__container-form-passvis" alt="password visibility toggle"
                                    onMouseDown={()=>{this.setState({passVisible: true})}}
                                    onMouseUp={()=>{this.setState({passVisible: false})}}/>
                            </div>
                        }
                        {this.state.modalState==="register" &&
                            <div className="account__container-form-passcontainer">
                                <input type={this.state.passVisible===false?"password":"text"} className="account__container-form-field"
                                    id="confirmPassRef" required placeholder="Confirm Password"
                                    onKeyUp={()=> {this.passwordValidation()}}/>
                                <img src={this.state.passVisible===false?passHidIcon:passVisIcon} className="account__container-form-passvis" alt="password visibility toggle" 
                                    onMouseDown={()=>{this.setState({passVisible: true})}}
                                    onMouseUp={()=>{this.setState({passVisible: false})}}/>
                                {this.state.passVal===false && <p className="account__container-form-passval">Sorry, your passwords don't match.</p>}
                            </div>
                        }
                        <button type="submit" className="account__container-form-submit">{this.state.modalState==="login"?"Sign In":this.state.modalState==="register"?"Sign Up":"Request Reset Email"}</button>
                    </form>
                    <div className="account__container-redirect">
                        {this.state.modalState==="login" && 
                        <p className="account__container-redirect-forgot" onClick={()=>{this.setState({modalState:"reset"})}}>Forgot your password?</p>}
                        <p className="account__container-redirect-register" 
                            onClick={()=>{this.state.modalState==="login"?
                            this.setState({modalState:"register"}):this.setState({modalState:"login", passVal:true, accountType:"user"})}}
                        >
                            {this.state.modalState==="login"?
                            "Not a member yet?":this.state.modalState==="reset"?"Return to login":"Already a member?"}
                        </p>
                    </div>
                    {this.state.modalState!=="reset" &&
                    <>
                    {this.state.accountType!=="business" &&
                    <>
                        <div className="account__container-or">
                            <hr/><span>OR</span><hr/>
                        </div>
                        <h4 className="account__container-alt">Continue with:</h4>
                        <div className="account__container-providers">
                            <img src={googleIcon} onClick={()=>{this.loginGoogle()}} alt="login with google button"/>
                            <img src={linkedinIcon} onClick={()=>{this.loginGoogle()}} alt="login with linkedIn button"/>
                        </div>
                    </>
                    }
                    </>
                    }
                </div>
            </div>
        )
    }
}

export default SignInModal
