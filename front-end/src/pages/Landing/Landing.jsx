import React, { Component } from 'react';
import {
    IfFirebaseAuthed,
    IfFirebaseUnAuthed
} from "@react-firebase/auth";
import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';

export class Landing extends Component {
    render() {
        return (
            <div>
                <IfFirebaseAuthed>
                    <p>This is the landing page if you are logged in</p>
                </IfFirebaseAuthed>
                <IfFirebaseUnAuthed>
                    <p>This is the landing page if you are not logged in</p>
                </IfFirebaseUnAuthed>
            </div>
        )
    }
}

export default Landing
