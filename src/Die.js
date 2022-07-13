import React from "react"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
         <div className="die-placement"> {[...Array(props.value)].map((elem,index) => <div className="die-num"></div>)}</div>
    
        </div>
    )
}