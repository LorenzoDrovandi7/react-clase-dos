import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import "./TicTacToe.css";
import FancyButton from "../small/FancyButton";
import { useState } from "react";

/* 
  Esta tarea consiste en hacer que el juego funcione, para lograr eso deben completar el componente 
  TicTacToe y el custom hook `useTicTacToeGameState`, que como ven solamente define algunas variables.

  Para completar esta tarea, es requisito que la FIRMA del hook no cambie.
  La firma de una función consiste en los argumentos que recibe y el resultado que devuelve.
  Es decir, este hook debe recibir el argumento initialPlayer y debe devolver un objeto con las siguientes propiedades:
  {
    tiles: // un array de longitud 9 que representa el estado del tablero (es longitud 9 porque el tablero es 3x3)
    currentPlayer: // un string que representa el jugador actual ('X' o 'O')
    winner: // el ganador del partido, en caso que haya uno. si no existe, debe ser `null`
    gameEnded: // un booleano que representa si el juego terminó o no
    setTileTo: // una función que se ejecutará en cada click
    restart: // una función que vuelve a setear el estado original del juego
  }

  Verán que los diferentes componentes utilizados están completados y llevan sus propios propTypes
  Esto les dará algunas pistas
*/

const Square = ({ value, onClick = () => {} }) => {
  return (
    <div onClick={onClick} className="square">
      {value}
    </div>
  );
};

Square.propTypes = {
  value: PropTypes.oneOf(["X", "O", ""]),
  onClick: PropTypes.func,
};

const WinnerCard = ({ show, winner, onRestart = () => {} }) => {
  return (
    <div className={cx("winner-card", { "winner-card--hidden": !show })}>
      <span className="winner-card-text">{winner ? `Player ${winner} has won the game!` : "It's a tie!"}</span>
      <FancyButton onClick={onRestart}>Play again?</FancyButton>
    </div>
  );
};

WinnerCard.propTypes = {
  show: PropTypes.bool.isRequired,
  winner: PropTypes.oneOf(["X", "O"]),
  onRestart: PropTypes.func,
};

const getWinner = (tiles) => {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (tiles[a] !== "" && tiles[a] === tiles[b] && tiles[b] === tiles[c]) {
      return tiles[a];
    }
  }

  return null;
};

const useTicTacToeGameState = (initialPlayer) => {
  const [tiles, setTiles] = useState(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState(initialPlayer);
  const winner = getWinner(tiles);
  const gameEnded = winner !== null || !tiles.includes("");

  const setTileTo = (tileIndex, player) => {
    if (tiles[tileIndex] !== "" || gameEnded) return;
    const newTiles = [...tiles];
    newTiles[tileIndex] = player;
    setTiles(newTiles);
    setCurrentPlayer(player === "X" ? "O" : "X");
  };
  const restart = () => {
    setTiles(Array(9).fill(""));
    setCurrentPlayer(initialPlayer);
  };
  return { tiles, currentPlayer, winner, gameEnded, setTileTo, restart };
};

const TicTacToe = () => {
  const { tiles, currentPlayer, winner, gameEnded, setTileTo, restart } = useTicTacToeGameState("X");

  return (
    <div className="tictactoe">
      <WinnerCard show={gameEnded} winner={winner} onRestart={restart} />

      {[0, 1, 2].map((row) => (
        <div className="tictactoe-row" key={row}>
          {[0, 1, 2].map((col) => {
            const index = row * 3 + col;
            return <Square key={index} value={tiles[index]} onClick={() => setTileTo(index, currentPlayer)} />;
          })}
        </div>
      ))}
    </div>
  );
};

export default TicTacToe;
