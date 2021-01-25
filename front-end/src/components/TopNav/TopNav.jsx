import React, { Component } from 'react';
import {fireAuth, fireDB} from '../../firebase';
import firebase from 'firebase/app';
import SignInModal from '../SignInModal/SignInModal';
import AcumenLogo from '../../assets/logos/acumenLogoSmall.svg';
import './TopNav.scss';

export class TopNav extends Component {
    state = {
        loginModal: false,
    }

    loginModalClose = (isNewUser) => {
        this.setState({
            loginModal: false,
            newUser: isNewUser,
        })
    }

    userSignOut = () => {
        fireAuth.signOut().then(()=>{
            console.log("User has been signed Out");
            this.props.processSignOut()
            console.log(this.props.userData);
            console.log(this.props.user);
            console.log(fireAuth.currentUser);
        }).catch((error) => {
            console.error(error);
        })
    }

    render() {
        console.log(this.props);
        console.log(this.state);
        return (
            <div className="topnav">
                <img src={AcumenLogo} alt="logo" className="topnav__logo"/>
                <h4 className="topnav__heading">Hi there
                {!!this.props.userData && <span className="topnav__user"> {this.props.userData.firstName}</span>}!
                 {!!this.props.userData? this.state.newUser===true?" Welcome to Acumen!":" It's great to see you again!":" To get started please sign in"}</h4>
                
                {fireAuth.currentUser === null?
                    <button className="topnav__auth-control" onClick={()=>{this.setState({loginModal:true,})}}>SIGN IN</button>
                :
                    <button className="topnav__auth-control" onClick={()=>{this.userSignOut()}}>SIGN OUT</button>
                }
                
                {this.state.loginModal===true && <SignInModal loginModalClose={this.loginModalClose}/>}
            </div>
        )
    }
}

export default TopNav
