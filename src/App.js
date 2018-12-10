import React from 'react';
import './App.css';
import _ from 'lodash';

var possibleCombinationSum = function(arr,n){
	if(arr.indexOf(n) >= 0) {return true;}
	if(arr[0]>n){return false;}
	if(arr[arr.length-1]>n){
		arr.pop();
		return possibleCombinationSum(arr,n);
	}
	var listSize = arr.length, combinationsCount = (1 << listSize)
	for(var i=1;i<combinationsCount;i++){
		var combinationSum = 0;
		for(var j=0; j<listSize ; j++){
			if(i&(1<<j)){combinationSum += arr[j];}
		}
		if(n===combinationSum){return true;}
	}
	return false;
};

const Stars = (props) => {

  // const numberOfStars = 1+Math.floor(Math.random()*9);

  // let starArray = [];
  // for(let i=0;i<numberOfStars;i++){
  //   starArray.push(<i key={i} className="fa fa-star"></i>);
  // }

  console.log(_.range(props.numberOfStars));
  return (
    <div className="col-5">
      {_.range(props.numberOfStars).map(i => <i key={i} className="fa fa-star"></i>)}
    </div>
  );
}

const Button = (props) => {
  let button;
  switch (props.answerIsCorrect) {
    case true:
      button =
        <button className="btn btn-success" onClick={props.acceptAnswer}>
          <i className="fa fa-check"></i>
        </button>
      break;

    case false:
      button =
        <button className="btn btn-danger">
          <i className="fa fa-times"></i>
        </button>
      break;

    default:
      button =
        <button className="btn btn-warning" onClick={props.checkAnswer} disabled={props.selectedNumbers.length === 0}>
          =
    </button>
      break;
  }
  return (
    <div className="col-2 text-center">
      {button}
      <br/><br/>
      <button className="btn btn-dark btn-sm" onClick={props.redraw} disabled={props.redraws === 0}>
        <i className="fa fa-redo-alt"></i> &nbsp; {props.redraws}
      </button>
    </div>
  );
}

const Answer = (props) => {
  return (
    <div className="col-5">
      {props.selectedNumbers.map((number, i) =>
        <span key={i} onClick={() => props.unselectNumber(number)}>{number}</span>)}
    </div>
  );
}

const Numbers = (props) => {

  let numberClassName = (number) => {
    if (props.selectedNumbers.indexOf(number) >= 0) {
      return 'selected';
    }
    if (props.usedNumbers.indexOf(number) >= 0) {
      return 'used';
    }
  }
  return (
    <div className="card text-center">
      {Numbers.List.map((number, i) =>
        <span key={i} className={numberClassName(number)}
          onClick={() => props.selectNumber(number)}>
          {number}
        </span>)}
    </div>
  )
}

Numbers.List = _.range(1, 10);

const DoneFrame = (props) => {
  return(
    <div className="text-center">
      <h3>{props.doneStatus}</h3>
      <button className="btn btn-secondary" onClick={props.resetGame}>Play Again!</button>
    </div>
  )
}


class Game extends React.Component {

  static randomNumber = () => 1 + Math.floor(Math.random() * 9)
  static initialState =()=>({
      selectedNumbers: [],
      randomNumberOfStars: Game.randomNumber(),
      answerIsCorrect: null,
      usedNumbers: [],
      redraws : 5,
      doneStatus : null
  })

  state = Game.initialState();
  resetGame = () => {
    this.setState(Game.initialState())
  }

  selectNumber = (clickedNumber) => {
    if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) { return; }
    this.setState((prevState) => ({
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber),
      answerIsCorrect: null
    }))
  }

  unselectNumber = (clickedNumber) => {
    this.setState((prevState) => ({
      selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber),
      answerIsCorrect: null
    }))
  }

  checkAnswer = () => {
    this.setState((prevState) => ({
      answerIsCorrect: prevState.randomNumberOfStars === prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }))
  }

  acceptAnswer = () => {
    this.setState((prevState) => ({
      usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
      randomNumberOfStars: Game.randomNumber()
    }),this.updateDoneStatus)
  }

  redraw = () => {
    if(this.state.redraws === 0){return;}
    this.setState((prevState) => ({
      selectedNumbers: [],
      answerIsCorrect: null,
      randomNumberOfStars: Game.randomNumber(),
      redraws : prevState.redraws-1
    }),this.updateDoneStatus)
  }

  possibleSolutions = ({randomNumberOfStars,usedNumbers}) => {
    
    const possibleNumbers = _.range(1,10).filter(number => usedNumbers.indexOf(number) === -1);
    return possibleCombinationSum(possibleNumbers,randomNumberOfStars);
  }

  updateDoneStatus = () => {
    this.setState((prevState) => {
      if(prevState.usedNumbers.length === 9){
        return {doneStatus : "Well Done!"};
      }
      if(prevState.redraws === 0 && !this.possibleSolutions(prevState)){
        return {doneStatus : "Sorry, you ran out of luck!"}
      }
    })
  }

  render() {
    const { randomNumberOfStars, selectedNumbers, answerIsCorrect, usedNumbers,redraws,doneStatus } = this.state;
    return (
      <div className="container">
        <h1>Play Nine</h1>
        <div className="row">
          <Stars numberOfStars={randomNumberOfStars} />
          <Button selectedNumbers={selectedNumbers}
            checkAnswer={this.checkAnswer}
            answerIsCorrect={answerIsCorrect}
            redraw = {this.redraw}
            redraws = {redraws}
            acceptAnswer={this.acceptAnswer} />
          <Answer selectedNumbers={selectedNumbers}
            unselectNumber={this.unselectNumber} />
        </div>
        <br />
        {doneStatus?
        <DoneFrame resetGame={this.resetGame} doneStatus={doneStatus}></DoneFrame>:
        <Numbers selectedNumbers={selectedNumbers}
          selectNumber={this.selectNumber}
          usedNumbers={usedNumbers} />
        }
        <br/>  
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <Game />
      </div>
    );
  }
}

export default App;
