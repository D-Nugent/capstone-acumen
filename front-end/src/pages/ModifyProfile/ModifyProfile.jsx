import React, { Component } from 'react';

export class ModifyProfile extends Component {
    render() {
        console.log(this.props);
        return (
            <div>
                <p>This is the page for creating or editing user profiles and business profiles</p>
            </div>
        )
    }
}

export default ModifyProfile
