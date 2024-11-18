import React, { useState, useEffect } from "react";
import GameGrid from "./GameGrid.js";

function Game() {
   // Declare state variables
   const [moves, setMoves] = useState(new Array(9).fill("")); // tracks X and O moves
   const [turn, setTurn] = useState("X"); // current player's turn
   const [gameOver, setGameOver] = useState(false); // game over state
   const [winner, setWinner] = useState(null); // winner or tie

   // Winning combinations for rows, columns, and diagonals
   const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
   ];

   // Check for winner
   function checkForWinner() {
      for (let combination of winningCombinations) {
         const [a, b, c] = combination;
         if (moves[a] && moves[a] === moves[b] && moves[a] === moves[c]) {
            setWinner(moves[a]);
            setGameOver(true);
            return true;
         }
      }
      // Check for tie (no more empty spaces)
      if (moves.every(move => move !== "")) {
         setWinner("Tie");
         setGameOver(true);
         return true;
      }
      return false;
   }

   // Handle a click on the grid (X or O move)
   function gridClick(whichSquare) {
      if (gameOver || moves[whichSquare] !== "") return; // Ignore if game over or square already clicked

      // Create a copy of the moves array to modify
      const newMoves = [...moves];
      newMoves[whichSquare] = turn; // Set the move for the current player
      setMoves(newMoves);

      // Check if the move results in a winner or tie
      if (checkForWinner()) {
         return; // If there's a winner, stop here
      }

      // If no winner, switch turns
      setTurn(turn === "X" ? "O" : "X");
   }

   // Optional: Computer move (random for O)
   function computerMove() {
      if (gameOver || turn === "X") return; // Only play if it's O's turn

      // Get available spots
      const availableMoves = moves
         .map((move, index) => move === "" ? index : null)
         .filter(index => index !== null);

      // If there are available moves, pick a random one
      if (availableMoves.length > 0) {
         const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
         gridClick(randomMove);
      }
   }

   // Trigger computer's move if it's O's turn
   useEffect(() => {
      if (turn === "O" && !gameOver) {
         setTimeout(computerMove, 500); // Add delay for effect
      }
   }, [turn, gameOver]); // Only trigger when turn changes

   // New Game function to reset the game
   function newGame() {
      setMoves(new Array(9).fill(""));
      setTurn("X");
      setGameOver(false);
      setWinner(null);
   }

   return (
      <>
         <h1>Tic-Tac-Toe</h1>
         <GameGrid moves={moves} click={gridClick} />
         <p>
            {gameOver ? (
               <strong>{winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`}</strong>
            ) : (
               <span>Turn: <strong className={turn}>{turn}</strong></span>
            )}
         </p>
         <p>
            <button onClick={newGame}>New Game</button>
         </p>
      </>
   );
}

export default Game;
