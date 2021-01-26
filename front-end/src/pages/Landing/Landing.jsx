import React, { Component } from 'react';
import {fireAuth, fireDB, fireAuthGoogle, fireAuthLinkedIn} from '../../firebase';
import firebase from 'firebase/app';
import './Landing.scss';

export class Landing extends Component {
    render() {
        console.log(this.props);
        return (
            <div className="landing">
                <div className="landing__container">
                    <h2 className="landing__container-heading">This is the landing page</h2>
                </div>
            </div>
        )
    }
}

export default Landing
