import React, { Component } from 'react';
import {fireAuth, fireDB, fireAuthGoogle, fireAuthLinkedIn} from '../../firebase';
import firebase from 'firebase/app';
import googleIcon from '../../assets/icons/btn_google.svg';
import linkedinIcon from '../../assets/icons/btn_linkedIn.svg';
import './Landing.scss';

export class Landing extends Component {

    logInUser = (event) => {
        event.preventDefault()
        const userEmail = event.target.userEmail.value;
        const userPass = event.target.userPass.value;
        console.log(`${userEmail}, ${userPass}`);
        fireAuth.signInWithEmailAndPassword(userEmail, userPass)
        .then((userCredential) => {
            const user = userCredential.user
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
            addInfo.isNewUser === true &&
            fireDB.collection("usersTwo").doc(user.uid).set({
                firstName: addInfo.profile.given_name,
                lastName: addInfo.profile.family_name,
                profile: {
                    email: user.email
                },
                profileImageSrc: addInfo.profile.picture
            })
        }).catch((error) => {
            console.log(error);
        })
    }



    consoleUser = () => {
        console.log(fireAuth.currentUser);
        console.log(fireAuth.currentUser.uid);
    }

    render() {
        return (
            <div>
                <p>This is the landing page</p>
                <div>
                    <h2>{fireAuth.currentUser === null ? "Sign In:": "Sign Out:"}</h2>
                    {fireAuth.currentUser === null ?
                    <form className="login" onSubmit={(event)=>{this.logInUser(event)}}>
                        <input type="email" className="login__email" id="userEmail"/>
                        <input type="password" className="login__email" id="userPass"/>
                        <button type="submit" className="login__submit">Log In</button>
                    </form>
                    :
                    <button className="logout" onClick={()=>{fireAuth.signOut()}}>Sign Out</button>
                    }
                    <button onClick={()=>{this.consoleUser()}}>Console User</button>
                </div>
                <div>
                    <h2>Sign in with another provider:</h2>
                    <img src={googleIcon} onClick={()=>{this.loginGoogle()}}/>
                </div>
            </div>
        )
    }
}

export default Landing
