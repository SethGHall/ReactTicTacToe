import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import cloneDeep from 'lodash/cloneDeep';


class Square extends React.Component
{
    render()
    {
        return (
            <button 
                className={this.props.isWinner?"squareHighlight":"square"} 
                onClick={this.props.onClick}>
                {this.props.value} 
            </button>
          );

    }
}

  function calculateWinner(squares)
  {
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

      for(let i=0;i<lines.length;i++)
      {   const [a,b,c] = lines[i];
        
          if(squares[a].player != null && squares[a].player === squares[b].player && squares[a].player === squares[c].player)
          {     squares[a].winner = true;
                squares[b].winner = true;
                squares[c].winner = true;
                return squares[a].player;
          }
      }
      return null;
  }


  class Board extends React.Component {
    
    renderSquare(i) { 
        
      return <Square
                key={i}
                value={this.props.squares[i].player}
                isWinner={this.props.squares[i].winner}
                onClick={() => this.props.onClick(i)}
                />;
    }
  

    renderRow(offset)
    {
        const squares = [];
        for (let s = 0; s < 3; s++) {
            squares.push(
                this.renderSquare(offset + s)
            );
        }
        return (
        <div className="board-row" key={offset}>
            {squares}
        </div>
        )
    }

    render() { 
        
        const rows = [];
        for(let r =0;r<3;r++)
        {
            rows.push(
                this.renderRow(r*3)
            );
        }
      return (
        <div>
            {rows}
        </div>
      );
    }
  }
  

  
  class Game extends React.Component {
    constructor(props)
    {   super(props);
        let squares = Array(9);
        for(var i=0; i<squares.length;i++){
            squares[i] = {player: null, winner: false};
        };


        this.state = {
            history: [{
                squares: squares.slice(),
                moves: Array(2).fill(0),
            }],
            turn: true,
            stepNumber: 0,
            listDescending: true,
        };

    } 

    handleClick(i){
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[history.length-1];
        const squares = cloneDeep(current.squares);
        const move = current.moves.slice();

        if(calculateWinner(squares) || squares[i].player)
            return;
        
        squares[i].player = this.state.turn ? 'X':'O';
        

        move[0] = Math.floor(i/3);        
        move[1] = i%3;
        
        this.setState({   
                history: history.concat([{
                squares: squares,
                moves: move,
                }]),
                turn: !this.state.turn,
                stepNumber: history.length,
        });
    }

    jumpTo(step)
    {
        this.setState({
            stepNumber: step,
            turn: (step%2)===0,
        });
    }
    
    reverseList()
    {   console.log("switching "+this.state.listDescending);
        this.setState({
            listDescending: !this.state.listDescending,
        });
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let moves = history.map((step,move) =>
        {
            const desc = move ? "Go to move #"+move+"("+step.moves[0]+","+step.moves[1]+")" : "Go to game start";
            return(<li key={move}>
                <button onClick={()=> this.jumpTo(move)}>
                    {move === this.state.stepNumber ? <b>{desc}</b> : desc}
                </button>
            </li>);
        }); 

        if(!this.state.listDescending)
            moves = moves.reverse();
        

        let status;  
      
        if(winner != null)
            status = "The winner of the game is: "+winner;
        else
            status = 'Next player: '+(this.state.turn?'X':'O');

        if(winner === null && this.state.stepNumber === 9)
        {   status = "NO WINNER FOR TODAYS GAME ";
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares} 
                onClick={(i) => this.handleClick(i)} 
            /> 
            
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={() => this.reverseList()}>reverse list</button>
            <ol>{moves}</ol> 
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  