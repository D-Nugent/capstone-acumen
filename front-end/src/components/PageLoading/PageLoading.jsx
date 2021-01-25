import React from 'react';
import './PageLoading.scss';

// Page Loading presents loading visuals for users while API requests are ran in async manner
export default function PageLoading() {
    return (
        <div className="loading">
            <h2 className="loading__text">I'm Loading...honest...</h2>
            <div className="loading__animation"></div>
      </div>
    )
}
