import {Switch, Route} from 'react-router-dom'
import React from 'react';
// -------
import {
  FirebaseAuthProvider,
  IfFirebaseAuthed,
  IfFirebaseUnAuthed
} from "@react-firebase/auth";
import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';
import {config} from "../../firebase-credentials.ts";
// ------
import {FirestoreCollection, FirestoreDocument, FirestoreProvider} from "@react-firebase/firestore"
// ------
import TopNav from '../TopNav/TopNav';
import SideNav from '../SideNav/SideNav';
import Landing from '../../pages/Landing/Landing';
import Home from '../../pages/Home/Home';
import Register from '../../pages/Register/Register';
import ModifyProfile from '../../pages/ModifyProfile/ModifyProfile';
import UserProfile from '../../pages/UserProfile/UserProfile';
import NewVideo from '../../pages/NewVideo/NewVideo';
import ViewVideo from '../../pages/ViewVideo/ViewVideo';
import NewEnv from '../../pages/NewEnv/NewEnv';
import ModifyEnv from '../../pages/ModifyEnv/ModifyEnv';
import CandidateReel from '../../pages/CandidateReel/CandidateReel';
import CandidateProfile from '../../pages/CandidateProfile/CandidateProfile';
import './App.scss';


class App extends React.Component {
  state = {
    isLoading: false,
    error: null,
    currentUser: undefined
  }

  componentDidMount(){

  }

  componentDidUpdate(prevProps){
    prevProps !== this.props &&
    console.log(this.state);
  }

  testCall = () => {
    console.log(this.state);
  }

  render() {
    return (
      <FirestoreProvider {...config} firebase={firebase}>
        <div className="app">
            <FirestoreDocument path="/users/WbG9pMzvkJ8s8dOZSbal">
              {d => {
                const {value} = d;
                if (value === null || typeof value === "undefined") return null;
                return (
                  <>
                  <p>The membership tier is {value.membershipTier}</p>
                  <p>The email on the account is {value.profile.email}</p>
                  </>
                ) 
              }}
            </FirestoreDocument>
          <FirebaseAuthProvider {...config} firebase={firebase}>
            <TopNav className="app__topnav"/>
            <main className="app__main">
              <SideNav/>
              <IfFirebaseAuthed>
                <Switch>
                  <Route exact path="/" render={(routeProps) => <Landing {...routeProps} />} />
                  <Route exact path="/user/:userid/createProfile" render={(routeProps) => <ModifyProfile {...routeProps} />} />
                  <Route exact path="/user/:userid/editProfile" render={(routeProps) => <ModifyProfile {...routeProps} />} />
                  <Route exact path="/user/:userid/newVideo" render={(routeProps) => <NewVideo {...routeProps} />} />
                  <Route exact path="/user/:userid/:videoid" render={(routeProps) => <ViewVideo {...routeProps} />} />
                
                  <Route exact path="/business/:businessid/createProfile" render={(routeProps) => <ModifyProfile {...routeProps} />} />
                  <Route exact path="/business/:businessid/editProfile" render={(routeProps) => <ModifyProfile {...routeProps} />} />
                  <Route exact path="/business/:businessid/newEnv" render={(routeProps) => <NewEnv {...routeProps} />} />

                  <Route exact path="/business/:businessid/:envId/candidates" render={(routeProps) => <CandidateReel {...routeProps} />} />
                  <Route exact path="/business/:businessid/:envId/candidates/:userid" render={(routeProps) => <CandidateProfile {...routeProps} />} />
                </Switch>
              </IfFirebaseAuthed>
              {/* ------------------------------------------------------ */}
              <IfFirebaseUnAuthed>
                <Switch>
                  <Route exact path="/" render={(routeProps) => <Landing {...routeProps} />} />
                  <Route exact path="/register" render={(routeProps) => <Register {...routeProps} />} />
                </Switch>
              </IfFirebaseUnAuthed>
              {/* ------------------------------------------------------ */}
              <Switch>
                <Route exact path="/home" render={(routeProps) => <Home {...routeProps} />} />
                <Route exact path="/user/:userid" render={(routeProps) => <UserProfile {...routeProps} />} />
                <Route exact path="/business/:businessid" render={(routeProps) => <UserProfile {...routeProps} />} />
                <Route exact path="/business/:businessid/:envId" render={(routeProps) => <ModifyEnv {...routeProps} />} />    
              </Switch>
            </main>
          </FirebaseAuthProvider>
        </div>
      </FirestoreProvider>
    );
  }
}

export default App;
