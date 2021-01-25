import {Switch, Route} from 'react-router-dom'
import React from 'react';
// -------
import {fireAuth, fireDB} from '../../firebase';
import firebase from 'firebase/app';
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
    user: null
  }

  componentDidMount = () => {
    fireAuth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        this.setState({
          user: userAuth
        })
      } else {
        this.setState({
          user: null
        })
      }
    })
  }



  createUser = () => {
    fireDB.collection("usersTwo").add({
      first: "Lisa",
      last: "Schulz",
      born: 1991,
      profile: {
        aboutMe: "String about me",
        email: "lisa@gmail.com"
      }
    })
    .then((docRef) => {
      console.log(`Document written with ID: ${docRef.id}`);
    })
    .catch((error) => {
      console.error(error);
    })
  }

  updateUser = () => {
    fireDB.collection("usersTwo").doc("RYonaGAFP0EedOD2FoAc").update({
      "profile.email": "lisasarah27@gmail.com"
    })
    .then((docRef) => {
      console.log(`Document updated!`);
    })
    .catch((error) => {
      console.error(error);
    })
  }

  deleteData = () => {
    fireDB.collection("usersTwo").doc("RYonaGAFP0EedOD2FoAc").update({
      born: firebase.firestore.FieldValue.delete(),
      first: firebase.firestore.FieldValue.delete(),
      last: firebase.firestore.FieldValue.delete(),
      "profile.aboutMe": firebase.firestore.FieldValue.delete(),
      "profile.email": firebase.firestore.FieldValue.delete(),
      profile: firebase.firestore.FieldValue.delete()
    }).then(()=> {
      fireDB.collection("usersTwo").doc("RYonaGAFP0EedOD2FoAc").delete().then(()=> {
        console.log("It was deleted!");
      }).catch((error)=> {
        console.error(error);
      })
    })
  }

  readData = () => {
    fireDB.collection("users").get("WbG9pMzvkJ8s8dOZSbal").then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${(doc.data.membershipTier)}`);
      })
    })
  }

  render() {
    return (
        <div className="app">
          <button onClick={()=>{this.createUser()}}>Create User</button>
          <button onClick={()=>{this.updateUser()}}>Update User</button>
          <button onClick={()=>{this.readData()}}>Read Data</button>
          <button onClick={()=>{this.deleteData()}}>Delete Data</button>
            <TopNav className="app__topnav"/>
            <main className="app__main">
              {this.state.user !== null && <p>I'm here</p>}
              <SideNav/>
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
              {/* ------------------------------------------------------ */}
                <Switch>
                  {/* <Route exact path="/" render={(routeProps) => <Landing {...routeProps} />} /> */}
                  <Route exact path="/register" render={(routeProps) => <Register {...routeProps} />} />
                </Switch>
              {/* ------------------------------------------------------ */}
              <Switch>
                <Route exact path="/home" render={(routeProps) => <Home {...routeProps} />} />
                <Route exact path="/user/:userid" render={(routeProps) => <UserProfile {...routeProps} />} />
                <Route exact path="/business/:businessid" render={(routeProps) => <UserProfile {...routeProps} />} />
                <Route exact path="/business/:businessid/:envId" render={(routeProps) => <ModifyEnv {...routeProps} />} />    
              </Switch>
            </main>
        </div>
    );
  }
}

export default App;
