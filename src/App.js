import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls]=React.useState(0)
    const [seconds,setSeconds]=React.useState(0)
    const [minutes,setMinutes]=React.useState(0)
    const [highscore, setHighScore] = React.useState(() => {
        const saved = localStorage.getItem("highscore");
        const initialValue = JSON.parse(saved);
        return initialValue || "";
      });
    var timer;
    React.useEffect(() => {
        if(time<highscore){
        localStorage.setItem("highscore", JSON.stringify(highscore));
        setHighScore(time)
        }
      }, [highscore]);
    React.useEffect(() => {
        timer = setInterval(() =>{
        setSeconds(seconds + 1)
        if(seconds === 59)
        {
            setSeconds(0)
            setMinutes(minutes+1)
        }
    },1000)
    return ()=> clearInterval(timer);

})
    var time;
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            clearInterval(timer)
            time=timer
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    function rollNo(){
        setRolls(oldno => oldno+1)
    }
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRolls(-1)
            setSeconds(0)
            setMinutes(0)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={function(event){rollDice(); rollNo()}}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <div className="extras"><p>Rolls: {rolls}</p>
            <p>Time: {minutes>0?minutes+"m ":""}{seconds<10?seconds +"s":seconds+"s"}</p>
            <h5 style={{margin:"8px 8px",color:"red"}}>Least time: {highscore?"0":highscore}</h5></div>
        </main>
    )
}