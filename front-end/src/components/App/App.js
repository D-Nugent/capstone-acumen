import {Switch, Route} from 'react-router-dom'
import React from 'react';
import TopNav from '../TopNav/TopNav';
import SideNav from '../SideNav/SideNav';
import Landing from '../../pages/Landing/Landing';
import Home from '../../pages/Home/Home';
import Register from '../../pages/Register/Register';
import './App.scss';
import ModifyProfile from '../../pages/ModifyProfile/ModifyProfile';
import UserProfile from '../../pages/UserProfile/UserProfile';
import NewVideo from '../../pages/NewVideo/NewVideo';
import ViewVideo from '../../pages/ViewVideo/ViewVideo';
import NewEnv from '../../pages/NewEnv/NewEnv';
import ModifyEnv from '../../pages/ModifyEnv/ModifyEnv';
import CandidateReel from '../../pages/CandidateReel/CandidateReel';
import CandidateProfile from '../../pages/CandidateProfile/CandidateProfile';
import AcumenLogo from '../../assets/logos/acumenLogoSmall.svg'

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <img src={AcumenLogo} alt="logo" className="logo"/>
        <TopNav/>
        <SideNav/>
        <Switch>
          <Route exact path="/" render={(routeProps) => <Landing {...routeProps} />} />
          <Route exact path="/home" render={(routeProps) => <Home {...routeProps} />} />
          <Route exact path="/register" render={(routeProps) => <Register {...routeProps} />} />

          <Route exact path="/:userid" render={(routeProps) => <UserProfile {...routeProps} />} />
          <Route exact path="/:userid/createProfile" render={(routeProps) => <ModifyProfile {...routeProps} />} />
          <Route exact path="/:userid/editProfile" render={(routeProps) => <ModifyProfile {...routeProps} />} />
          <Route exact path="/:userid/newVideo" render={(routeProps) => <NewVideo {...routeProps} />} />
          <Route exact path="/:userid/:videoid" render={(routeProps) => <ViewVideo {...routeProps} />} />


          <Route exact path="/:businessid" render={(routeProps) => <UserProfile {...routeProps} />} />
          <Route exact path="/:businessid/createProfile" render={(routeProps) => <ModifyProfile {...routeProps} />} />
          <Route exact path="/:businessid/editProfile" render={(routeProps) => <ModifyProfile {...routeProps} />} />
          <Route exact path="/:businessid/newEnv" render={(routeProps) => <NewEnv {...routeProps} />} />
          <Route exact path="/:businessid/:envId" render={(routeProps) => <ModifyEnv {...routeProps} />} />
          <Route exact path="/:businessid/:envId/candidates" render={(routeProps) => <CandidateReel {...routeProps} />} />
          <Route exact path="/:businessid/:envId/candidates/:userid" render={(routeProps) => <CandidateProfile {...routeProps} />} />
        </Switch>
      </div>
    );
  }
}

export default App;
