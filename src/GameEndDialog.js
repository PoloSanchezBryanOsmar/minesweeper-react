// import React from 'react';
// const GameEndDialog = ({ 
//   isOpen, 
//   gameStatus, 
//   players, 
//   currentPlayer, 
//   onSelectNextPlayer, 
//   time 
// }) => {
//   if (!isOpen) return null;
//   return (
//     <div className="game-end-overlay">
//       <div className="game-end-modal">
//         <h2 className={gameStatus === 'won' ? 'win-title' : 'lose-title'}>
//           {gameStatus === 'won' ? '¡Ganaste!' : '¡Perdiste!'}
//         </h2>
        
//         <div className="game-result-info">
//           <p>Tiempo: {time} segundos</p>
//           <p>Jugador: {currentPlayer.name}</p>
//         </div>
//         <div className="next-player-selection">
//           <h3>Selecciona al siguiente jugador</h3>
//           <div className="player-buttons">
//             {players
//               .filter(player => player.id !== currentPlayer.id)
//               .map(player => (
//                 <button 
//                   key={player.id} 
//                   onClick={() => onSelectNextPlayer(player)}
//                   className="player-select-btn"
//                 >
//                   {player.name}
//                 </button>
//               ))}
//             {players.length > 1 ? null : (
//               <p>Añade más jugadores para continuar</p>
//             )}
//           </div>
//         </div>
//       </div>
//       <style jsx>{`
//         .game-end-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background-color: rgba(0, 0, 0, 0.5);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 1000;
//         }
//         .game-end-modal {
//           background-color: white;
//           padding: 30px;
//           border-radius: 15px;
//           text-align: center;
//           max-width: 500px;
//           width: 90%;
//           box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
//         }
//         .win-title {
//           color: #2ecc71;
//           font-size: 2rem;
//         }
//         .lose-title {
//           color: #e74c3c;
//           font-size: 2rem;
//         }
//         .game-result-info {
//           margin: 20px 0;
//           background-color: #f0f4f8;
//           padding: 15px;
//           border-radius: 10px;
//         }
//         .player-buttons {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           justify-content: center;
//         }
//         .player-select-btn {
//           background-color: #4a90e2;
//           color: white;
//           border: none;
//           padding: 10px 20px;
//           border-radius: 8px;
//           cursor: pointer;
//           transition: background-color 0.3s ease;
//         }
//         .player-select-btn:hover {
//           background-color: #357abd;
//         }
//       `}</style>
//     </div>
//   );
// };
// export default GameEndDialog;

import React from 'react';
const GameEndDialog = ({ 
  isOpen, 
  gameStatus, 
  players, 
  currentPlayer, 
  onSelectNextPlayer, 
  time, 
  onReset
}) => {
  if (!isOpen) return null;
  return (
    <div className="game-end-overlay">
      <div className="game-end-modal">
        <h2 className={gameStatus === 'won' ? 'win-title' : 'lose-title'}>
          {gameStatus === 'won' ? '¡Ganaste!' : '¡Perdiste!'}
        </h2>
        
        <div className="game-result-info">
          <p>Tiempo: {time} segundos</p>
          <p>Jugador: {currentPlayer?.name || 'Jugador Anónimo'}</p>
        </div>
        <div className="next-player-selection">
          <h3>Selecciona al siguiente jugador</h3>
          <div className="player-buttons">
            {players
              .filter(player => player.id !== currentPlayer?.id)
              .map(player => (
                <button 
                  key={player.id} 
                  onClick={() => onSelectNextPlayer(player)}
                  className="player-select-btn"
                >
                  {player.name}
                </button>
              ))}
            {players.length > 1 ? null : (
              <p>Añade más jugadores para continuar</p>
            )}
          </div>
        </div>
        <button className="reset-btn" onClick={onReset}>Reiniciar Juego</button>
      </div>
      <style jsx>{`
        .game-end-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .game-end-modal {
          background-color: white;
          padding: 30px;
          border-radius: 15px;
          text-align: center;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .win-title {
          color: #2ecc71;
          font-size: 2rem;
        }
        .lose-title {
          color: #e74c3c;
          font-size: 2rem;
        }
        .game-result-info {
          margin: 20px 0;
          background-color: #f0f4f8;
          padding: 15px;
          border-radius: 10px;
        }
        .player-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }
        .player-select-btn {
          background-color: #4a90e2;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .player-select-btn:hover {
          background-color: #357abd;
        }
        .reset-btn {
          margin-top: 20px;
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }
        .reset-btn:hover {
          background-color: #c0392b;
        }
      `}</style>
    </div>
  );
};
export default GameEndDialog;
