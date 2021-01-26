import React, { Component } from 'react';
import {fireAuth, fireDB} from '../../firebase';
import firebase from 'firebase/app';
import {NavLink} from 'react-router-dom';
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
        }).catch((error) => {
            console.error(error);
        })
    }
    
    render() {
        console.log(this.props);
        console.log(this.state);
        return (
            <div className={`topnav${this.props.location.pathname!=="/"?" --launch":""}`}>
                <div className="topnav__account">
                    <img src={AcumenLogo} alt="logo" className="topnav__account-logo"/>
                    <h4 className={`topnav__account-heading${this.props.location.pathname!=="/"?" --launch":""}`}>Hi there
                    {!!this.props.userData && <span className="topnav__account-user"> {this.props.userData.firstName || this.props.userData.companyName}</span>}!
                    {!!this.props.userData? this.state.newUser===true?" Welcome to Acumen!":" It's great to see you again!":" To get started please sign in"}</h4>
                    
                    {fireAuth.currentUser === null?
                        <button className="topnav__account-auth-control" onClick={()=>{this.setState({loginModal:true,})}}>SIGN IN</button>
                    :
                        <button className="topnav__account-auth-control" onClick={()=>{this.userSignOut()}}>SIGN OUT</button>
                    }
                    {this.state.loginModal===true && <SignInModal loginModalClose={this.loginModalClose}/>}
                </div>
                <div className="topnav__navigation">
                    <NavLink exact to="/" 
                    className={`topnav__navigation-link${this.props.location.pathname!=="/"?" --launch":""}`} 
                    activeClassName="--active">Home</NavLink>
                    {!!this.props.userData &&
                    <>
                        {!!this.props.userData.firstName ?
                        <>
                            <NavLink exact to={`/user/${this.props.user.uid}`} 
                            className={`topnav__navigation-link${this.props.location.pathname!=="/"?" --launch":""}`} 
                            activeClassName="--active">View Profile</NavLink>
                            <NavLink exact to={`/user/${this.props.user.uid}/newVideo`} 
                            className={`topnav__navigation-link${this.props.location.pathname!=="/"?" --launch":""}`} 
                            activeClassName="--active">Upload</NavLink>
                        </>
                        :
                        <>
                            <NavLink exact to={`/business/${this.props.user.uid}`} 
                            className={`topnav__navigation-link${this.props.location.pathname!=="/"?" --launch":""}`} 
                            activeClassName="--active">View Profile</NavLink>
                            <NavLink exact to={`/business/${this.props.user.uid}/newEnv`} 
                            className={`topnav__navigation-link${this.props.location.pathname!=="/"?" --launch":""}`} 
                            activeClassName="--active">New IE</NavLink>
                        </>
                        
                        }
                    </>
                    }
                    <NavLink exact to="/how" 
                    className={`topnav__navigation-link${this.props.location.pathname!=="/"?" --launch":""}`} 
                    activeClassName="--active">How Does It Work?</NavLink>
                    <NavLink exact to="/about" 
                    className={`topnav__navigation-link${this.props.location.pathname!=="/"?" --launch":""}`} 
                    activeClassName="--active">About</NavLink>
                </div>
            </div>
        )
    }
}

export default TopNav
