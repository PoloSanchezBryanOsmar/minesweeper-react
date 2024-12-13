// import React, { useState } from 'react';

// const PlayerManager = ({ 
//   players, 
//   currentPlayer, 
//   onAddPlayer, 
//   onRemovePlayer, 
//   onUpdatePlayerName,
//   onSelectPlayer,
//   playerScores 
// }) => {
//   const [newPlayerName, setNewPlayerName] = useState('');
//   const [editingPlayerId, setEditingPlayerId] = useState(null);
//   const [editPlayerName, setEditPlayerName] = useState('');

//   const handleAddPlayer = () => {
//     if (newPlayerName.trim() && players.length < 4) {
//       onAddPlayer(newPlayerName);
//       setNewPlayerName('');
//     }
//   };

//   const startEditPlayer = (player) => {
//     setEditingPlayerId(player.id);
//     setEditPlayerName(player.name);
//   };

//   const savePlayerName = () => {
//     if (editPlayerName.trim()) {
//       onUpdatePlayerName(editingPlayerId, editPlayerName);
//       setEditingPlayerId(null);
//     }
//   };

//   const renderPlayerResults = (playerId) => {
//     const difficulties = ['facil', 'medio', 'dificil'];
//     const scores = playerScores[playerId] || {};

//     return (
//       <table className="player-results">
//         <thead>
//           <tr>
//             <th>Dificultad</th>
//             <th>Victorias</th>
//             <th>Derrotas</th>
//           </tr>
//         </thead>
//         <tbody>
//           {difficulties.map(difficulty => {
//             const difficultyScores = scores[difficulty] || { wins: 0, losses: 0 };
//             return (
//               <tr key={difficulty}>
//                 <td>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</td>
//                 <td>{difficultyScores.wins}</td>
//                 <td>{difficultyScores.losses}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     );
//   };

//   return (
//     <div className="player-manager">
//       <h3>Jugadores</h3>
      
//       {/* Lista de Jugadores */}
//       <div className="players-list">
//         {players.map((player) => (
//           <div 
//             key={player.id} 
//             className={`player-item ${currentPlayer?.id === player.id ? 'active' : ''}`}
//           >
//             {editingPlayerId === player.id ? (
//               <div className="player-edit">
//                 <input
//                   type="text"
//                   value={editPlayerName}
//                   onChange={(e) => setEditPlayerName(e.target.value)}
//                   onBlur={savePlayerName}
//                   onKeyPress={(e) => e.key === 'Enter' && savePlayerName()}
//                 />
//                 <button onClick={savePlayerName}>✓</button>
//               </div>
//             ) : (
//               <>
//                 <span 
//                   onClick={() => onSelectPlayer(player)}
//                   className="player-name"
//                 >
//                   {player.name}
//                 </span>
//                 <div className="player-actions">
//                   <button onClick={() => startEditPlayer(player)}>✏️</button>
//                   <button onClick={() => onRemovePlayer(player.id)}>🗑️</button>
//                 </div>
//               </>
//             )}
//             {currentPlayer?.id === player.id && <span className="current-player-badge">Jugando</span>}
//           </div>
//         ))}
//       </div>

//       {/* Resultados de los Jugadores */}
//       {players.length > 0 && (
//         <div className="players-results-section">
//           <h4>Resultados</h4>
//           {players.map(player => (
//             <div key={player.id} className="player-results-container">
//               <h5>{player.name}</h5>
//               {renderPlayerResults(player.id)}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Añadir Jugador */}
//       <div className="add-player">
//         <input
//           type="text"
//           value={newPlayerName}
//           onChange={(e) => setNewPlayerName(e.target.value)}
//           placeholder="Nombre del jugador"
//           disabled={players.length >= 4}
//         />
//         <button 
//           onClick={handleAddPlayer}
//           disabled={!newPlayerName.trim() || players.length >= 4}
//         >
//           Añadir Jugador
//         </button>
//       </div>

//       <style jsx>{`
//         /* Estilos anteriores... */

//         .players-results-section {
//           margin-top: 16px;
//           background-color: #e6eaf0;
//           border-radius: 8px;
//           padding: 12px;
//         }

