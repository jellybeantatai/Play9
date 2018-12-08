import React from 'react';
import './App.css';
import _ from 'lodash';

const Stars = (props) => {
  
  const numberOfStars = 1+Math.floor(Math.random()*9);
  
  // let starArray = [];
  // for(let i=0;i<numberOfStars;i++){
  //   starArray.push(<i key={i} className="fa fa-star"></i>);
  // }

  console.log(_.range(numberOfStars));
  return (
    <div className="col-5">
      {_.range(numberOfStars).map(i => <i key={i} className="fa fa-star"></i>)}
    </div>
  );
}

const Button = (props) => {
  return (
    <div className="col-2">
      <button className="btn btn-dark">=</button>
    </div>
  );
}

const Answer = (props) => {
  return (
    <div className="col-5">
      <span>5</span>
      <span>6</span>
    </div>
  );
}

const Numbers = (props) => {

  return(
    <div className="card text-center">
      {Numbers.List.map((number,i) => <span key={i}>{number}</span>)}
    </div>
  )
}

Numbers.List = _.range(1,10);


class Game extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>Play Nine</h1>
        <div className="row">
          <Stars />
          <Button />
          <Answer />
        </div>
        <br/>
          <Numbers/>
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
