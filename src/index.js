import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  if(props.highlight)
  {
	  return (	
	    <button className="square" onClick={props.onClick} style={{color:'red'}}>
	      {props.value}
	    </button>
	  );
  }
  else
  {
  	return (	
	    <button className="square" onClick={props.onClick}>
	      {props.value}
	    </button>
	  );
  }
}

class Board extends React.Component {
  
  renderSquare(i,row,col) {
  	const winner = calculateWinner(this.props.squares);
  	if(winner && winner !== 'draw')
  	{
		return (
		    <Square
		    	value={this.props.squares[i]}
		    	onClick={() => this.props.onClick(i,row,col)}
		    	highlight={winner.location.includes(i)}
		    />
	    );
	}
	else
	{
		return (
		    <Square
		    	value={this.props.squares[i]}
		    	onClick={() => this.props.onClick(i,row,col)}
		    />
	    );
	}
  }

  render() {
  	let squaresArray = [];
  	let num = 0;
  	let row = [];

  	for(let i = 0; i < 3; i++) {
  		row = [];
  		for(let j = 0; j < 3; j++) {
  			row.push(this.renderSquare(num, i, j));
  			num++;
  		}
  		squaresArray.push(<div key={num} className="board-row">{row}</div>);
  	}
    return (
      <div>
      	{squaresArray}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      clicked: null,
      increase: true
    };
  }

  reverseHistory() {
    const increase = this.state.increase;
    this.setState({
      increase: !increase,
    });
  }

  handleClick(i,row,col) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
    	history: history.concat([{
        	squares: squares,
        	clicked: [row, col]
        }]),
        stepNumber: history.length,
    	xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
  	const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';

      let row = null;
	  let col = null;

	  if(move) {
	  	row = '('+this.state.history[move].clicked[0]+', ';
  		col = this.state.history[move].clicked[1]+')';
	  }

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}> {move === this.state.stepNumber ? <b>{desc}</b> : desc } {row} {col} </button>
        </li>
      );
    });

    let status;
    if (winner && winner !== 'draw') {
      status = 'Winner: ' + winner.winnerPlayer;
    } else if(winner && winner === 'draw')
      {
		status = 'DRAW';
      }
      else
      {
      	status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
          	squares={current.squares}
            onClick={(i,row,col) => this.handleClick(i,row,col)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.increase ? moves : moves.reverse()}</ol>
          <button onClick={() => this.reverseHistory()}> Reverse </button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return{
      	location: lines[i],
      	winnerPlayer: squares[a]
      }
    }
    else if(!squares.includes(null)){
        return 'draw';
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
