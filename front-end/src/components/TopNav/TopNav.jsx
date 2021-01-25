import React, { Component } from 'react';
import {fireAuth, fireDB} from '../../firebase';
import firebase from 'firebase/app';
import AcumenLogo from '../../assets/logos/acumenLogoSmall.svg';
import './TopNav.scss';

export class TopNav extends Component {

    registerUser = (event) => {
        event.preventDefault();
        const userEmail = event.target.regEmail.value;
        const userPass = event.target.regPass.value;
        fireAuth.createUserWithEmailAndPassword(userEmail, userPass)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.mesage;
            console.log(errorCode, errorMessage);
        })
    }

    render() {
        return (
            <div className="topnav">
                <img src={AcumenLogo} alt="logo" className="topnav__logo"/>
                    <button className="topnav__signout" onClick={async () => {
                        this.setState({isLoading: true});
                        await firebase.app().auth().signOut();
                        this.setState({isLoading: false})}}>
                        Sign out
                    </button>
                    <div className="topnav__signin">
                        <button className="topnav__signin-anon" onClick={async () => {
                            await firebase.app().auth().signInAnonymously();
                            this.setState({isLoading: false});
                            }}>
                            Sign in anonymously
                            </button>
                        <button className="topnav__signin-google" onClick={async() => {
                            try {
                                this.setState({isLoading:true, error: null});
                                const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                                await firebase.auth().signInWithPopup(googleAuthProvider);
                                this.setState({isLoading: false, error: null});
                            } catch (error) {
                                this.setState({isLoading: false, error: error});
                            }
                        }}>
                        Sign in with Google
                        </button>
                        <form className="topnav__signin-email" onSubmit={(event)=>{this.registerUser(event)}}>
                            <input type="email" className="topnav__signin-email-efield" id="regEmail" required/>
                            <input type="password" className="topnav__signin-email-pfield" id ="regPass" required/>
                            <button type="submit" className="topnav__sigin-email-submit">Register</button>
                        </form>
                    </div> 
            </div>
        )
    }
}

export default TopNav
