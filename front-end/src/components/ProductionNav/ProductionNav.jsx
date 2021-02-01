import React from 'react';
import Chevron from '../../assets/icons/chevron_right.svg';
import './ProductionNav.scss';

function ProductionNav({stage}) {
    return (
        <div className="prodnav">
            <div className={`prodnav__container${stage==="setup"?" --active":""}`}>
                <div className="prodnav__container-numerical">
                    <h2 className="prodnav__container-numerical-value">1</h2>
                </div>
                <h4 className="prodnav__container-heading">Setup</h4>
                <img src={Chevron} alt="chevron" className="prodnav__container-chevron"/>
            </div>
            <div className={`prodnav__container${stage==="record"?" --active":""}`}>
                <div className="prodnav__container-numerical">
                    <h2 className="prodnav__container-numerical-value">2</h2>
                </div>
                <h4 className="prodnav__container-heading">Record</h4>
                <img src={Chevron} alt="chevron" className="prodnav__container-chevron"/>
            </div>
            <div className={`prodnav__container${stage==="review"?" --active":""}`}>
                <div className="prodnav__container-numerical">
                    <h2 className="prodnav__container-numerical-value">3</h2>
                </div>
                <h4 className="prodnav__container-heading">Review</h4>
                <img src={Chevron} alt="chevron" className="prodnav__container-chevron"/>
            </div>
        </div>
    )
};

export default ProductionNav
