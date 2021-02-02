import React, { Component } from 'react'

export class ViewVideo extends Component {
    render() {
        return (
            <div>
                <p>This is the page for viewing an uploaded video</p>
                  <video className="recorder__player" controls autoPlay controlsList="nodownload"/>
            </div>
        )
    }
}

export default ViewVideo