//         .player-results-container {
//           margin-bottom: 12px;
//         }

//         .player-results {
//           width: 100%;
//           border-collapse: collapse;
//         }

//         .player-results th, 
//         .player-results td {
//           border: 1px solid #b0c4de;
//           padding: 8px;
//           text-align: center;
//         }

//         .player-results th {
//           background-color: #4a90e2;
//           color: white;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PlayerManager;

import React, { useState } from 'react';

const PlayerManager = ({ 
  players, 
  currentPlayer, 
  onAddPlayer, 
  onRemovePlayer, 
  onUpdatePlayerName,
  onSelectPlayer,
  playerScores 
}) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editPlayerName, setEditPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (newPlayerName.trim() && players.length < 4) {
      onAddPlayer(newPlayerName);
      setNewPlayerName('');
    }
  };

  const startEditPlayer = (player) => {
    setEditingPlayerId(player.id);
    setEditPlayerName(player.name);
  };

  const savePlayerName = () => {
    if (editPlayerName.trim()) {
      onUpdatePlayerName(editingPlayerId, editPlayerName);
      setEditingPlayerId(null);
    }
  };

  const renderPlayerResults = (playerId) => {
    const difficulties = ['facil', 'medio', 'dificil'];
    const scores = playerScores[playerId] || {};

    return (
      <table className="player-results">
        <thead>
          <tr>
            <th>Dificultad</th>
            <th>Victorias</th>
            <th>Derrotas</th>
          </tr>
        </thead>
        <tbody>
          {difficulties.map(difficulty => {
            const difficultyScores = scores[difficulty] || { wins: 0, losses: 0 };
            return (
              <tr key={difficulty}>
                <td>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</td>
                <td>{difficultyScores.wins}</td>
                <td>{difficultyScores.losses}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="player-manager">
      <h3>Jugadores</h3>
      
      <div className="players-list">
        {players.map((player) => (
          <div 
            key={player.id} 
            className={`player-item ${currentPlayer?.id === player.id ? 'active' : ''}`}
          >
            {editingPlayerId === player.id ? (
              <div className="player-edit">
                <input
                  type="text"
                  value={editPlayerName}
                  onChange={(e) => setEditPlayerName(e.target.value)}
                  onBlur={savePlayerName}
                  onKeyPress={(e) => e.key === 'Enter' && savePlayerName()}
                />
                <button onClick={savePlayerName}>✓</button>
              </div>
            ) : (
              <>
                <span 
                  onClick={() => onSelectPlayer(player)}
                  className="player-name"
                >
                  {player.name}
                </span>
                <div className="player-actions">
                  <button onClick={() => startEditPlayer(player)}>✏️</button>
                  <button onClick={() => onRemovePlayer(player.id)}>🗑️</button>
                </div>
              </>
            )}
            {currentPlayer?.id === player.id && <span className="current-player-badge">Jugando</span>}
          </div>
        ))}
      </div>

      {players.length > 0 && (
        <div className="players-results-section">
          <h4>Resultados</h4>
          {players.map(player => (
            <div key={player.id} className="player-results-container">
              <h5>{player.name}</h5>
              {renderPlayerResults(player.id)}
            </div>
          ))}
        </div>
      )}

      <div className="add-player">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="Nombre del jugador"
          disabled={players.length >= 4}
        />
        <button 
          onClick={handleAddPlayer}
          disabled={!newPlayerName.trim() || players.length >= 4}
        >
          Añadir Jugador
        </button>
      </div>

      <style jsx>{`
        .player-manager {
          margin-top: 20px;
        }
        .players-list {
          margin-bottom: 20px;
        }
        .player-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .player-name {
          cursor: pointer;
          font-weight: bold;
        }
        .current-player-badge {
          background: #2ecc71;
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 12px;
        }
        .add-player {
          display: flex;
          gap: 10px;
        }
        .player-results-section {
          margin-top: 20px;
        }
        .player-results {
          width: 100%;
          border-collapse: collapse;
        }
        .player-results th,
        .player-results td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default PlayerManager;
