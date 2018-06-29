import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import borderData from './squareBorders.json';

function Square(props) {
  return (
    <button className={props.style} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function InitializeBoard(width, height) {
	var board = new Array();

	for (var i = 0; i < width; i++) {
		board[i] = new Array();
		for (var j = 0; j < height; j++) {
			
			var rowKey = 'row' + i;
			var colKey = 'col' + j;
			
			board[i][j] = {
				'content': null, 
				'hasTopBorder': borderData[rowKey][colKey].T,
				'hasBottomBorder': borderData[rowKey][colKey].B,
				'hasLeftBorder': borderData[rowKey][colKey].L,
				'hasRightBorder': borderData[rowKey][colKey].R,
				'isVisible': true
				};
		}
	}
	
	return board;
}

class Board extends React.Component {
  constructor(props) {
    super(props);
	
	this.width = 50;
	this.height = 25;
	
	this.x = 25;
	this.y = 24;
	
	this.xExit = 24;
	this.yExit = 0;
	
	this.torchRadius = 5;

    this.state = {
	  x: this.x,
	  y: this.y,
      squares: InitializeBoard(this.width, this.height),
    };
	
	this.setState({
	  x: this.x,
	  y: this.y,
      squares: this.UpdateHiddenSquares(this.state.squares),
    });
	
	this.state.squares[this.x][this.y].content = '\u26F9';
	
  }
  
  UpdateHiddenSquares(squares) {

    //TODO: return original square array for now; need to find out what is wrong with this method
	return squares;
	
	const updatedSquares = squares.slice();
	  
	  //make all squares non-visible
	  for (var i = 0; i < this.width; i++)
	  {
		  for (var j = 0; j < this.height; j++)
		  {
			  updatedSquares[i][j].isVisible = false;
		  }
	  }
	  
	  //always make exit visible
	  updatedSquares[this.xExit][this.yExit].isVisible = true;
	  
	  //make current position visible
	  updatedSquares[this.state.x][this.state.y].isVisible = true;
	  
	  //make squares visible that are within the torch radius
	  for (var i = 1; i <= this.torchRadius; i++)
	  {
		  for (var j = 1; j <= this.torchRadius; j++)
		  {
			  if (this.state.x - i > 0) {
				  updatedSquares[this.state.x - i][this.state.y].isVisible = true;
			  }
			  if (this.state.x + i < this.width) {
				  updatedSquares[this.state.x + i][this.state.y].isVisible = true;
			  }
			  
			  if (this.state.y - j > 0) {
				  updatedSquares[this.state.x][this.state.y - j].isVisible = true;
			  }
			  
			  if (this.state.y + j < this.height) {
				  updatedSquares[this.state.x][this.state.y + j].isVisible = true;
			  }
		  }
	  }
	  
	  return updatedSquares;
  }

  handleClick(direction) {
	  
	if (this.state.x == this.xExit && this.state.y == this.yExit) {
		return;
	}
		
	const squares = this.state.squares.slice();
	const personSprite = '\u26F9'
	
	var curX = this.state.x;
	var curY = this.state.y;
	var newX = curX;
	var newY = curY;
	
	switch (direction) {
		case 'up':
			if (curY - 1 >= 0 && !(squares[curX][curY].hasTopBorder || squares[curX][curY - 1].hasBottomBorder)) {
				newY = curY - 1;
				squares[curX][newY].content = personSprite;
				squares[curX][curY].content = '';
			}
			break;
		case 'down':
			if (curY + 1 < this.height && !(squares[curX][curY].hasBottomBorder || squares[curX][curY + 1].hasTopBorder)) {
				newY = curY + 1;
				squares[curX][newY].content = personSprite;
				squares[curX][curY].content = '';
			}
			break;
		case 'left':
			if (curX - 1 >= 0 && !(squares[curX][curY].hasLeftBorder || squares[curX - 1][curY].hasRightBorder)) {
				newX = curX - 1;
				squares[newX][curY].content = personSprite;
				squares[curX][curY].content = '';
			}
			break;
		case 'right':
			if (curX + 1 < this.width && !(squares[curX][curY].hasRightBorder || squares[curX + 1][curY].hasLeftBorder)) {
				newX = curX + 1;
				squares[newX][curY].content = personSprite;
				squares[curX][curY].content = '';
			}
			break;	
	  }
	  
	  this.setState({
		  x: newX,
		  y: newY,
		  squares: squares,
	  });
	  
	  this.setState({
		x: newX,
		y: newY,
		squares: this.UpdateHiddenSquares(this.state.squares),
	  });
  }
  
  handleKeyDown = (event) => {
	if(event.key == "ArrowUp"){
		this.handleClick('up')
	}
	if(event.key == "ArrowDown"){
		this.handleClick('down')
	}
	if(event.key == "ArrowLeft"){
		this.handleClick('left')
	}
	if(event.key == "ArrowRight"){
		this.handleClick('right')
	}
}
  
  getStyleBySquare(i, j) {

	var style = 'square';
	
	if (this.state.squares[i][j].hasTopBorder == true) {
		style = style + ' squareTopBorder ';
	}
	if (this.state.squares[i][j].hasBottomBorder == true) {
		style = style + ' squareBottomBorder ';
	}
	if (this.state.squares[i][j].hasLeftBorder == true) {
		style = style + ' squareLeftBorder ';
	}
	if (this.state.squares[i][j].hasRightBorder == true) {
		style = style + ' squareRightBorder ';
	}

	if (i == this.xExit && j == this.yExit) {
		style = style + ' squareExit ';
	}
	
	if (this.state.squares[i][j].isVisible == false) {
		style = style + ' squareNotVisible ';
	}
	
	return style.trim();
}

  renderSquare(i, j, style) {
    return (
      <Square
        value={this.state.squares[i][j].content}
		style={style}
      />
    );
  }

  render() {
	const width = 50;
	const height = 25;

	var rowElements = [];
	for (var i = 0; i < height; i++) {
		var colElements=[];
		for (var j = 0; j < width; j++) {
			var style = this.getStyleBySquare(j, i);
			colElements.push(this.renderSquare(j, i, style));
		}
		rowElements.push(<div className="board-row">{colElements}</div>);
	}
	
	const upStr = '\u2191'
	const downStr = '\u2193';
	const leftStr = '\u2190';
	const rightStr = '\u2192';
	
    return (
      <div>
	  <input size='50' type='text' value='CLICK HERE TO USE KEYBOARD ARROW KEYS' autofocus='true' onKeyDown={this.handleKeyDown} />
	    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.showVictoryText()}</span>
        <div className="status">
		Maze Game&nbsp;&nbsp;&nbsp;
		<button onClick={() => this.handleClick('up')}>{upStr}</button>
		<button onClick={() => this.handleClick('down')}>{downStr}</button>
		<button onClick={() => this.handleClick('left')}>{leftStr}</button>
		<button onClick={() => this.handleClick('right')}>{rightStr}</button>
		&nbsp;&nbsp;&nbsp;
		</div>
        {rowElements}
      </div>
    );
  }
  
  showVictoryText() {
	  if (this.state.x == this.xExit && this.state.y == this.yExit) {
		  return '*****WINNER!!!!!!!!!!!!*******';
	  }
	  else {
		  return '';
	  }
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);