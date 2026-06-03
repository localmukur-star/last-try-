class SlidingPuzzle {
    constructor() {
        this.size = 4;
        this.tiles = [];
        this.emptyIndex = 0;
        this.moves = 0;
        this.seconds = 0;
        this.timerInterval = null;
        this.isGameActive = false;
        
        this.puzzleElement = document.getElementById('puzzle');
        this.movesElement = document.getElementById('moves');
        this.timeElement = document.getElementById('time');
        this.difficultySelect = document.getElementById('difficulty');
        this.newGameButton = document.getElementById('newGame');
        this.playAgainButton = document.getElementById('playAgain');
        this.winMessage = document.getElementById('winMessage');
        this.winStats = document.getElementById('winStats');
        
        this.init();
    }
    
    init() {
        this.newGameButton.addEventListener('click', () => this.startNewGame());
        this.playAgainButton.addEventListener('click', () => {
            this.winMessage.classList.add('hidden');
            this.startNewGame();
        });
        this.difficultySelect.addEventListener('change', (e) => {
            this.size = parseInt(e.target.value);
            this.startNewGame();
        });
        
        this.startNewGame();
    }
    
    startNewGame() {
        this.stopTimer();
        this.moves = 0;
        this.seconds = 0;
        this.isGameActive = true;
        this.updateStats();
        
        this.createSolvedPuzzle();
        this.shufflePuzzle();
        this.render();
        this.startTimer();
    }
    
    createSolvedPuzzle() {
        this.tiles = [];
        const totalTiles = this.size * this.size;
        
        for (let i = 0; i < totalTiles; i++) {
            if (i === totalTiles - 1) {
                this.tiles.push(0); // Empty tile
                this.emptyIndex = i;
            } else {
                this.tiles.push(i + 1);
            }
        }
    }
    
    shufflePuzzle() {
        // Perform random valid moves to ensure solvability
        const shuffleMoves = this.size * this.size * 20;
        
        for (let i = 0; i < shuffleMoves; i++) {
            const neighbors = this.getNeighbors(this.emptyIndex);
            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            this.swapTiles(randomNeighbor, this.emptyIndex, false);
        }
    }
    
    getNeighbors(index) {
        const neighbors = [];
        const row = Math.floor(index / this.size);
        const col = index % this.size;
        
        if (row > 0) neighbors.push(index - this.size); // Up
        if (row < this.size - 1) neighbors.push(index + this.size); // Down
        if (col > 0) neighbors.push(index - 1); // Left
        if (col < this.size - 1) neighbors.push(index + 1); // Right
        
        return neighbors;
    }
    
    swapTiles(index1, index2, countMove = true) {
        [this.tiles[index1], this.tiles[index2]] = [this.tiles[index2], this.tiles[index1]];
        
        if (index1 === this.emptyIndex) {
            this.emptyIndex = index2;
        } else if (index2 === this.emptyIndex) {
            this.emptyIndex = index1;
        }
        
        if (countMove) {
            this.moves++;
            this.updateStats();
        }
    }
    
    handleTileClick(index) {
        if (!this.isGameActive) return;
        
        const neighbors = this.getNeighbors(this.emptyIndex);
        
        if (neighbors.includes(index)) {
            this.swapTiles(index, this.emptyIndex);
            this.render();
            
            if (this.checkWin()) {
                this.handleWin();
            }
        }
    }
    
    checkWin() {
        const totalTiles = this.size * this.size;
        
        for (let i = 0; i < totalTiles - 1; i++) {
            if (this.tiles[i] !== i + 1) {
                return false;
            }
        }
        
        return this.tiles[totalTiles - 1] === 0;
    }
    
    handleWin() {
        this.isGameActive = false;
        this.stopTimer();
        
        const minutes = Math.floor(this.seconds / 60);
        const seconds = this.seconds % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.winStats.innerHTML = `
            <strong>Moves:</strong> ${this.moves}<br>
            <strong>Time:</strong> ${timeStr}
        `;
        
        this.winMessage.classList.remove('hidden');
    }
    
    render() {
        this.puzzleElement.innerHTML = '';
        this.puzzleElement.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        
        const tileSize = Math.min(80, 400 / this.size);
        
        this.tiles.forEach((tile, index) => {
            const tileElement = document.createElement('div');
            tileElement.className = tile === 0 ? 'tile empty' : 'tile';
            tileElement.style.width = `${tileSize}px`;
            tileElement.style.height = `${tileSize}px`;
            tileElement.style.fontSize = `${tileSize * 0.4}px`;
            
            if (tile !== 0) {
                tileElement.textContent = tile;
                tileElement.addEventListener('click', () => this.handleTileClick(index));
            }
            
            this.puzzleElement.appendChild(tileElement);
        });
    }
    
    updateStats() {
        this.movesElement.textContent = this.moves;
        const minutes = Math.floor(this.seconds / 60);
        const seconds = this.seconds % 60;
        this.timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.seconds++;
            this.updateStats();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SlidingPuzzle();
});
