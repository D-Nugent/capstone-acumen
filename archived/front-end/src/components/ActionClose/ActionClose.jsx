import React from 'react';
import './ActionClose.scss';

function ActionClose() {
    return (
        <div className="action">
            <div className="action__close">
                <div className="action__close-top"></div>
                <p className="action__close-detail">CLOSE</p>
                <div className="action__close-bottom"></div>
            </div>
        </div>
    )
}

export default ActionClose
