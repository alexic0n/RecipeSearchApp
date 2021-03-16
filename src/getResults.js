import React from 'react';
import './App.css';

function getResults(keywords, ingredients, lactose, vegan, vegetarian, pageno){
    return(
        <div className="fiveResults">
            <div className="resultDiv">
                <p>Keywords searched for: {keywords}</p>
            </div>
            <br/>
            <div className="resultDiv">
                <p>Ingredients searched for: {ingredients}</p>
            </div>
            <br/>
            <div className="resultDiv">
                <p>Lactose-Free: {lactose ? "Yes" : "No"}</p>
            </div>
            <br/>
            <div className="resultDiv">
                <p>Vegan: {vegan ? "Yes" : "No"}</p>
            </div>
            <br/>
            <div className="resultDiv">
                <p>Vegetarian: {vegetarian ? "Yes" : "No"}</p>
            </div>
        </div>
    )
}

export default getResults