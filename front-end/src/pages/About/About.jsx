import React, { Component, useContext, useState } from 'react';
import './About.scss';
import {firebaseContext} from '../../provider/FirebaseProvider';

function About () {
const {user, dataLoad} = useContext(firebaseContext);

    return (
        <div className="about">
            <div className="about__container">
                <h2 className="about__container-heading">About and FAQS's</h2>
            </div>
        </div>
    )
}

export default About
