import React, { Component } from 'react';
import {fireAuth, fireDB, fireAuthGoogle, fireAuthLinkedIn} from '../../firebase';
import firebase from 'firebase/app';
import googleIcon from '../../assets/icons/btn_google.svg';
import linkedinIcon from '../../assets/icons/btn_linkedIn.svg';
import './Landing.scss';

export class Landing extends Component {
    render() {
        return (
            <div>
                <p>This is the landing page</p>
            </div>
        )
    }
}

export default Landing
