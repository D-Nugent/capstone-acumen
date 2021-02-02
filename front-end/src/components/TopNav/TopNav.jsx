import React, { useState, useContext } from 'react';
import {fireAuth, fireDB} from '../../firebase';
import {NavLink} from 'react-router-dom';
import SignInModal from '../SignInModal/SignInModal';
import AcumenLogo from '../../assets/logos/acumenLogoSmall.svg';
import './TopNav.scss';
import {firebaseContext} from '../../provider/FirebaseProvider';

function TopNav(props){
    const [loginModal, setLoginModal] = useState(false)
    const [newUser, setNewUser] = useState(true)
    const {processSignOut, dataLoad, user} = useContext(firebaseContext)
    
    const loginModalClose = (isNewUser) => {
        setLoginModal(false);
        setNewUser(isNewUser);
    }
    
    const userSignOut = () => {
        fireAuth.signOut().then(()=>{
            console.log("User has been signed Out");
            processSignOut()
        }).catch((error) => {
            console.error(error);
        })
    }
    
    return (
        <div className={`topnav${props.location.pathname!=="/"?" --launch":""}`}>
            <div className="topnav__account">
                <img src={AcumenLogo} alt="logo" className="topnav__account-logo"/>
                <h4 className={`topnav__account-heading${props.location.pathname!=="/"?" --launch":""}`}>Hi there
                {!!dataLoad.userData && <span className="topnav__account-user"> {dataLoad.userData.firstName || dataLoad.userData.companyName}</span>}!
                {!!dataLoad.userData? ((Date.now() -user.metadata.a)/1000)<86400===true?" Welcome to Acumen!":" It's great to see you again!":" To get started please sign in"}</h4>
                
                {fireAuth.currentUser === null?
                    <button className="topnav__account-auth-control" onClick={()=>{setLoginModal(true)}}>SIGN IN</button>
                :
                    <button className="topnav__account-auth-control" onClick={()=>{userSignOut()}}>SIGN OUT</button>
                }
                {loginModal===true && <SignInModal loginModalClose={loginModalClose}/>}
            </div>
            <div className="topnav__navigation">
                <NavLink exact to="/" 
                className={`topnav__navigation-link${props.location.pathname!=="/"?" --launch":""}`} 
                activeClassName="--active">Home</NavLink>
                {!!dataLoad.userData &&
                <>
                    {!!dataLoad.userData.firstName ?
                    <>
                        <NavLink exact to={`/user/${user.uid}`} 
                        className={`topnav__navigation-link${props.location.pathname!=="/"?" --launch":""}`} 
                        activeClassName="--active">View Profile</NavLink>
                        <NavLink exact to={`/user/${user.uid}/newVideo`} 
                        className={`topnav__navigation-link${props.location.pathname!=="/"?" --launch":""}`} 
                        activeClassName="--active">Upload</NavLink>
                    </>
                    :
                    <>
                        <NavLink exact to={`/business/${user.uid}`} 
                        className={`topnav__navigation-link${props.location.pathname!=="/"?" --launch":""}`} 
                        activeClassName="--active">View Profile</NavLink>
                        <NavLink exact to={`/business/${user.uid}/newEnv`} 
                        className={`topnav__navigation-link${props.location.pathname!=="/"?" --launch":""}`} 
                        activeClassName="--active">New IE</NavLink>
                    </>
                    
                    }
                </>
                }
                <NavLink exact to="/how" 
                className={`topnav__navigation-link${props.location.pathname!=="/"?" --launch":""}`} 
                activeClassName="--active">How Does It Work?</NavLink>
                <NavLink exact to="/about" 
                className={`topnav__navigation-link${props.location.pathname!=="/"?" --launch":""}`} 
                activeClassName="--active">About</NavLink>
            </div>
        </div>
    )
}

export default TopNav
