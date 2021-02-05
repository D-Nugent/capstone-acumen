import {Switch, Route} from 'react-router-dom'
import React, {useContext} from 'react';
import TopNav from '../TopNav/TopNav';
import SideNav from '../SideNav/SideNav';
import Landing from '../../pages/Landing/Landing';
import HowDoesItWork from '../../pages/HowDoesItWork/HowDoesItWork';
import About from '../../pages/About/About';
// import ModifyProfile from '../../pages/ModifyProfile/ModifyProfile';
import UserProfile from '../../pages/UserProfile/UserProfile';
import NewVideo from '../../pages/NewVideo/NewVideo';
import ViewVideo from '../../pages/ViewVideo/ViewVideo';
import NewEnv from '../../pages/NewEnv/NewEnv';
import ModifyEnv from '../../pages/ModifyEnv/ModifyEnv';
import CandidateReel from '../../pages/CandidateReel/CandidateReel';
import CandidateProfile from '../../pages/CandidateProfile/CandidateProfile';
import PageLoading from '../../components/PageLoading/PageLoading'
import './App.scss';
import {firebaseContext} from '../../provider/FirebaseProvider';


function App () {
  const {user, dataLoad} = useContext(firebaseContext);

  /* #ToDo - Delete Data to be utilized in removing userVideo content*/
    return (
      <div className="app">
        {dataLoad.loaded === false?
        <PageLoading/>
        :
        <>
            <Route render={(routeProps) => 
              <TopNav className="app__topnav" {...routeProps}/>
            }/>
                <main className="app__main">
                  <Route render={(routeProps) => <SideNav {...routeProps}/>}/>
                <Switch>
                  <Route exact path="/" render={(routeProps) => <Landing {...routeProps} />} />
                  {/* <Route exact path="/user/:userid/createProfile" render={(routeProps) => <ModifyProfile {...routeProps} />} /> */}
                  {/* <Route exact path="/user/:userid/editProfile" render={(routeProps) => <ModifyProfile {...routeProps} />} /> */}
                  <Route exact path="/user/:userid/newVideo" render={(routeProps) => <NewVideo {...routeProps} />} />
                  <Route exact path="/user/:userid/:videoid" render={(routeProps) => <ViewVideo {...routeProps} />} />
                
                  {/* <Route exact path="/business/:businessid/createProfile" render={(routeProps) => <ModifyProfile {...routeProps} />} /> */}
                  {/* <Route exact path="/business/:businessid/editProfile" render={(routeProps) => <ModifyProfile {...routeProps} />} /> */}
                  <Route exact path="/business/:businessid/newEnv" render={(routeProps) => <NewEnv {...routeProps} />} />

                  <Route exact path="/business/:businessid/:envId/candidates" render={(routeProps) => <CandidateReel {...routeProps} />} />
                  <Route exact path="/business/:businessid/:envId/candidates/:userid" render={(routeProps) => <CandidateProfile {...routeProps} />} />
                </Switch>
              {/* ------------------------------------------------------ */}
                <Switch>
                  {/* <Route exact path="/" render={(routeProps) => <Landing {...routeProps} />} /> */}
                  <Route exact path="/about" render={(routeProps) => <About {...routeProps} />} />
                </Switch>
              {/* ------------------------------------------------------ */}
              <Switch>
                <Route exact path="/how" render={(routeProps) => <HowDoesItWork {...routeProps} />} />
                <Route exact path="/user/:userid" render={(routeProps) => <UserProfile {...routeProps} />} />
                <Route exact path="/business/:businessid" render={(routeProps) => <UserProfile {...routeProps} />} />
                <Route exact path="/business/:businessid/:envId/edit" render={(routeProps) => <ModifyEnv {...routeProps} />} />    
              </Switch>
            </main>
            </>
            }
        </div>
    );
}

export default App