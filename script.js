class SlidingPuzzle {
    constructor() {
        this.size = 4;
        this.tiles = [];
        this.emptyIndex = 0;
        this.moves = 0;
        this.seconds = 0;
        this.timerInterval = null;
        this.isGameActive = false;
        this.moveHistory = [];
        
        this.puzzleElement = document.getElementById('puzzle');
        this.movesElement = document.getElementById('moves');
        this.timeElement = document.getElementById('time');
        this.coinsElement = document.getElementById('coins');
        this.gemsElement = document.getElementById('gems');
        this.difficultySelect = document.getElementById('difficulty');
        this.newGameButton = document.getElementById('newGame');
        this.playAgainButton = document.getElementById('playAgain');
        this.winMessage = document.getElementById('winMessage');
        this.winStats = document.getElementById('winStats');
        this.rewardMessage = document.getElementById('rewardMessage');
        this.achievementsBtn = document.getElementById('achievementsBtn');
        this.achievementsModal = document.getElementById('achievementsModal');
        this.closeAchievements = document.getElementById('closeAchievements');
        this.resetAchievements = document.getElementById('resetAchievements');
        this.undoBtn = document.getElementById('undoBtn');
        this.missionsBtn = document.getElementById('missionsBtn');
        this.missionsModal = document.getElementById('missionsModal');
        this.closeMissions = document.getElementById('closeMissions');
        this.photoPuzzleBtn = document.getElementById('photoPuzzleBtn');
        this.photoUploadSection = document.getElementById('photoUploadSection');
        this.photoInput = document.getElementById('photoInput');
        this.startPhotoPuzzle = document.getElementById('startPhotoPuzzle');
        this.cancelPhotoPuzzle = document.getElementById('cancelPhotoPuzzle');
        
        console.log('Photo Puzzle Button:', this.photoPuzzleBtn);
        console.log('Photo Upload Section:', this.photoUploadSection);
        
        this.achievements = this.loadAchievements();
        this.missions = this.loadMissions();
        this.photoMode = false;
        this.photoData = null;
        
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
        this.achievementsBtn.addEventListener('click', () => this.showAchievements());
        this.closeAchievements.addEventListener('click', () => this.hideAchievements());
        this.achievementsModal.addEventListener('click', (e) => {
            if (e.target === this.achievementsModal) {
                this.hideAchievements();
            }
        });
        this.resetAchievements.addEventListener('click', () => this.resetStats());
        this.undoBtn.addEventListener('click', () => this.undoMove());
        this.missionsBtn.addEventListener('click', () => this.showMissions());
        this.closeMissions.addEventListener('click', () => this.hideMissions());
        this.missionsModal.addEventListener('click', (e) => {
            if (e.target === this.missionsModal) {
                this.hideMissions();
            }
        });
        this.photoPuzzleBtn.addEventListener('click', () => this.showPhotoUpload());
        this.cancelPhotoPuzzle.addEventListener('click', () => this.hidePhotoUpload());
        this.startPhotoPuzzle.addEventListener('click', () => this.startPhotoPuzzleGame());
        this.photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
        
        this.updateCurrencyDisplay();
        this.checkProgressMissions();
        this.updatePhotoPuzzleButton();
        this.startNewGame();
    }
    
    startNewGame() {
        this.stopTimer();
        this.moves = 0;
        this.seconds = 0;
        this.isGameActive = true;
        this.moveHistory = [];
        this.photoMode = false;
        this.updateStats();
        this.updateUndoButton();
        
        this.createSolvedPuzzle();
        this.shufflePuzzle();
        this.render();
        this.startTimer();
        
        this.achievements.gamesPlayed++;
        this.saveAchievements();
        this.checkProgressMissions();
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
    
    swapTiles(index1, index2, countMove = true, recordHistory = true) {
        if (recordHistory && countMove) {
            this.moveHistory.push({
                index1,
                index2,
                emptyIndex: this.emptyIndex
            });
        }
        
        [this.tiles[index1], this.tiles[index2]] = [this.tiles[index2], this.tiles[index1]];
        
        if (index1 === this.emptyIndex) {
            this.emptyIndex = index2;
        } else if (index2 === this.emptyIndex) {
            this.emptyIndex = index1;
        }
        
        if (countMove) {
            this.moves++;
            this.updateStats();
            this.updateUndoButton();
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
        
        const rewards = this.calculateRewards();
        this.achievements.coins += rewards.coins;
        this.achievements.gems += rewards.gems;
        this.saveAchievements();
        this.updateCurrencyDisplay();
        
        this.rewardMessage.textContent = `🎁 You earned ${rewards.coins} coins and ${rewards.gems} gems!`;
        
        this.winMessage.classList.remove('hidden');
        
        this.updateAchievements();
        this.checkMissions();
        this.updatePhotoPuzzleButton();
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
                if (this.photoMode && this.photoData) {
                    tileElement.classList.add('photo-tile');
                    tileElement.style.backgroundImage = `url(${this.photoData})`;
                    
                    const row = Math.floor((tile - 1) / this.size);
                    const col = (tile - 1) % this.size;
                    const percentage = 100 / (this.size - 1);
                    
                    tileElement.style.backgroundPosition = `${col * percentage}% ${row * percentage}%`;
                    tileElement.style.backgroundSize = `${this.size * 100}%`;
                } else {
                    tileElement.textContent = tile;
                }
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
    
    updateCurrencyDisplay() {
        this.coinsElement.textContent = this.achievements.coins || 0;
        this.gemsElement.textContent = this.achievements.gems || 0;
    }
    
    updateUndoButton() {
        this.undoBtn.disabled = this.moveHistory.length === 0 || this.achievements.coins < 10;
    }
    
    updatePhotoPuzzleButton() {
        this.photoPuzzleBtn.disabled = this.achievements.gems < 50;
    }
    
    showPhotoUpload() {
        if (this.achievements.gems < 50) {
            alert('Not enough gems! You need 50 gems to use Photo Puzzle.');
            return;
        }
        this.photoUploadSection.classList.remove('hidden');
        this.photoInput.value = '';
    }
    
    hidePhotoUpload() {
        this.photoUploadSection.classList.add('hidden');
        this.photoInput.value = '';
        this.photoData = null;
    }
    
    handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            this.photoData = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    startPhotoPuzzleGame() {
        if (!this.photoData) {
            alert('Please upload a photo first!');
            return;
        }
        
        if (this.achievements.gems < 50) {
            alert('Not enough gems! You need 50 gems to use Photo Puzzle.');
            return;
        }
        
        this.achievements.gems -= 50;
        this.saveAchievements();
        this.updateCurrencyDisplay();
        this.updatePhotoPuzzleButton();
        
        this.photoMode = true;
        this.hidePhotoUpload();
        this.startNewGame();
    }
    
    loadAchievements() {
        const saved = localStorage.getItem('puzzleAchievements');
        if (saved) {
            const data = JSON.parse(saved);
            if (!data.coins) data.coins = 0;
            if (!data.gems) data.gems = 0;
            // TEMPORARY: Set to max values for testing
            data.coins = 999999999999999;
            data.gems = 999999999999999;
            return data;
        }
        return {
            gamesPlayed: 0,
            gamesWon: 0,
            bestTime: { easy: null, medium: null, hard: null },
            bestMoves: { easy: null, medium: null, hard: null },
            winStreak: 0,
            coins: 999999999999999,
            gems: 999999999999999
        };
    }
    
    saveAchievements() {
        localStorage.setItem('puzzleAchievements', JSON.stringify(this.achievements));
    }
    
    updateAchievements() {
        this.achievements.gamesWon++;
        this.achievements.winStreak++;
        
        const difficultyKey = this.size === 3 ? 'easy' : this.size === 4 ? 'medium' : 'hard';
        
        if (!this.achievements.bestTime[difficultyKey] || this.seconds < this.achievements.bestTime[difficultyKey]) {
            this.achievements.bestTime[difficultyKey] = this.seconds;
        }
        
        if (!this.achievements.bestMoves[difficultyKey] || this.moves < this.achievements.bestMoves[difficultyKey]) {
            this.achievements.bestMoves[difficultyKey] = this.moves;
        }
        
        this.saveAchievements();
    }
    
    showAchievements() {
        this.updateAchievementsDisplay();
        this.achievementsModal.classList.remove('hidden');
    }
    
    hideAchievements() {
        this.achievementsModal.classList.add('hidden');
    }
    
    updateAchievementsDisplay() {
        document.getElementById('gamesPlayed').textContent = this.achievements.gamesPlayed;
        document.getElementById('gamesWon').textContent = this.achievements.gamesWon;
        document.getElementById('winStreak').textContent = this.achievements.winStreak;
        document.getElementById('totalCoins').textContent = this.achievements.coins || 0;
        document.getElementById('totalGems').textContent = this.achievements.gems || 0;
        
        const formatTime = (seconds) => {
            if (!seconds) return '--:--';
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };
        
        document.getElementById('bestTimeEasy').textContent = formatTime(this.achievements.bestTime.easy);
        document.getElementById('bestTimeMedium').textContent = formatTime(this.achievements.bestTime.medium);
        document.getElementById('bestTimeHard').textContent = formatTime(this.achievements.bestTime.hard);
        
        document.getElementById('bestMovesEasy').textContent = this.achievements.bestMoves.easy ?? '--';
        document.getElementById('bestMovesMedium').textContent = this.achievements.bestMoves.medium ?? '--';
        document.getElementById('bestMovesHard').textContent = this.achievements.bestMoves.hard ?? '--';
    }
    
    resetStats() {
        if (confirm('Are you sure you want to reset all your achievements?')) {
            this.achievements = {
                gamesPlayed: 0,
                gamesWon: 0,
                bestTime: { easy: null, medium: null, hard: null },
                bestMoves: { easy: null, medium: null, hard: null },
                winStreak: 0,
                coins: 0,
                gems: 0
            };
            this.saveAchievements();
            this.updateAchievementsDisplay();
            this.updateCurrencyDisplay();
        }
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
    
    calculateRewards() {
        const difficultyMultiplier = this.size === 3 ? 1 : this.size === 4 ? 2 : 3;
        const timeBonus = Math.max(0, Math.floor((300 - this.seconds) / 10));
        const movesBonus = Math.max(0, Math.floor((200 - this.moves) / 5));
        
        const baseCoins = 20 * difficultyMultiplier;
        const baseGems = 2 * difficultyMultiplier;
        
        return {
            coins: baseCoins + timeBonus + movesBonus,
            gems: baseGems + Math.floor(timeBonus / 20) + Math.floor(movesBonus / 10)
        };
    }
    
    undoMove() {
        if (this.moveHistory.length === 0) return;
        if (this.achievements.coins < 10) {
            alert('Not enough coins! You need 10 coins to undo.');
            return;
        }
        
        const lastMove = this.moveHistory.pop();
        this.achievements.coins -= 10;
        this.saveAchievements();
        this.updateCurrencyDisplay();
        
        [this.tiles[lastMove.index1], this.tiles[lastMove.index2]] = [this.tiles[lastMove.index2], this.tiles[lastMove.index1]];
        this.emptyIndex = lastMove.emptyIndex;
        
        this.moves--;
        this.updateStats();
        this.render();
        this.updateUndoButton();
    }
    
    loadMissions() {
        const saved = localStorage.getItem('puzzleMissions');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            mission1: false,
            mission2: false,
            mission3: false,
            mission4: false,
            mission5: false,
            mission6: false,
            mission7: false,
            mission8: false,
            mission9: false,
            mission10: false,
            mission11: false,
            mission12: false,
            mission13: false,
            mission14: false,
            mission15: false,
            mission16: false,
            mission17: false,
            mission18: false,
            mission19: false,
            mission20: false,
            difficultiesCompleted: []
        };
    }
    
    saveMissions() {
        localStorage.setItem('puzzleMissions', JSON.stringify(this.missions));
    }
    
    checkMissions() {
        let missionCompleted = false;
        const difficultyKey = this.size === 3 ? 'easy' : this.size === 4 ? 'medium' : 'hard';
        
        // Track difficulties completed
        if (!this.missions.difficultiesCompleted) {
            this.missions.difficultiesCompleted = [];
        }
        if (!this.missions.difficultiesCompleted.includes(difficultyKey)) {
            this.missions.difficultiesCompleted.push(difficultyKey);
        }
        
        // Time-based missions (only check on win)
        if (!this.missions.mission1 && this.size === 3 && this.seconds < 120) {
            this.missions.mission1 = true;
            this.achievements.coins += 50;
            this.achievements.gems += 5;
            missionCompleted = true;
        }
        
        if (!this.missions.mission2 && this.size === 4 && this.seconds < 180) {
            this.missions.mission2 = true;
            this.achievements.coins += 100;
            this.achievements.gems += 10;
            missionCompleted = true;
        }
        
        if (!this.missions.mission3 && this.size === 5 && this.seconds < 300) {
            this.missions.mission3 = true;
            this.achievements.coins += 200;
            this.achievements.gems += 20;
            missionCompleted = true;
        }
        
        if (!this.missions.mission19 && this.size === 3 && this.seconds < 60) {
            this.missions.mission19 = true;
            this.achievements.coins += 100;
            this.achievements.gems += 10;
            missionCompleted = true;
        }
        
        // Move-based missions (only check on win)
        if (!this.missions.mission4 && this.size === 3 && this.moves < 50) {
            this.missions.mission4 = true;
            this.achievements.coins += 75;
            this.achievements.gems += 8;
            missionCompleted = true;
        }
        
        if (!this.missions.mission5 && this.size === 4 && this.moves < 100) {
            this.missions.mission5 = true;
            this.achievements.coins += 150;
            this.achievements.gems += 15;
            missionCompleted = true;
        }
        
        if (!this.missions.mission20 && this.size === 3 && this.moves < 30) {
            this.missions.mission20 = true;
            this.achievements.coins += 150;
            this.achievements.gems += 15;
            missionCompleted = true;
        }
        
        // Win streak missions
        if (!this.missions.mission6 && this.achievements.winStreak >= 3) {
            this.missions.mission6 = true;
            this.achievements.coins += 100;
            this.achievements.gems += 10;
            missionCompleted = true;
        }
        
        if (!this.missions.mission7 && this.achievements.winStreak >= 5) {
            this.missions.mission7 = true;
            this.achievements.coins += 200;
            this.achievements.gems += 20;
            missionCompleted = true;
        }
        
        // Games won missions
        if (!this.missions.mission15 && this.achievements.gamesWon >= 5) {
            this.missions.mission15 = true;
            this.achievements.coins += 75;
            this.achievements.gems += 8;
            missionCompleted = true;
        }
        
        if (!this.missions.mission16 && this.achievements.gamesWon >= 15) {
            this.missions.mission16 = true;
            this.achievements.coins += 150;
            this.achievements.gems += 15;
            missionCompleted = true;
        }
        
        if (!this.missions.mission17 && this.achievements.gamesWon >= 30) {
            this.missions.mission17 = true;
            this.achievements.coins += 300;
            this.achievements.gems += 30;
            missionCompleted = true;
        }
        
        // All-rounder mission
        if (!this.missions.mission18 && this.missions.difficultiesCompleted.length >= 3) {
            this.missions.mission18 = true;
            this.achievements.coins += 150;
            this.achievements.gems += 15;
            missionCompleted = true;
        }
        
        this.saveMissions();
        
        if (missionCompleted) {
            this.saveAchievements();
            this.updateCurrencyDisplay();
        }
    }
    
    checkProgressMissions() {
        let missionCompleted = false;
        
        // Games played missions
        if (!this.missions.mission8 && this.achievements.gamesPlayed >= 10) {
            this.missions.mission8 = true;
            this.achievements.coins += 50;
            this.achievements.gems += 5;
            missionCompleted = true;
        }
        
        if (!this.missions.mission9 && this.achievements.gamesPlayed >= 25) {
            this.missions.mission9 = true;
            this.achievements.coins += 100;
            this.achievements.gems += 10;
            missionCompleted = true;
        }
        
        if (!this.missions.mission10 && this.achievements.gamesPlayed >= 50) {
            this.missions.mission10 = true;
            this.achievements.coins += 200;
            this.achievements.gems += 20;
            missionCompleted = true;
        }
        
        // Coins earned missions
        if (!this.missions.mission11 && this.achievements.coins >= 500) {
            this.missions.mission11 = true;
            this.achievements.coins += 100;
            this.achievements.gems += 10;
            missionCompleted = true;
        }
        
        if (!this.missions.mission12 && this.achievements.coins >= 1000) {
            this.missions.mission12 = true;
            this.achievements.coins += 200;
            this.achievements.gems += 20;
            missionCompleted = true;
        }
        
        // Gems earned missions
        if (!this.missions.mission13 && this.achievements.gems >= 50) {
            this.missions.mission13 = true;
            this.achievements.coins += 100;
            this.achievements.gems += 10;
            missionCompleted = true;
        }
        
        if (!this.missions.mission14 && this.achievements.gems >= 100) {
            this.missions.mission14 = true;
            this.achievements.coins += 200;
            this.achievements.gems += 20;
            missionCompleted = true;
        }
        
        this.saveMissions();
        
        if (missionCompleted) {
            this.saveAchievements();
            this.updateCurrencyDisplay();
        }
    }
    
    showMissions() {
        this.checkProgressMissions();
        this.updateMissionsDisplay();
        this.missionsModal.classList.remove('hidden');
    }
    
    hideMissions() {
        this.missionsModal.classList.add('hidden');
    }
    
    updateMissionsDisplay() {
        const missions = [
            { id: 'mission1', key: 'mission1' },
            { id: 'mission2', key: 'mission2' },
            { id: 'mission3', key: 'mission3' },
            { id: 'mission4', key: 'mission4' },
            { id: 'mission5', key: 'mission5' },
            { id: 'mission6', key: 'mission6' },
            { id: 'mission7', key: 'mission7' },
            { id: 'mission8', key: 'mission8' },
            { id: 'mission9', key: 'mission9' },
            { id: 'mission10', key: 'mission10' },
            { id: 'mission11', key: 'mission11' },
            { id: 'mission12', key: 'mission12' },
            { id: 'mission13', key: 'mission13' },
            { id: 'mission14', key: 'mission14' },
            { id: 'mission15', key: 'mission15' },
            { id: 'mission16', key: 'mission16' },
            { id: 'mission17', key: 'mission17' },
            { id: 'mission18', key: 'mission18' },
            { id: 'mission19', key: 'mission19' },
            { id: 'mission20', key: 'mission20' }
        ];
        
        missions.forEach(mission => {
            const element = document.getElementById(mission.id);
            if (!element) return;
            const statusElement = element.querySelector('.mission-status');
            
            if (this.missions[mission.key]) {
                element.classList.add('completed');
                statusElement.textContent = 'Completed ✓';
            } else {
                element.classList.remove('completed');
                statusElement.textContent = 'Not Started';
            }
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SlidingPuzzle();
});
