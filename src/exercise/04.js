// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

const INITIAL_SQUARES_VALUE = Array(9).fill(null)
const INITIAL_MOVES_VALUE = []

const Board = ({squares, onClick}) => {
  const renderSquare = i => {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

const Game = () => {
  const [currentMove, setCurrentMove] = React.useState(0)
  const [history, setHistory] = useLocalStorageState(
    'history',
    INITIAL_MOVES_VALUE,
  )
  const [squares, setSquares] = useLocalStorageState(
    'squares',
    INITIAL_SQUARES_VALUE,
  )

  const currentStep = history[currentMove]
  const winner = calculateWinner(squares)
  const nextValue = calculateNextValue(squares)
  const status = calculateStatus(winner, squares, nextValue)

  const restart = () => {
    setSquares(INITIAL_SQUARES_VALUE)
    setHistory(INITIAL_MOVES_VALUE)
  }

  const selectSquare = square => {
    if (winner || squares[square] !== null) {
      return
    }

    const newHistory = history.slice(0, currentMove + 1)
    const squaresCopy = [...currentStep]

    squaresCopy[square] = nextValue
    setHistory([...newHistory, squaresCopy])
    setCurrentMove(newHistory.length)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={squares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>

        <MovesList>
          {history.map((_squares, historyIndex) => {
            const isCurrentMove = currentMove === historyIndex
            const description = isCurrentMove ? '(current)' : ''
            return (
              <MoveItem>
                <MoveItemButton
                  onClickHandler={() => {
                    setCurrentMove(historyIndex)
                  }}
                  disabled={isCurrentMove}
                >
                  {`Go to move #${historyIndex} ${description}`}
                </MoveItemButton>
              </MoveItem>
            )
          })}
        </MovesList>
      </div>
    </div>
  )
}

export const MovesList = ({children}) => {
  return <ol>{children}</ol>
}

export const MoveItem = ({children, index}) => {
  return <li key={index}>{children}</li>
}

export const MoveItemButton = ({disabled, children, onClickHandler}) => {
  return (
    <button disabled={disabled} onClick={onClickHandler}>
      {children}
    </button>
  )
}

// eslint-disable-next-line no-unused-vars
const calculateStatus = (winner, squares, nextValue) => {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
const calculateNextValue = squares =>
  squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'

// eslint-disable-next-line no-unused-vars
const calculateWinner = squares => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

const App = () => {
  return <Game />
}

export default App
