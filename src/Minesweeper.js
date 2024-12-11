import React, { useState, useEffect, useRef } from 'react';
import PlayerManager from './PlayerManager';  // Asume que está en el mismo directorio
import GameEndDialog from './GameEndDialog';
// Configuraciones de dificultad
const DIFFICULTY_LEVELS = {
  facil: { 
    width: 8, 
    height: 8, 
    mineProbability: 0.10, 
    name: 'Fácil' 
  },
  medio: { 
    width: 12, 
    height: 12, 
    mineProbability: 0.15, 
    name: 'Medio' 
  },
  dificil: { 
    width: 16, 
    height: 16, 
    mineProbability: 0.20, 
    name: 'Difícil' 
  }
};

const Buscaminas = () => {
  const [difficulty, setDifficulty] = useState('facil');
  const [board, setBoard] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [time, setTime] = useState(0);
  const [flagCount, setFlagCount] = useState(0);
  const [gameTimer, setGameTimer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerScores, setPlayerScores] = useState({});
  const [showGameEndDialog, setShowGameEndDialog] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null); 

  // Obtener configuración de dificultad actual
  const getDifficultyConfig = () => DIFFICULTY_LEVELS[difficulty];

  // Crear el tablero inicial
  const createBoard = () => {
    const { width, height, mineProbability } = getDifficultyConfig();
    console.log('Creating board with:', { width, height, mineProbability });
    
    const newBoard = [];
    
    for (let row = 0; row < height; row++) {
      const newRow = [];
      for (let col = 0; col < width; col++) {
        const isMine = Math.random() < mineProbability;
        newRow.push({
          isMine,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0
        });
      }
      newBoard.push(newRow);
    }
  
    // Calcular minas vecinas
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        newBoard[row][col].neighborMines = countNeighborMines(newBoard, row, col);
      }
    }
  
    return newBoard;
  };
  
  const countNeighborMines = (board, row, col) => {
    const height = board.length;
    const width = board[0].length;
    let count = 0;
    
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        
        if (
          newRow >= 0 && 
          newRow < height && 
          newCol >= 0 && 
          newCol < width && 
          board[newRow][newCol].isMine
        ) {
          count++;
        }
      }
    }
    return count;
  };
  
  // Iniciar temporizador
  const startTimer = () => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const currentTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTime(currentTime);
    }, 1000);
  };

  // Detener temporizador
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Revelar celdas
  const revealCell = (row, col) => {
    if (gameStatus !== 'playing') return;
    
    // Iniciar temporizador solo la primera vez que se revela una celda
    if (!timerStarted) {
      startTimer();
      setTimerStarted(true);
    }
    
    const { width, height } = getDifficultyConfig();
    const newBoard = [...board];
    const cell = newBoard[row][col];
    
    // No revelar celdas ya marcadas o ya reveladas
    if (cell.isFlagged || cell.isRevealed) return;
    
    cell.isRevealed = true;
    
    // Verificar si es una mina
    if (cell.isMine) {
      setGameStatus('lost');
      stopTimer();
      updatePlayerScore(false);  // Derrota
      setShowGameEndDialog(true);
      return;
    }
    
    // Revelar celdas vecinas si no hay minas cerca
    if (cell.neighborMines === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;
          
          if (
            newRow >= 0 && 
            newRow < height && 
            newCol >= 0 && 
            newCol < width &&
            !newBoard[newRow][newCol].isRevealed
          ) {
            revealCell(newRow, newCol);
          }
        }
      }
    }
    
    setBoard(newBoard);
    
    // Verificar victoria
    checkGameStatus(newBoard);
  };

  // Nueva función para seleccionar el siguiente jugador
  const handleSelectNextPlayer = (player) => {
    setCurrentPlayer(player);
    setShowGameEndDialog(false);
    resetGame(); // Reinicia el juego para el nuevo jugador
  };

  // Marcar/desmarcar bandera
  const toggleFlag = (row, col) => {
    if (gameStatus !== 'playing') return;

    const newBoard = [...board];
    const cell = newBoard[row][col];

    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged;
      setBoard(newBoard);

      // Actualizar contador de banderas
      setFlagCount(prevCount => 
        cell.isFlagged ? prevCount + 1 : prevCount - 1
      );
    }
  };

  // Verificar estado del juego
  const checkGameStatus = (currentBoard) => {
  const { width, height } = getDifficultyConfig();
  const allNonMineCellsRevealed = currentBoard.every(row => 
    row.every(cell => 
      cell.isRevealed || cell.isMine
    )
  );

  if (allNonMineCellsRevealed) {
    setGameStatus('won');
    stopTimer();
    updatePlayerScore(true);  // Victoria
    setShowGameEndDialog(true);
  }
};

  // Nueva función para actualizar puntaje del jugador
  const updatePlayerScore = (won) => {
    if (!currentPlayer) return;
  
    setPlayerScores(prev => ({
      ...prev,
      [currentPlayer.id]: {
        ...(prev[currentPlayer.id] || {}),
        [difficulty]: {
          wins: (prev[currentPlayer.id]?.[difficulty]?.wins || 0) + (won ? 1 : 0),
          losses: (prev[currentPlayer.id]?.[difficulty]?.losses || 0) + (won ? 0 : 1)
        }
      }
    }));
  };

  // Nuevas funciones para gestión de jugadores
  const handleAddPlayer = (name) => {
    const newPlayer = { 
      id: Date.now(), 
      name 
    };
    setPlayers(prev => [...prev, newPlayer]);
    
    // Si es el primer jugador, lo seleccionamos automáticamente
    if (players.length === 0) {
      setCurrentPlayer(newPlayer);
    }
  };

  const handleRemovePlayer = (playerId) => {
    const updatedPlayers = players.filter(p => p.id !== playerId);
    setPlayers(updatedPlayers);

    // Si se elimina el jugador actual, seleccionar otro o null
    if (currentPlayer?.id === playerId) {
      setCurrentPlayer(updatedPlayers[0] || null);
    }
  };

  const handleUpdatePlayerName = (playerId, newName) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, name: newName } : p
    ));

    // Actualizar nombre del jugador actual si es necesario
    if (currentPlayer?.id === playerId) {
      setCurrentPlayer(prev => ({ ...prev, name: newName }));
    }
  };

  const handleSelectPlayer = (player) => {
    setCurrentPlayer(player);
  };

  // Cambiar dificultad
  const handleDifficultyChange = (e) => {
    const newDifficulty = e.target.value;
    console.log('Selected difficulty:', newDifficulty);
    
    setDifficulty(newDifficulty);
    resetGame(newDifficulty);
    
    // Forzar re-renderizado
    setTimeout(() => {
      const config = DIFFICULTY_LEVELS[newDifficulty];
      console.log('New config:', config);
    }, 0);
  };

  // Reiniciar juego
  const resetGame = (newDifficulty = difficulty) => {
    // Guardar la dificultad seleccionada
    setDifficulty(newDifficulty);
    
    // Crear nuevo tablero con la dificultad específica
    const config = DIFFICULTY_LEVELS[newDifficulty];
    const newBoard = Array.from({ length: config.height }, (_, row) => 
      Array.from({ length: config.width }, (_, col) => ({
        isMine: Math.random() < config.mineProbability,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );
  
    // Calcular minas vecinas
    for (let row = 0; row < config.height; row++) {
      for (let col = 0; col < config.width; col++) {
        newBoard[row][col].neighborMines = countNeighborMines(newBoard, row, col);
      }
    }
    
    // Resetear estados
    setBoard(newBoard);
    setGameStatus('playing');
    setTime(0);
    setFlagCount(0);
    setTimerStarted(false); 
    
    // Detener temporizador existente
    stopTimer();
  };

  // Inicializar juego
  useEffect(() => {
    resetGame();
    
    
    // Limpiar temporizador al desmontar componente
    return () => {
      if (gameTimer) {
        clearInterval(gameTimer);
      }
    };
  }, []);

  // Renderizar celdas
  const renderCell = (cell, row, col) => {
    let cellClass = 'cell';
    let cellContent = '';
    let cellStyle = {};

    if (cell.isRevealed) {
      cellClass += ' revealed';
      if (cell.isMine) {
        cellContent = '💣';
        cellStyle.backgroundColor = '#ff4d4d';
        cellStyle.color = 'white';
      } else if (cell.neighborMines > 0) {
        cellContent = cell.neighborMines.toString();
        // Colores diferentes para diferentes números de minas cercanas
        const numberColors = [
          '', '#3498db', '#2ecc71', '#e74c3c', 
          '#9b59b6', '#34495e', '#1abc9c', '#7f8c8d', '#d35400'
        ];
        cellStyle.color = numberColors[cell.neighborMines] || 'black';
      }
    } else if (cell.isFlagged) {
      cellContent = '🚩';
      cellStyle.backgroundColor = '#3498db';
      cellStyle.color = 'white';
    }

    return (
      <div 
        key={`${row}-${col}`}
        className={cellClass}
        style={cellStyle}
        onClick={() => revealCell(row, col)}
        onContextMenu={(e) => {
          e.preventDefault();
          toggleFlag(row, col);
        }}
      >
        {cellContent}
      </div>
    );
  };

  return (
    <div className="buscaminas-container-wrapper">
      <div className="buscaminas-container">
        {/* Barra superior de menú */}
        <div className="menu-bar">
          <div className="menu-item difficulty-selector">
            <label htmlFor="difficulty-select">Dificultad: </label>
            <select 
              id="difficulty-select"
              value={difficulty}
              onChange={handleDifficultyChange}
              className="difficulty-select"
            >
              {Object.keys(DIFFICULTY_LEVELS).map(level => (
                <option 
                  key={level} 
                  value={level}
                >
                  {DIFFICULTY_LEVELS[level].name}
                </option>
              ))}
            </select>
          </div>
          <div className="menu-stats">
            <div className="menu-item">
              <span>⏱️ {time} s</span>
            </div>
            <div className="menu-item">
              <span>🚩 {flagCount}</span>
            </div>
          </div>
        </div>
  
        {/* Estado del juego */}
        <div className="game-status">
          {gameStatus === 'won' && <p className="win-message">¡Ganaste! 🏆 </p>}
          {gameStatus === 'lost' && <p className="lose-message">¡Perdiste! 💥</p>}
        </div>
  
        {/* Tablero de juego */}
        <div 
          className="board" 
          style={{
          gridTemplateColumns: `repeat(${getDifficultyConfig().width}, 1fr)`
          }}
          >
          {console.log('Difficulty:', difficulty)}
          {console.log('Current Config:', getDifficultyConfig())}
          {console.log('Board dimensions:', board.length, board[0]?.length)}
          {board.map((row, rowIndex) => 
          row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
          )}
        </div>
        
  
        {/* Botón de reinicio */}
        <button 
          onClick={() => resetGame()} 
          className="reset-btn"
        >
          Reiniciar Juego
        </button>
  
        <style jsx>{`
          .buscaminas-container {
            background-color: #f0f4f8;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
            font-family: 'Arial', sans-serif;
          }
  
          .buscaminas-container {
          background-color: #f0f4f8;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
          font-family: 'Arial', sans-serif;
        }

        .menu-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 12px;
          background-color: #4a90e2;
          border-radius: 8px;
          color: white;
        }

        .menu-stats {
          display: flex;
          gap: 15px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: bold;
        }

        .difficulty-select {
          background-color: white;
          color: #4a90e2;
          border: none;
          border-radius: 4px;
          padding: 6px 10px;
          margin-left: 10px;
        }

        .board {
          display: grid;
          gap: 4px;
          background-color: #e6eaf0;
          border-radius: 8px;
          padding: 8px;
          box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .cell {
          aspect-ratio: 1;
          background-color: #b0c4de;
          border-radius: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          font-weight: bold;
          font-size: 18px;
          transition: all 0.2s ease;
          border: 2px solid #8ca6c0;
        }

        .cell:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .cell.revealed {
          background-color: #d1e8ff;
          cursor: default;
          border-color: #4a90e2;
        }

        .reset-btn {
          display: block;
          width: 100%;
          margin-top: 20px;
          padding: 12px 20px;
          background-color: #4a90e2;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          transition: background-color 0.3s ease;
        }

        .reset-btn:hover {
          background-color: #357abd;
        }

        .game-status {
          text-align: center;
          margin-bottom: 15px;
          height: 30px;
        }

        .win-message {
          color: #2ecc71;
          font-size: 22px;
          font-weight: bold;
        }

        .lose-message {
          color: #e74c3c;
          font-size: 22px;
          font-weight: bold;
        }
        `}</style>
      </div>
      
      <PlayerManager 
        players={players}
        currentPlayer={currentPlayer}
        onAddPlayer={handleAddPlayer}
        onRemovePlayer={handleRemovePlayer}
        onUpdatePlayerName={handleUpdatePlayerName}
        onSelectPlayer={handleSelectPlayer}
        playerScores={playerScores}
      />
      
      <GameEndDialog 
      isOpen={showGameEndDialog}
      gameStatus={gameStatus}
      players={players}
      currentPlayer={currentPlayer}
      onSelectNextPlayer={handleSelectNextPlayer}
      time={time}
    />
  
      <style jsx>{`
        .buscaminas-container-wrapper {
          display: flex;
          gap: 20px;
          justify-content: center;
          align-items: flex-start;
          padding: 20px;
          background-color: #f4f7f9;
        }
      `}</style>
    </div>
  );
};
export default Buscaminas;