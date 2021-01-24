import React, { Component } from 'react';
import {
    IfFirebaseAuthed,
    IfFirebaseUnAuthed
} from "@react-firebase/auth";
import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';
import AcumenLogo from '../../assets/logos/acumenLogoSmall.svg';
import './TopNav.scss';

export class TopNav extends Component {
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
                    </div> 
            </div>
        )
    }
}
// export class TopNav extends Component {
//     render() {
//         return (
//             <div className="topnav">
//                 <img src={AcumenLogo} alt="logo" className="topnav__logo"/>
//                 <IfFirebaseAuthed>
//                     <button className="topnav__signout" onClick={async () => {
//                         this.setState({isLoading: true});
//                         await firebase.app().auth().signOut();
//                         this.setState({isLoading: false})}}>
//                         Sign out
//                     </button>
//                 </IfFirebaseAuthed>
//                 <IfFirebaseUnAuthed>
//                     <div className="topnav__signin">
//                         <button className="topnav__signin-anon" onClick={async () => {
//                             await firebase.app().auth().signInAnonymously();
//                             this.setState({isLoading: false});
//                             }}>
//                             Sign in anonymously
//                             </button>
//                         <button className="topnav__signin-google" onClick={async() => {
//                             try {
//                                 this.setState({isLoading:true, error: null});
//                                 const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
//                                 await firebase.auth().signInWithPopup(googleAuthProvider);
//                                 this.setState({isLoading: false, error: null});
//                             } catch (error) {
//                                 this.setState({isLoading: false, error: error});
//                             }
//                         }}>
//                         Sign in with Google
//                         </button>
//                     </div> 
//                 </IfFirebaseUnAuthed>
//             </div>
//         )
//     }
// }

export default TopNav
