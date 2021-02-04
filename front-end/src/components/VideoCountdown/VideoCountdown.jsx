import React, {useState,useEffect} from 'react';
import './VideoCountdown.scss';

// Page Loading presents loading visuals for users while API requests are ran in async manner
export default function VideoCountdown() {
    const [timerValue, setTimerValue] = useState({
        phrase:"",
        value:"",
    })

    var count = 5;

useEffect(() => {
    runCount();
}, [])

    function runCount() {
        if (count > 0) {
            count--;
            switch (count) {
                case 3:
                    setTimerValue({
                        phrase:"Lights?",
                        value: 2,
                    });
                    break;
                case 2:
                    setTimerValue({
                        phrase:"Camera?",
                        value: 1,
                    });
                    break;
                case 1:
                    setTimerValue({
                        phrase:"Action!",
                        value: "!",
                    });
                    break;
            
                default:
                    setTimerValue({
                        phrase:"Ready?",
                        value: 3,
                    });
                    break;
            }
            setTimeout(runCount, 1000);
        }
        else {
            return
        }
    }

    return (
        <div className="countdown">
            <div className="countdown__animation"></div>
            <div className="countdown__animation-1"></div>
            <div className="countdown__animation-2"></div>
            <div className="countdown__animation-3"></div>
            <div className="countdown__animation-4"></div>
            <div className="countdown__animation-5"></div>
            <div className="countdown__animation-6"></div>
            <div className="countdown__animation-7"></div>
            <p className="countdown__phrase">
                {timerValue.phrase}
            </p>
            <p className="countdown__value">
                {timerValue.value}
            </p>
        </div>
    )
}
