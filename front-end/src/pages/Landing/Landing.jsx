import React, { Component, useState, useContext } from 'react';
import './Landing.scss';
import {firebaseContext} from '../../provider/FirebaseProvider';


function Landing () {
const {user,dataLoad} = useContext(firebaseContext);

console.log(dataLoad);
    return (
        <div className="landing">
            <div className="landing__container">
                <h1 className="landing__container-heading">Hi Snowhort! This is Acumen : )</h1>
                <h4 className="landing__container-heading">Presented by David</h4>
            </div>
        </div>
    )
}

export default Landing
