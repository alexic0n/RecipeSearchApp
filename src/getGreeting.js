import React from 'react';
import './App.css';

function getGreeting(){
    const date = new Date()
    const hours = date.getHours()
    let timeOfDay
    if(hours < 12) {
        timeOfDay = "morning"
    } else if (hours >= 12 && hours < 17){
        timeOfDay = "afternoon"
    } else {
        timeOfDay = "evening"
    }
    return (<p className="introPara">Good {timeOfDay}, let's find you a recipe...</p>)
}

export default getGreeting