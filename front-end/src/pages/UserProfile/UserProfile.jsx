import React, { Component } from 'react';
import './UserProfile.scss';

export class UserProfile extends Component {
    render() {
        return (
            <div className="userprofile">
                <div className="userprofile__container">
                    <h2 className="userprofile__container-heading">Profile Overview Page for Users</h2>
                    <h3 className="userprofile__container-heading">Things are looking a little sparse here</h3>
                </div>
            </div>
        )
    }
}

export default UserProfile
