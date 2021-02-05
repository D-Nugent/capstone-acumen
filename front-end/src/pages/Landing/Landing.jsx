import React, { Component, useState, useContext } from 'react';
import {Link} from 'react-router-dom';
import './Landing.scss';
import {firebaseContext} from '../../provider/FirebaseProvider';
import acumenLogo from '../../assets/logos/acumenLogoSmall.svg';
import chevron from '../../assets/icons/chevron_right.svg';


function Landing () {
const {user,dataLoad} = useContext(firebaseContext);

console.log(dataLoad);
    return (
        <div className="landing">
            <div className="landing__container">
                <div className="landing__container-heading">
                    <h1 className="landing__container-heading-a">A</h1>
                    <img src={acumenLogo} alt="Acumen Icon" className="landing__container-heading-a-reverse"/>
                    <h1 className="landing__container-heading-cumen">
                        ·cu·men
                    </h1>
                </div>
                <h2 className="landing__container-pron">
                    /əˈkyo͞omən,ˈakyəmən/
                </h2>
                <div className="landing__container-details">
                    <h2 className="landing__container-details-desc">
                        noun: acumen - the ability to make good judgments and quick decisions,
                        typically in a particular domain.
                    </h2>
                    <h2 className="landing__container-details-desc-reverse">
                        noun: acumen - <span className="landing__emph">the future of recruitment, a modernisation of the paper resume
                        to an immersive digital video interview.</span>
                    </h2>
                    <Link to="/how" className="landing__container-details-learn">
                        Learn More
                        <img src={chevron} alt="chevron black" className="landing__container-details-learn-icon"/>
                        <img src={chevron} alt="chevron black" className="landing__container-details-learn-icon-focus"/>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Landing
