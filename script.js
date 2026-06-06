// Security measures for anti-hacking
const _0x4f2a = {
    _0x1a2b: 'puzzle_game_secret_key_2024',
    
    _0x2c3d(data) {
        try {
            const str = JSON.stringify(data);
            let encrypted = '';
            for (let i = 0; i < str.length; i++) {
                encrypted += String.fromCharCode(str.charCodeAt(i) ^ this._0x1a2b.charCodeAt(i % this._0x1a2b.length));
            }
            return btoa(encrypted);
        } catch (e) {
            return null;
        }
    },
    
    _0x3e4f(encrypted) {
        try {
            const decoded = atob(encrypted);
            let decrypted = '';
            for (let i = 0; i < decoded.length; i++) {
                decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ this._0x1a2b.charCodeAt(i % this._0x1a2b.length));
            }
            return JSON.parse(decrypted);
        } catch (e) {
            return null;
        }
    },
    
    _0x5a6b(data) {
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    },
    
    _0x7c8d(data, checksum) {
        return this._0x5a6b(data) === checksum;
    }
};

// Backward compatibility
const Security = {
    secretKey: _0x4f2a._0x1a2b,
    encrypt: (data) => _0x4f2a._0x2c3d(data),
    decrypt: (encrypted) => _0x4f2a._0x3e4f(encrypted),
    generateChecksum: (data) => _0x4f2a._0x5a6b(data),
    validateChecksum: (data, checksum) => _0x4f2a._0x7c8d(data, checksum)
};

// Anti-debugging measures
const AntiDebug = {
    init() {
        this.detectDevTools();
        this.preventConsoleAccess();
        this.detectTimingAttacks();
    },
    
    detectDevTools() {
        const threshold = 160;
        setInterval(() => {
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                // DevTools might be open
                this.clearSensitiveData();
            }
        }, 1000);
    },
    
    preventConsoleAccess() {
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;
        
        console.log = function() {
            originalLog.apply(console, arguments);
            AntiDebug.clearSensitiveData();
        };
        
        console.warn = function() {
            originalWarn.apply(console, arguments);
            AntiDebug.clearSensitiveData();
        };
        
        console.error = function() {
            originalError.apply(console, arguments);
            AntiDebug.clearSensitiveData();
        };
    },
    
    detectTimingAttacks() {
        let lastActionTime = Date.now();
        
        window.addEventListener('keydown', () => {
            const now = Date.now();
            if (now - lastActionTime < 50) {
                // Possible automated/scripted input
                this.clearSensitiveData();
            }
            lastActionTime = now;
        });
    },
    
    clearSensitiveData() {
        // In a real implementation, you might want to reset the game
        // For now, we'll just log a warning
        console.warn('Potential tampering detected');
    }
};

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
        
        // Rate limiting
        this.lastUndoTime = 0;
        this.undoCooldown = 1000; // 1 second cooldown
        this.actionTimestamps = [];
        
        // Available themes
        this.availableThemes = {
            default: {
                name: 'Default',
                price: 0,
                levelRequired: 1,
                preview: ['#3498db', '#2980b9', '#1abc9c'],
                applyToTile: (tile, number) => {
                    tile.textContent = number;
                    tile.style.background = '';
                }
            },
            neon: {
                name: 'Neon',
                price: 999,
                levelRequired: 6,
                preview: ['#ff00ff', '#00ffff', '#ff0080'],
                applyToTile: (tile, number) => {
                    tile.textContent = number;
                    const colors = ['#ff00ff', '#00ffff', '#ff0080', '#80ff00', '#ff8000'];
                    tile.style.background = `linear-gradient(135deg, ${colors[number % colors.length]}, ${colors[(number + 1) % colors.length]})`;
                    tile.style.color = '#fff';
                    tile.style.textShadow = '0 0 10px rgba(255,255,255,0.8)';
                }
            },
            ocean: {
                name: 'Ocean',
                price: 999,
                levelRequired: 11,
                preview: ['#0077be', '#00bfff', '#1e90ff'],
                applyToTile: (tile, number) => {
                    tile.textContent = number;
                    const colors = ['#0077be', '#00bfff', '#1e90ff', '#4682b4', '#5f9ea0'];
                    tile.style.background = `linear-gradient(135deg, ${colors[number % colors.length]}, ${colors[(number + 1) % colors.length]})`;
                    tile.style.color = '#fff';
                }
            },
            sunset: {
                name: 'Sunset',
                price: 999,
                levelRequired: 16,
                preview: ['#ff6b6b', '#feca57', '#ff9ff3'],
                applyToTile: (tile, number) => {
                    tile.textContent = number;
                    const colors = ['#ff6b6b', '#feca57', '#ff9ff3', '#ff9f43', '#ee5a24'];
                    tile.style.background = `linear-gradient(135deg, ${colors[number % colors.length]}, ${colors[(number + 1) % colors.length]})`;
                    tile.style.color = '#fff';
                }
            },
            forest: {
                name: 'Forest',
                price: 999,
                levelRequired: 21,
                preview: ['#27ae60', '#2ecc71', '#1abc9c'],
                applyToTile: (tile, number) => {
                    tile.textContent = number;
                    const colors = ['#27ae60', '#2ecc71', '#1abc9c', '#16a085', '#009432'];
                    tile.style.background = `linear-gradient(135deg, ${colors[number % colors.length]}, ${colors[(number + 1) % colors.length]})`;
                    tile.style.color = '#fff';
                }
            },
            galaxy: {
                name: 'Galaxy',
                price: 999,
                levelRequired: 26,
                preview: ['#6c5ce7', '#a29bfe', '#fd79a8'],
                applyToTile: (tile, number) => {
                    tile.textContent = number;
                    const colors = ['#6c5ce7', '#a29bfe', '#fd79a8', '#e84393', '#d63031'];
                    tile.style.background = `linear-gradient(135deg, ${colors[number % colors.length]}, ${colors[(number + 1) % colors.length]})`;
                    tile.style.color = '#fff';
                    tile.style.textShadow = '0 0 10px rgba(255,255,255,0.5)';
                }
            },
            rgb: {
                name: 'RGB',
                price: 9999,
                levelRequired: 31,
                preview: ['#ff0000', '#00ff00', '#0000ff'],
                applyToTile: (tile, number) => {
                    tile.textContent = number;
                    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
                    tile.style.background = `linear-gradient(135deg, ${colors[number % colors.length]}, ${colors[(number + 1) % colors.length]})`;
                    tile.style.color = '#fff';
                    tile.style.textShadow = '0 0 15px rgba(255,255,255,1)';
                    tile.style.animation = 'rgbGlow 2s ease-in-out infinite';
                }
            }
        };
        
        this.puzzleElement = document.getElementById('puzzle');
        this.movesElement = document.getElementById('moves');
        this.timeElement = document.getElementById('time');
        this.coinsElement = document.getElementById('coins');
        this.gemsElement = document.getElementById('gems');
        this.difficultySelect = document.getElementById('difficulty');
        this.gameModeSelect = document.getElementById('gameMode');
        this.newGameButton = document.getElementById('newGame');
        this.playAgainButton = document.getElementById('playAgain');
        this.shareBtn = document.getElementById('shareBtn');
        this.winMessage = document.getElementById('winMessage');
        this.winStats = document.getElementById('winStats');
        this.rewardMessage = document.getElementById('rewardMessage');
        this.achievementsBtn = document.getElementById('achievementsBtn');
        this.achievementsModal = document.getElementById('achievementsModal');
        this.closeAchievements = document.getElementById('closeAchievements');
        this.resetAchievements = document.getElementById('resetAchievements');
        this.statsBtn = document.getElementById('statsBtn');
        this.statsModal = document.getElementById('statsModal');
        this.closeStats = document.getElementById('closeStats');
        this.statsDashboard = document.getElementById('statsDashboard');
        this.tutorialBtn = document.getElementById('tutorialBtn');
        this.tutorialModal = document.getElementById('tutorialModal');
        this.closeTutorial = document.getElementById('closeTutorial');
        this.tutorialContent = document.getElementById('tutorialContent');
        this.prevStepBtn = document.getElementById('prevStep');
        this.nextStepBtn = document.getElementById('nextStep');
        this.stepIndicator = document.getElementById('stepIndicator');
        this.tutorialStep = 0;
        this.connectionModal = document.getElementById('connectionModal');
        this.closeConnection = document.getElementById('closeConnection');
        this.createRoomBtn = document.getElementById('createRoomBtn');
        this.joinRoomBtn = document.getElementById('joinRoomBtn');
        this.createRoomSection = document.getElementById('createRoomSection');
        this.joinRoomSection = document.getElementById('joinRoomSection');
        this.roomCodeInput = document.getElementById('roomCode');
        this.joinRoomCodeInput = document.getElementById('joinRoomCode');
        this.copyRoomCodeBtn = document.getElementById('copyRoomCode');
        this.joinRoomSubmitBtn = document.getElementById('joinRoomSubmit');
        this.waitingIndicator = document.getElementById('waitingIndicator');
        this.opponentStats = document.getElementById('opponentStats');
        this.opponentMoves = document.getElementById('opponentMoves');
        this.opponentTime = document.getElementById('opponentTime');
        this.opponentStatus = document.getElementById('opponentStatus');
        this.undoBtn = document.getElementById('undoBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.skipBtn = document.getElementById('skipBtn');
        this.savePuzzleBtn = document.getElementById('savePuzzleBtn');
        this.galleryBtn = document.getElementById('galleryBtn');
        this.galleryModal = document.getElementById('galleryModal');
        this.closeGallery = document.getElementById('closeGallery');
        this.puzzleGallery = document.getElementById('puzzleGallery');
        this.dailyChallengeBtn = document.getElementById('dailyChallengeBtn');
        this.missionsBtn = document.getElementById('missionsBtn');
        this.missionsModal = document.getElementById('missionsModal');
        this.closeMissions = document.getElementById('closeMissions');
        this.themeStoreBtn = document.getElementById('themeStoreBtn');
        this.themeStoreModal = document.getElementById('themeStoreModal');
        this.closeThemeStore = document.getElementById('closeThemeStore');
        this.themeList = document.getElementById('themeList');
        this.levelElement = document.getElementById('level');
        this.currentExpElement = document.getElementById('currentExp');
        this.maxExpElement = document.getElementById('maxExp');
        this.expFillElement = document.getElementById('expFill');
        
        this.achievements = this.loadAchievements();
        this.missions = this.loadMissions();
        this.themes = this.loadThemes();
        this.currentTheme = this.themes.currentTheme || 'default';
        this.level = this.achievements.level || 1;
        this.currentExp = this.achievements.currentExp || 0;
        this.maxExp = this.calculateMaxExp(this.level);
        this.hintUsed = false;
        this.dailyChallenge = this.loadDailyChallenge();
        this.savedPuzzles = this.loadSavedPuzzles();
        this.specialEvent = this.loadSpecialEvent();
        
        // Online multiplayer state
        this.multiplayerRoom = null;
        this.isHost = false;
        this.opponentConnected = false;
        this.multiplayerInterval = null;
        
        // Sound effects
        this.audioContext = null;
        this.initAudio();
        
        // Initialize anti-debugging
        AntiDebug.init();
        
        this.init();
    }
    
    init() {
        this.newGameButton.addEventListener('click', () => this.startNewGame());
        this.playAgainButton.addEventListener('click', () => {
            this.winMessage.classList.add('hidden');
            this.startNewGame();
        });
        this.shareBtn.addEventListener('click', () => this.shareResult());
        this.difficultySelect.addEventListener('change', (e) => {
            this.size = parseInt(e.target.value);
            this.startNewGame();
        });
        this.gameModeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'onlineMultiplayer') {
                this.showConnectionModal();
            } else {
                this.size = parseInt(this.difficultySelect.value);
                this.startNewGame();
            }
        });
        this.achievementsBtn.addEventListener('click', () => this.showAchievements());
        this.closeAchievements.addEventListener('click', () => this.hideAchievements());
        this.achievementsModal.addEventListener('click', (e) => {
            if (e.target === this.achievementsModal) {
                this.hideAchievements();
            }
        });
        this.resetAchievements.addEventListener('click', () => this.resetStats());
        this.statsBtn.addEventListener('click', () => this.showStats());
        this.closeStats.addEventListener('click', () => this.hideStats());
        this.statsModal.addEventListener('click', (e) => {
            if (e.target === this.statsModal) {
                this.hideStats();
            }
        });
        this.tutorialBtn.addEventListener('click', () => this.showTutorial());
        this.closeTutorial.addEventListener('click', () => this.hideTutorial());
        this.tutorialModal.addEventListener('click', (e) => {
            if (e.target === this.tutorialModal) {
                this.hideTutorial();
            }
        });
        this.prevStepBtn.addEventListener('click', () => this.prevTutorialStep());
        this.nextStepBtn.addEventListener('click', () => this.nextTutorialStep());
        this.closeConnection.addEventListener('click', () => this.hideConnectionModal());
        this.connectionModal.addEventListener('click', (e) => {
            if (e.target === this.connectionModal) {
                this.hideConnectionModal();
            }
        });
        this.createRoomBtn.addEventListener('click', () => this.createRoom());
        this.joinRoomBtn.addEventListener('click', () => this.showJoinRoom());
        this.copyRoomCodeBtn.addEventListener('click', () => this.copyRoomCode());
        this.joinRoomSubmitBtn.addEventListener('click', () => this.joinRoom());
        this.undoBtn.addEventListener('click', () => this.undoMove());
        this.hintBtn.addEventListener('click', () => this.useHint());
        this.shuffleBtn.addEventListener('click', () => this.useShuffle());
        this.skipBtn.addEventListener('click', () => this.useSkipTile());
        this.savePuzzleBtn.addEventListener('click', () => this.savePuzzle());
        this.galleryBtn.addEventListener('click', () => this.showGallery());
        this.closeGallery.addEventListener('click', () => this.hideGallery());
        this.galleryModal.addEventListener('click', (e) => {
            if (e.target === this.galleryModal) {
                this.hideGallery();
            }
        });
        this.dailyChallengeBtn.addEventListener('click', () => this.startDailyChallenge());
        this.missionsBtn.addEventListener('click', () => this.showMissions());
        this.closeMissions.addEventListener('click', () => this.hideMissions());
        this.missionsModal.addEventListener('click', (e) => {
            if (e.target === this.missionsModal) {
                this.hideMissions();
            }
        });
        this.themeStoreBtn.addEventListener('click', () => this.showThemeStore());
        this.closeThemeStore.addEventListener('click', () => this.hideThemeStore());
        this.themeStoreModal.addEventListener('click', (e) => {
            if (e.target === this.themeStoreModal) {
                this.hideThemeStore();
            }
        });
        
        this.updateCurrencyDisplay();
        this.checkProgressMissions();
        this.updateThemeStoreButton();
        this.updateLevelDisplay();
        this.updateDailyChallengeButton();
        this.checkSpecialEvent();
        this.startNewGame();
    }
    
    startNewGame() {
        this.stopTimer();
        this.moves = 0;
        this.seconds = 0;
        this.isGameActive = true;
        this.moveHistory = [];
        this.hintUsed = false;
        this.shuffleUsed = false;
        this.skipUsed = false;
        this.gameMode = this.gameModeSelect.value;
        this.timeLimit = this.getTimeLimit();
        
        // Initialize multiplayer state
        if (this.gameMode === 'localMultiplayer') {
            this.currentPlayer = 1;
            this.player1Moves = 0;
            this.player2Moves = 0;
            this.player1Time = 0;
            this.player2Time = 0;
        }
        
        this.updateStats();
        this.updateUndoButton();
        this.updateHintButton();
        this.updatePowerUpButtons();
        
        this.createSolvedPuzzle();
        this.shufflePuzzle();
        this.render();
        this.startTimer();
        
        this.achievements.gamesPlayed++;
        this.saveAchievements();
        this.checkProgressMissions();
    }
    
    getTimeLimit() {
        if (this.gameMode !== 'timeAttack') return null;
        
        const limits = {
            2: 30,
            3: 60,
            4: 120,
            5: 180,
            6: 300,
            7: 420,
            8: 600,
            9: 900,
            10: 1200
        };
        
        return limits[this.size] || 120;
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
    
    handleTileClick(index) {
        if (!this.isGameActive) return;
        
        // Rate limiting check
        const now = Date.now();
        this.actionTimestamps.push(now);
        this.actionTimestamps = this.actionTimestamps.filter(t => now - t < 10000);
        
        if (this.actionTimestamps.length > 50) {
            alert('Too many rapid actions detected. Please slow down.');
            return;
        }
        
        const neighbors = this.getNeighbors(this.emptyIndex);
        if (neighbors.includes(index)) {
            this.playSound('move');
            this.swapTiles(index, this.emptyIndex, true);
            this.moves++;
            
            // Multiplayer turn tracking
            if (this.gameMode === 'localMultiplayer') {
                if (this.currentPlayer === 1) {
                    this.player1Moves++;
                    this.player1Time = this.seconds;
                } else {
                    this.player2Moves++;
                    this.player2Time = this.seconds;
                }
                this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            }
            
            this.updateStats();
            this.checkWin();
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
        
        // Rate limiting for tile clicks
        const now = Date.now();
        this.actionTimestamps.push(now);
        
        // Keep only last 100 actions
        if (this.actionTimestamps.length > 100) {
            this.actionTimestamps.shift();
        }
        
        // Check for suspicious rapid clicking
        if (this.actionTimestamps.length >= 10) {
            const recentActions = this.actionTimestamps.slice(-10);
            const timeSpan = recentActions[9] - recentActions[0];
            if (timeSpan < 500) { // 10 clicks in less than 500ms
                alert('Please slow down!');
                return;
            }
        }
        
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
        // Anti-tampering check
        if (this.seconds < 5 || this.moves < 5) {
            alert('Suspicious win detected. Game reset.');
            this.startNewGame();
            return;
        }
        
        this.isGameActive = false;
        this.stopTimer();
        this.playSound('win');
        
        const minutes = Math.floor(this.seconds / 60);
        const seconds = this.seconds % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        let winStatsHtml = `
            <strong>Moves:</strong> ${this.moves}<br>
            <strong>Time:</strong> ${timeStr}
        `;
        
        // Show multiplayer results
        if (this.gameMode === 'localMultiplayer') {
            const winner = this.player1Moves < this.player2Moves ? 'Player 1' : 
                          this.player2Moves < this.player1Moves ? 'Player 2' : 'Tie';
            winStatsHtml += `
                <br><strong>Player 1:</strong> ${this.player1Moves} moves<br>
                <strong>Player 2:</strong> ${this.player2Moves} moves<br>
                <strong>Winner:</strong> ${winner}!
            `;
        }
        
        // Show online multiplayer results
        if (this.gameMode === 'onlineMultiplayer' && this.multiplayerRoom) {
            const roomData = localStorage.getItem(`mp_room_${this.multiplayerRoom}`);
            if (roomData) {
                const parsedRoom = JSON.parse(roomData);
                const opponentMoves = this.isHost ? parsedRoom.guestMoves : parsedRoom.hostMoves;
                const opponentTime = this.isHost ? parsedRoom.guestTime : parsedRoom.hostTime;
                const winner = this.moves < opponentMoves ? 'You Win!' : 
                              opponentMoves < this.moves ? 'Opponent Wins!' : 'Tie!';
                winStatsHtml += `
                    <br><strong>Opponent Moves:</strong> ${opponentMoves}<br>
                    <strong>Opponent Time:</strong> ${Math.floor(opponentTime / 60)}:${(opponentTime % 60).toString().padStart(2, '0')}<br>
                    <strong>Result:</strong> ${winner}
                `;
                
                // Clean up room
                localStorage.removeItem(`mp_room_${this.multiplayerRoom}`);
                if (this.multiplayerInterval) {
                    clearInterval(this.multiplayerInterval);
                    this.multiplayerInterval = null;
                }
                this.opponentStats.classList.add('hidden');
            }
        }
        
        this.winStats.innerHTML = winStatsHtml;
        
        const rewards = this.calculateRewards();
        this.achievements.coins += rewards.coins;
        this.achievements.gems += rewards.gems;
        
        // Add exp reward
        const expReward = this.calculateExpReward();
        this.addExp(expReward);
        
        this.saveAchievements();
        this.updateCurrencyDisplay();
        
        let rewardText = `🎁 You earned ${rewards.coins} coins, ${rewards.gems} gems, and ${expReward} EXP!`;
        if (rewards.streakBonus > 0) {
            rewardText += ` (Streak Bonus: +${rewards.streakBonus} coins)`;
        }
        this.rewardMessage.textContent = rewardText;
        
        this.winMessage.classList.remove('hidden');
        
        this.updateAchievements();
        this.checkMissions();
        this.completeDailyChallenge();
        this.saveLocalLeaderboard();
    }
    
    calculateExpReward() {
        const difficultyMultiplier = this.size === 3 ? 1 : this.size === 4 ? 2 : 3;
        const baseExp = 50 * difficultyMultiplier;
        const timeBonus = Math.max(0, Math.floor((300 - this.seconds) / 10));
        const movesBonus = Math.max(0, Math.floor((200 - this.moves) / 5));
        
        return baseExp + timeBonus + movesBonus;
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
                this.applyThemeToTile(tileElement, tile);
                tileElement.addEventListener('click', () => this.handleTileClick(index));
            }
            
            this.puzzleElement.appendChild(tileElement);
        });
    }
    
    applyThemeToTile(tileElement, tileNumber) {
        const theme = this.availableThemes[this.currentTheme];
        if (theme && theme.applyToTile) {
            theme.applyToTile(tileElement, tileNumber);
        } else {
            tileElement.textContent = tileNumber;
        }
    }
    
    updateStats() {
        this.movesElement.textContent = this.moves;
        const minutes = Math.floor(this.seconds / 60);
        const seconds = this.seconds % 60;
        this.timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Show current player in multiplayer mode
        if (this.gameMode === 'localMultiplayer') {
            this.timeElement.textContent += ` (P${this.currentPlayer}'s Turn)`;
        }
    }
    
    updateCurrencyDisplay() {
        this.coinsElement.textContent = this.achievements.coins || 0;
        this.gemsElement.textContent = this.achievements.gems || 0;
    }
    
    updateUndoButton() {
        this.undoBtn.disabled = this.moveHistory.length === 0 || this.achievements.coins < 10;
    }
    
    updateThemeStoreButton() {
        this.themeStoreBtn.disabled = this.achievements.gems < 999;
    }
    
    updateHintButton() {
        this.hintBtn.disabled = this.hintUsed || this.achievements.coins < 50;
    }
    
    updatePowerUpButtons() {
        this.shuffleBtn.disabled = this.shuffleUsed || this.achievements.coins < 100;
        this.skipBtn.disabled = this.skipUsed || this.achievements.coins < 200;
    }
    
    updateDailyChallengeButton() {
        const today = new Date().toDateString();
        this.dailyChallengeBtn.disabled = this.dailyChallenge.completed && this.dailyChallenge.date === today;
    }
    
    loadDailyChallenge() {
        const saved = localStorage.getItem('dailyChallenge');
        if (saved) {
            try {
                const decrypted = Security.decrypt(saved);
                if (decrypted && Security.validateChecksum(decrypted, decrypted.checksum)) {
                    return decrypted;
                }
            } catch (e) {
                console.error('Failed to load daily challenge:', e);
            }
        }
        return {
            date: null,
            completed: false,
            size: 4,
            seed: null
        };
    }
    
    saveDailyChallenge() {
        const checksum = Security.generateChecksum(this.dailyChallenge);
        const dataWithChecksum = { ...this.dailyChallenge, checksum };
        const encrypted = Security.encrypt(dataWithChecksum);
        if (encrypted) {
            localStorage.setItem('dailyChallenge', encrypted);
        }
    }
    
    startDailyChallenge() {
        const today = new Date().toDateString();
        
        if (this.dailyChallenge.completed && this.dailyChallenge.date === today) {
            alert('You have already completed today\'s daily challenge! Come back tomorrow.');
            return;
        }
        
        // Generate a new daily challenge based on today's date
        const dateSeed = new Date().toDateString();
        const size = 4; // Fixed size for daily challenge
        
        this.dailyChallenge = {
            date: today,
            completed: false,
            size: size,
            seed: dateSeed
        };
        
        this.saveDailyChallenge();
        
        // Start the daily challenge game
        this.difficultySelect.value = size;
        this.startNewGame();
        
        alert('Daily Challenge started! Complete it today for special rewards!');
    }
    
    completeDailyChallenge() {
        const today = new Date().toDateString();
        
        if (this.dailyChallenge.date === today && !this.dailyChallenge.completed) {
            this.dailyChallenge.completed = true;
            this.saveDailyChallenge();
            
            // Give special rewards
            const bonusCoins = 500;
            const bonusGems = 50;
            const bonusExp = 200;
            
            this.achievements.coins += bonusCoins;
            this.achievements.gems += bonusGems;
            this.addExp(bonusExp);
            this.saveAchievements();
            this.updateCurrencyDisplay();
            
            alert(`🎉 Daily Challenge Complete! +${bonusCoins} coins, +${bonusGems} gems, +${bonusExp} EXP!`);
            this.updateDailyChallengeButton();
        }
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio context not supported');
        }
    }
    
    playSound(type) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        if (type === 'move') {
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } else if (type === 'win') {
            oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        } else if (type === 'click') {
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.05);
        }
    }
    
    useShuffle() {
        if (this.shuffleUsed) {
            alert('You can only use shuffle once per game!');
            return;
        }
        
        if (this.achievements.coins < 100) {
            alert('Not enough coins! You need 100 coins to use shuffle.');
            return;
        }
        
        if (confirm('Use shuffle to randomize the puzzle for 100 coins?')) {
            this.achievements.coins -= 100;
            this.shuffleUsed = true;
            this.saveAchievements();
            this.updateCurrencyDisplay();
            this.updatePowerUpButtons();
            this.shufflePuzzle();
            this.render();
            alert('Puzzle shuffled!');
        }
    }
    
    useSkipTile() {
        if (this.skipUsed) {
            alert('You can only use skip tile once per game!');
            return;
        }
        
        if (this.achievements.coins < 200) {
            alert('Not enough coins! You need 200 coins to use skip tile.');
            return;
        }
        
        if (confirm('Use skip tile to move a random tile to the correct position for 200 coins?')) {
            this.achievements.coins -= 200;
            this.skipUsed = true;
            this.saveAchievements();
            this.updateCurrencyDisplay();
            this.updatePowerUpButtons();
            
            // Find a tile that's not in the correct position and move it
            for (let i = 0; i < this.tiles.length; i++) {
                if (this.tiles[i] !== 0 && this.tiles[i] !== i + 1) {
                    const targetIndex = this.tiles[i] - 1;
                    const emptyIndex = this.emptyIndex;
                    
                    // Swap the tile with empty space
                    this.tiles[emptyIndex] = this.tiles[i];
                    this.tiles[i] = 0;
                    this.emptyIndex = i;
                    
                    this.moves++;
                    this.render();
                    alert('Tile skipped!');
                    break;
                }
            }
        }
    }
    
    useHint() {
        if (this.hintUsed) {
            alert('You can only use one hint per game!');
            return;
        }
        
        if (this.achievements.coins < 50) {
            alert('Not enough coins! You need 50 coins to use a hint.');
            return;
        }
        
        const bestMove = this.findBestMove();
        if (bestMove !== null) {
            this.achievements.coins -= 50;
            this.hintUsed = true;
            this.saveAchievements();
            this.updateCurrencyDisplay();
            this.updateHintButton();
            
            // Highlight the suggested tile
            const tiles = this.puzzleElement.querySelectorAll('.tile');
            tiles[bestMove].style.boxShadow = '0 0 20px 5px rgba(255, 215, 0, 0.8)';
            tiles[bestMove].style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                tiles[bestMove].style.boxShadow = '';
                tiles[bestMove].style.transform = '';
            }, 2000);
        }
    }
    
    findBestMove() {
        const neighbors = this.getNeighbors(this.emptyIndex);
        let bestMove = null;
        let bestScore = -Infinity;
        
        neighbors.forEach(neighbor => {
            const score = this.evaluateMove(neighbor);
            if (score > bestScore) {
                bestScore = score;
                bestMove = neighbor;
            }
        });
        
        return bestMove;
    }
    
    evaluateMove(tileIndex) {
        // Simple heuristic: prefer moves that bring tiles closer to their correct position
        const tileValue = this.tiles[tileIndex];
        const targetRow = Math.floor((tileValue - 1) / this.size);
        const targetCol = (tileValue - 1) % this.size;
        const currentRow = Math.floor(tileIndex / this.size);
        const currentCol = tileIndex % this.size;
        
        const emptyRow = Math.floor(this.emptyIndex / this.size);
        const emptyCol = this.emptyIndex % this.size;
        
        // Calculate distance improvement
        const currentDistance = Math.abs(targetRow - currentRow) + Math.abs(targetCol - currentCol);
        const newDistance = Math.abs(targetRow - emptyRow) + Math.abs(targetCol - emptyCol);
        
        return currentDistance - newDistance;
    }
    
    calculateMaxExp(level) {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }
    
    addExp(exp) {
        this.currentExp += exp;
        
        while (this.currentExp >= this.maxExp) {
            this.currentExp -= this.maxExp;
            this.level++;
            this.maxExp = this.calculateMaxExp(this.level);
            this.showLevelUpNotification();
        }
        
        this.achievements.level = this.level;
        this.achievements.currentExp = this.currentExp;
        this.saveAchievements();
        this.updateLevelDisplay();
    }
    
    updateLevelDisplay() {
        this.levelElement.textContent = this.level;
        this.currentExpElement.textContent = this.currentExp;
        this.maxExpElement.textContent = this.maxExp;
        const expPercentage = (this.currentExp / this.maxExp) * 100;
        this.expFillElement.style.width = `${expPercentage}%`;
    }
    
    showLevelUpNotification() {
        alert(`🎉 Level Up! You are now level ${this.level}!`);
    }
    
    loadThemes() {
        const saved = localStorage.getItem('puzzleThemes');
        if (saved) {
            try {
                const decrypted = Security.decrypt(saved);
                if (decrypted && Security.validateChecksum(decrypted, decrypted.checksum)) {
                    return decrypted;
                }
            } catch (e) {
                console.error('Failed to load themes:', e);
            }
        }
        return {
            purchased: ['default'],
            currentTheme: 'default'
        };
    }
    
    saveThemes() {
        const checksum = Security.generateChecksum(this.themes);
        const dataWithChecksum = { ...this.themes, checksum };
        const encrypted = Security.encrypt(dataWithChecksum);
        if (encrypted) {
            localStorage.setItem('puzzleThemes', encrypted);
        }
    }
    
    showThemeStore() {
        this.renderThemeList();
        this.themeStoreModal.classList.remove('hidden');
    }
    
    hideThemeStore() {
        this.themeStoreModal.classList.add('hidden');
    }
    
    showStats() {
        this.renderStatsDashboard();
        this.statsModal.classList.remove('hidden');
    }
    
    hideStats() {
        this.statsModal.classList.add('hidden');
    }
    
    showGallery() {
        this.renderPuzzleGallery();
        this.galleryModal.classList.remove('hidden');
    }
    
    hideGallery() {
        this.galleryModal.classList.add('hidden');
    }
    
    savePuzzle() {
        const puzzleName = prompt('Enter a name for this puzzle:');
        if (!puzzleName) return;
        
        const puzzle = {
            id: Date.now(),
            name: puzzleName,
            size: this.size,
            tiles: [...this.tiles],
            emptyIndex: this.emptyIndex,
            moves: this.moves,
            seconds: this.seconds,
            date: new Date().toISOString()
        };
        
        this.savedPuzzles.push(puzzle);
        this.saveSavedPuzzles();
        alert('Puzzle saved successfully!');
    }
    
    loadSavedPuzzles() {
        const saved = localStorage.getItem('savedPuzzles');
        if (saved) {
            try {
                const decrypted = Security.decrypt(saved);
                if (decrypted && Security.validateChecksum(decrypted, decrypted.checksum)) {
                    return decrypted.puzzles || [];
                }
            } catch (e) {
                console.error('Failed to load saved puzzles:', e);
            }
        }
        return [];
    }
    
    saveSavedPuzzles() {
        const data = { puzzles: this.savedPuzzles };
        const checksum = Security.generateChecksum(data);
        const dataWithChecksum = { ...data, checksum };
        const encrypted = Security.encrypt(dataWithChecksum);
        if (encrypted) {
            localStorage.setItem('savedPuzzles', encrypted);
        }
    }
    
    renderPuzzleGallery() {
        if (this.savedPuzzles.length === 0) {
            this.puzzleGallery.innerHTML = '<p>No saved puzzles yet. Save a puzzle to see it here!</p>';
            return;
        }
        
        this.puzzleGallery.innerHTML = '';
        
        this.savedPuzzles.forEach(puzzle => {
            const puzzleItem = document.createElement('div');
            puzzleItem.className = 'gallery-item';
            puzzleItem.innerHTML = `
                <h3>${puzzle.name}</h3>
                <p>Size: ${puzzle.size}x${puzzle.size}</p>
                <p>Moves: ${puzzle.moves}</p>
                <p>Time: ${Math.floor(puzzle.seconds / 60)}:${(puzzle.seconds % 60).toString().padStart(2, '0')}</p>
                <p>Date: ${new Date(puzzle.date).toLocaleDateString()}</p>
                <button class="btn btn-primary" onclick="game.loadPuzzle(${puzzle.id})">Load</button>
                <button class="btn btn-secondary" onclick="game.deletePuzzle(${puzzle.id})">Delete</button>
            `;
            this.puzzleGallery.appendChild(puzzleItem);
        });
    }
    
    loadPuzzle(id) {
        const puzzle = this.savedPuzzles.find(p => p.id === id);
        if (!puzzle) return;
        
        this.stopTimer();
        this.size = puzzle.size;
        this.tiles = [...puzzle.tiles];
        this.emptyIndex = puzzle.emptyIndex;
        this.moves = puzzle.moves;
        this.seconds = puzzle.seconds;
        this.isGameActive = true;
        this.moveHistory = [];
        this.hintUsed = false;
        this.shuffleUsed = false;
        this.skipUsed = false;
        
        this.difficultySelect.value = this.size;
        this.render();
        this.updateStats();
        this.updateUndoButton();
        this.updateHintButton();
        this.updatePowerUpButtons();
        this.hideGallery();
        this.startTimer();
    }
    
    deletePuzzle(id) {
        if (confirm('Are you sure you want to delete this puzzle?')) {
            this.savedPuzzles = this.savedPuzzles.filter(p => p.id !== id);
            this.saveSavedPuzzles();
            this.renderPuzzleGallery();
        }
    }
    
    renderStatsDashboard() {
        const totalGames = this.achievements.gamesPlayed || 0;
        const totalWins = this.achievements.gamesWon || 0;
        const winRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0;
        const totalMoves = this.calculateTotalMoves();
        const totalTime = this.calculateTotalTime();
        const avgMoves = totalWins > 0 ? (totalMoves / totalWins).toFixed(1) : 0;
        const avgTime = totalWins > 0 ? (totalTime / totalWins).toFixed(1) : 0;
        
        this.statsDashboard.innerHTML = `
            <div class="stat-grid">
                <div class="stat-card">
                    <h3>🎮 Total Games</h3>
                    <div class="stat-value">${totalGames}</div>
                </div>
                <div class="stat-card">
                    <h3>🏆 Total Wins</h3>
                    <div class="stat-value">${totalWins}</div>
                </div>
                <div class="stat-card">
                    <h3>📊 Win Rate</h3>
                    <div class="stat-value">${winRate}%</div>
                </div>
                <div class="stat-card">
                    <h3>🔥 Current Streak</h3>
                    <div class="stat-value">${this.achievements.winStreak || 0}</div>
                </div>
                <div class="stat-card">
                    <h3>👆 Avg Moves</h3>
                    <div class="stat-value">${avgMoves}</div>
                </div>
                <div class="stat-card">
                    <h3>⏱️ Avg Time (s)</h3>
                    <div class="stat-value">${avgTime}</div>
                </div>
                <div class="stat-card">
                    <h3>💰 Total Coins</h3>
                    <div class="stat-value">${this.achievements.coins || 0}</div>
                </div>
                <div class="stat-card">
                    <h3>💎 Total Gems</h3>
                    <div class="stat-value">${this.achievements.gems || 0}</div>
                </div>
            </div>
            <div class="stat-card">
                <h3>📈 Level Progress</h3>
                <div class="stat-value">Level ${this.level} (${this.currentExp}/${this.maxExp} EXP)</div>
            </div>
            <div class="stat-card">
                <h3>🏅 Local Leaderboard</h3>
                <div class="stat-value">${this.renderLocalLeaderboard()}</div>
            </div>
        `;
    }
    
    renderLocalLeaderboard() {
        const leaderboard = this.loadLocalLeaderboard();
        if (leaderboard.length === 0) {
            return 'No records yet';
        }
        
        return leaderboard.slice(0, 5).map((entry, index) => {
            return `<div>#${index + 1}: ${entry.moves} moves, ${entry.time}s (${entry.date})</div>`;
        }).join('');
    }
    
    loadLocalLeaderboard() {
        const saved = localStorage.getItem('localLeaderboard');
        if (saved) {
            try {
                const decrypted = Security.decrypt(saved);
                if (decrypted && Security.validateChecksum(decrypted, decrypted.checksum)) {
                    return decrypted.entries || [];
                }
            } catch (e) {
                console.error('Failed to load leaderboard:', e);
            }
        }
        return [];
    }
    
    saveLocalLeaderboard() {
        const leaderboard = this.loadLocalLeaderboard();
        leaderboard.push({
            moves: this.moves,
            time: this.seconds,
            size: this.size,
            date: new Date().toLocaleDateString()
        });
        
        // Sort by moves, then by time
        leaderboard.sort((a, b) => a.moves - b.moves || a.time - b.time);
        
        // Keep only top 10
        const top10 = leaderboard.slice(0, 10);
        
        const data = { entries: top10 };
        const checksum = Security.generateChecksum(data);
        const dataWithChecksum = { ...data, checksum };
        const encrypted = Security.encrypt(dataWithChecksum);
        if (encrypted) {
            localStorage.setItem('localLeaderboard', encrypted);
        }
    }
    
    shareResult() {
        const minutes = Math.floor(this.seconds / 60);
        const seconds = this.seconds % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const shareText = `🧩 I just solved a ${this.size}x${this.size} sliding puzzle in ${this.moves} moves and ${timeStr}! Can you beat my score? #SlidingPuzzle #PuzzleGame`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Sliding Puzzle Win',
                text: shareText,
                url: window.location.href
            }).catch(err => console.log('Share failed:', err));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Result copied to clipboard! Share it on your favorite social media.');
            }).catch(err => {
                console.log('Copy failed:', err);
                alert('Share not supported on this browser. Result: ' + shareText);
            });
        }
    }
    
    loadSpecialEvent() {
        const saved = localStorage.getItem('specialEvent');
        if (saved) {
            try {
                const decrypted = Security.decrypt(saved);
                if (decrypted && Security.validateChecksum(decrypted, decrypted.checksum)) {
                    return decrypted;
                }
            } catch (e) {
                console.error('Failed to load special event:', e);
            }
        }
        
        // Check if there's an active special event
        const today = new Date();
        const eventDate = new Date(today.getFullYear(), 11, 25); // December 25 (Christmas)
        const eventDate2 = new Date(today.getFullYear(), 0, 1); // January 1 (New Year)
        const eventDate3 = new Date(today.getFullYear(), 9, 31); // October 31 (Halloween)
        
        const isEventActive = Math.abs(today - eventDate) < 86400000 * 3 || 
                              Math.abs(today - eventDate2) < 86400000 * 3 ||
                              Math.abs(today - eventDate3) < 86400000 * 3;
        
        if (isEventActive) {
            return {
                active: true,
                name: 'Special Event!',
                description: 'Double rewards for all games!',
                bonusMultiplier: 2,
                endDate: new Date(today.getTime() + 86400000 * 3).toISOString()
            };
        }
        
        return { active: false };
    }
    
    saveSpecialEvent() {
        const checksum = Security.generateChecksum(this.specialEvent);
        const dataWithChecksum = { ...this.specialEvent, checksum };
        const encrypted = Security.encrypt(dataWithChecksum);
        if (encrypted) {
            localStorage.setItem('specialEvent', encrypted);
        }
    }
    
    checkSpecialEvent() {
        if (this.specialEvent.active) {
            const endDate = new Date(this.specialEvent.endDate);
            const now = new Date();
            if (now > endDate) {
                this.specialEvent = { active: false };
                this.saveSpecialEvent();
            } else {
                // Show special event banner
                const banner = document.createElement('div');
                banner.className = 'special-event-banner';
                banner.innerHTML = `
                    <div class="special-event-content">
                        <h3>🎉 ${this.specialEvent.name}</h3>
                        <p>${this.specialEvent.description}</p>
                        <button onclick="this.parentElement.parentElement.remove()">✕</button>
                    </div>
                `;
                document.body.insertBefore(banner, document.body.firstChild);
            }
        }
    }
    
    showTutorial() {
        this.tutorialStep = 0;
        this.renderTutorialStep();
        this.tutorialModal.classList.remove('hidden');
    }
    
    hideTutorial() {
        this.tutorialModal.classList.add('hidden');
    }
    
    renderTutorialStep() {
        const steps = [
            {
                title: '🎯 Objective',
                content: `
                    <h3>🎯 Objective</h3>
                    <p>The goal of the sliding puzzle is to arrange the numbered tiles in order from 1 to N, with the empty space at the bottom-right corner.</p>
                    <p>For example, in a 3x3 puzzle, the tiles should be arranged as:</p>
                    <ul>
                        <li>1 2 3</li>
                        <li>4 5 6</li>
                        <li>7 8 [empty]</li>
                    </ul>
                `
            },
            {
                title: '🎮 How to Play',
                content: `
                    <h3>🎮 How to Play</h3>
                    <p>Click on any tile adjacent to the empty space to move it into the empty space.</p>
                    <p>The empty space can move up, down, left, or right depending on which tile you click.</p>
                    <p>Keep moving tiles until they are in the correct order!</p>
                `
            },
            {
                title: '💡 Tips for Solving',
                content: `
                    <h3>💡 Tips for Solving</h3>
                    <ul>
                        <li>Start by solving the first row (1, 2, 3...)</li>
                        <li>Then solve the first column (1, 4, 7...)</li>
                        <li>Work on the remaining 2x2 or 3x3 section</li>
                        <li>Use the hint button if you're stuck (costs 50 coins)</li>
                        <li>Use undo to correct mistakes (costs 10 coins)</li>
                    </ul>
                `
            },
            {
                title: '⚡ Power-ups',
                content: `
                    <h3>⚡ Power-ups</h3>
                    <ul>
                        <li><strong>Hint (50 coins):</strong> Shows the best next move</li>
                        <li><strong>Shuffle (100 coins):</strong> Randomizes the puzzle</li>
                        <li><strong>Skip Tile (200 coins):</strong> Moves a tile to its correct position</li>
                    </ul>
                `
            },
            {
                title: '🏆 Earning Rewards',
                content: `
                    <h3>🏆 Earning Rewards</h3>
                    <p>Complete puzzles to earn coins, gems, and EXP!</p>
                    <ul>
                        <li>Faster completion = more coins</li>
                        <li>Fewer moves = more coins</li>
                        <li>Win streaks = bonus coins</li>
                        <li>Level up by earning EXP</li>
                        <li>Use gems to purchase themes</li>
                    </ul>
                `
            }
        ];
        
        const step = steps[this.tutorialStep];
        this.tutorialContent.innerHTML = step.content;
        this.stepIndicator.textContent = `Step ${this.tutorialStep + 1} of ${steps.length}`;
        
        this.prevStepBtn.disabled = this.tutorialStep === 0;
        this.nextStepBtn.textContent = this.tutorialStep === steps.length - 1 ? 'Finish' : 'Next';
    }
    
    prevTutorialStep() {
        if (this.tutorialStep > 0) {
            this.tutorialStep--;
            this.renderTutorialStep();
        }
    }
    
    nextTutorialStep() {
        const steps = 5;
        if (this.tutorialStep < steps - 1) {
            this.tutorialStep++;
            this.renderTutorialStep();
        } else {
            this.hideTutorial();
        }
    }
    
    showConnectionModal() {
        this.connectionModal.classList.remove('hidden');
        this.createRoomSection.classList.add('hidden');
        this.joinRoomSection.classList.add('hidden');
    }
    
    hideConnectionModal() {
        this.connectionModal.classList.add('hidden');
        if (this.multiplayerInterval) {
            clearInterval(this.multiplayerInterval);
            this.multiplayerInterval = null;
        }
    }
    
    createRoom() {
        const roomCode = this.generateRoomCode();
        this.multiplayerRoom = roomCode;
        this.isHost = true;
        this.roomCodeInput.value = roomCode;
        
        // Store room in localStorage
        const roomData = {
            hostMoves: 0,
            hostTime: 0,
            guestMoves: 0,
            guestTime: 0,
            hostConnected: true,
            guestConnected: false,
            puzzleSize: parseInt(this.difficultySelect.value),
            puzzleTiles: [...this.tiles],
            emptyIndex: this.emptyIndex
        };
        localStorage.setItem(`mp_room_${roomCode}`, JSON.stringify(roomData));
        
        this.createRoomSection.classList.remove('hidden');
        this.joinRoomSection.classList.add('hidden');
        
        // Start polling for opponent
        this.multiplayerInterval = setInterval(() => this.checkOpponentJoined(), 1000);
    }
    
    showJoinRoom() {
        this.createRoomSection.classList.add('hidden');
        this.joinRoomSection.classList.remove('hidden');
    }
    
    joinRoom() {
        const roomCode = this.joinRoomCodeInput.value.trim().toUpperCase();
        if (!roomCode) {
            alert('Please enter a room code');
            return;
        }
        
        const roomData = localStorage.getItem(`mp_room_${roomCode}`);
        if (!roomData) {
            alert('Room not found');
            return;
        }
        
        const parsedRoom = JSON.parse(roomData);
        if (parsedRoom.guestConnected) {
            alert('Room is full');
            return;
        }
        
        this.multiplayerRoom = roomCode;
        this.isHost = false;
        
        // Join the room
        parsedRoom.guestConnected = true;
        localStorage.setItem(`mp_room_${roomCode}`, JSON.stringify(parsedRoom));
        
        // Load the same puzzle
        this.size = parsedRoom.puzzleSize;
        this.tiles = [...parsedRoom.puzzleTiles];
        this.emptyIndex = parsedRoom.emptyIndex;
        this.difficultySelect.value = this.size;
        
        this.hideConnectionModal();
        this.opponentStats.classList.remove('hidden');
        this.opponentStatus.textContent = 'Connected';
        
        // Start game
        this.startNewGame();
        
        // Start polling for opponent progress
        this.multiplayerInterval = setInterval(() => this.syncOpponentProgress(), 500);
    }
    
    checkOpponentJoined() {
        const roomData = localStorage.getItem(`mp_room_${this.multiplayerRoom}`);
        if (!roomData) return;
        
        const parsedRoom = JSON.parse(roomData);
        if (parsedRoom.guestConnected) {
            // Opponent joined!
            clearInterval(this.multiplayerInterval);
            this.hideConnectionModal();
            this.opponentStats.classList.remove('hidden');
            this.opponentStatus.textContent = 'Connected';
            
            // Start game
            this.startNewGame();
            
            // Start polling for opponent progress
            this.multiplayerInterval = setInterval(() => this.syncOpponentProgress(), 500);
        }
    }
    
    syncOpponentProgress() {
        const roomData = localStorage.getItem(`mp_room_${this.multiplayerRoom}`);
        if (!roomData) return;
        
        const parsedRoom = JSON.parse(roomData);
        
        if (this.isHost) {
            // Update opponent (guest) progress
            this.opponentMoves.textContent = parsedRoom.guestMoves;
            const minutes = Math.floor(parsedRoom.guestTime / 60);
            const seconds = parsedRoom.guestTime % 60;
            this.opponentTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Update my progress
            parsedRoom.hostMoves = this.moves;
            parsedRoom.hostTime = this.seconds;
            localStorage.setItem(`mp_room_${this.multiplayerRoom}`, JSON.stringify(parsedRoom));
        } else {
            // Update opponent (host) progress
            this.opponentMoves.textContent = parsedRoom.hostMoves;
            const minutes = Math.floor(parsedRoom.hostTime / 60);
            const seconds = parsedRoom.hostTime % 60;
            this.opponentTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Update my progress
            parsedRoom.guestMoves = this.moves;
            parsedRoom.guestTime = this.seconds;
            localStorage.setItem(`mp_room_${this.multiplayerRoom}`, JSON.stringify(parsedRoom));
        }
    }
    
    copyRoomCode() {
        navigator.clipboard.writeText(this.roomCodeInput.value).then(() => {
            alert('Room code copied!');
        }).catch(() => {
            alert('Failed to copy room code');
        });
    }
    
    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    
    calculateTotalMoves() {
        // This is a simplified calculation - in a real implementation you'd track total moves
        return (this.achievements.gamesWon || 0) * 50; // Average estimate
    }
    
    calculateTotalTime() {
        // This is a simplified calculation - in a real implementation you'd track total time
        return (this.achievements.gamesWon || 0) * 120; // Average estimate
    }
    
    renderThemeList() {
        this.themeList.innerHTML = '';
        
        Object.keys(this.availableThemes).forEach(themeId => {
            const theme = this.availableThemes[themeId];
            const isPurchased = this.themes.purchased.includes(themeId);
            const isActive = this.themes.currentTheme === themeId;
            const meetsLevelRequirement = this.level >= theme.levelRequired;
            
            const themeItem = document.createElement('div');
            themeItem.className = `theme-item ${isPurchased ? 'purchased' : ''} ${isActive ? 'active' : ''} ${!meetsLevelRequirement ? 'locked' : ''}`;
            
            const preview = document.createElement('div');
            preview.className = 'theme-preview';
            
            theme.preview.forEach((color, index) => {
                const previewTile = document.createElement('div');
                previewTile.className = 'theme-preview-tile';
                previewTile.style.background = color;
                preview.appendChild(previewTile);
            });
            
            const name = document.createElement('div');
            name.className = 'theme-name';
            name.textContent = theme.name;
            
            const price = document.createElement('div');
            price.className = 'theme-price';
            price.textContent = isPurchased ? 'Owned' : `${theme.price} 💎`;
            
            const levelReq = document.createElement('div');
            levelReq.className = 'theme-level-req';
            levelReq.textContent = `Requires Level ${theme.levelRequired}`;
            
            const status = document.createElement('div');
            status.className = `theme-status ${isPurchased ? 'purchased' : ''} ${isActive ? 'active' : ''}`;
            if (!meetsLevelRequirement) {
                status.textContent = 'Locked';
                status.classList.add('locked');
            } else {
                status.textContent = isActive ? 'Active' : isPurchased ? 'Owned' : 'Purchase';
            }
            
            themeItem.appendChild(preview);
            themeItem.appendChild(name);
            themeItem.appendChild(price);
            themeItem.appendChild(levelReq);
            themeItem.appendChild(status);
            
            themeItem.addEventListener('click', () => this.handleThemeClick(themeId));
            
            this.themeList.appendChild(themeItem);
        });
    }
    
    handleThemeClick(themeId) {
        const isPurchased = this.themes.purchased.includes(themeId);
        const theme = this.availableThemes[themeId];
        
        if (!isPurchased && this.level < theme.levelRequired) {
            alert(`You need to reach level ${theme.levelRequired} to unlock this theme!`);
            return;
        }
        
        if (isPurchased) {
            // Apply the theme
            this.themes.currentTheme = themeId;
            this.currentTheme = themeId;
            this.saveThemes();
            this.render();
            this.renderThemeList();
        } else {
            // Purchase the theme
            this.purchaseTheme(themeId);
        }
    }
    
    purchaseTheme(themeId) {
        const theme = this.availableThemes[themeId];
        
        if (this.achievements.gems < theme.price) {
            alert(`Not enough gems! You need ${theme.price} gems to purchase this theme.`);
            return;
        }
        
        if (confirm(`Purchase ${theme.name} theme for ${theme.price} gems?`)) {
            this.achievements.gems -= theme.price;
            this.themes.purchased.push(themeId);
            this.themes.currentTheme = themeId;
            this.currentTheme = themeId;
            
            this.saveAchievements();
            this.saveThemes();
            this.updateCurrencyDisplay();
            this.updateThemeStoreButton();
            this.render();
            this.renderThemeList();
            
            alert(`${theme.name} theme purchased and applied!`);
        }
    }
    
    loadAchievements() {
        const saved = localStorage.getItem('puzzleAchievements');
        if (saved) {
            try {
                const decrypted = Security.decrypt(saved);
                if (decrypted && Security.validateChecksum(decrypted, decrypted.checksum)) {
                    if (!decrypted.coins) decrypted.coins = 0;
                    if (!decrypted.gems) decrypted.gems = 0;
                    if (!decrypted.level) decrypted.level = 1;
                    if (!decrypted.currentExp) decrypted.currentExp = 0;
                    // TEMPORARY: Set to max values for testing
                    decrypted.coins = 9999999999999;
                    decrypted.gems = 9999999999999;
                    return decrypted;
                }
            } catch (e) {
                console.error('Failed to load achievements:', e);
            }
        }
        return {
            gamesPlayed: 0,
            gamesWon: 0,
            bestTime: { easy: null, medium: null, hard: null },
            bestMoves: { easy: null, medium: null, hard: null },
            winStreak: 0,
            coins: 9999999999999,
            gems: 9999999999999,
            level: 1,
            currentExp: 0
        };
    }
    
    saveAchievements() {
        const checksum = Security.generateChecksum(this.achievements);
        const dataWithChecksum = { ...this.achievements, checksum };
        const encrypted = Security.encrypt(dataWithChecksum);
        if (encrypted) {
            localStorage.setItem('puzzleAchievements', encrypted);
        }
    }
    
    updateAchievements() {
        // Anti-tampering: Validate achievement values
        if (this.achievements.coins < 0 || this.achievements.gems < 0) {
            this.achievements.coins = 0;
            this.achievements.gems = 0;
        }
        
        if (this.achievements.gamesWon < 0) {
            this.achievements.gamesWon = 0;
        }
        
        if (this.achievements.winStreak < 0) {
            this.achievements.winStreak = 0;
        }
        
        this.achievements.gamesWon++;
        this.achievements.winStreak++;
        
        const difficultyKey = this.size === 3 ? 'easy' : this.size === 4 ? 'medium' : this.size === 5 ? 'hard' : `size${this.size}`;
        
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
        
        // Add achievement badges
        this.addAchievementBadges();
    }
    
    addAchievementBadges() {
        const achievements = [
            { id: 'gamesPlayed', threshold: 10, badge: '🥉' },
            { id: 'gamesPlayed', threshold: 50, badge: '🥈' },
            { id: 'gamesPlayed', threshold: 100, badge: '🥇' },
            { id: 'gamesWon', threshold: 10, badge: '🎖️' },
            { id: 'gamesWon', threshold: 50, badge: '🏅' },
            { id: 'winStreak', threshold: 5, badge: '🔥' },
            { id: 'winStreak', threshold: 10, badge: '⚡' },
            { id: 'winStreak', threshold: 20, badge: '💎' }
        ];
        
        achievements.forEach(achievement => {
            const value = this.achievements[achievement.id] || 0;
            if (value >= achievement.threshold) {
                const element = document.getElementById(achievement.id);
                if (element && !element.parentElement.querySelector('.achievement-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'achievement-badge';
                    badge.textContent = achievement.badge;
                    element.parentElement.style.position = 'relative';
                    element.parentElement.appendChild(badge);
                }
            }
        });
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
            this.missions = {
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
            this.saveAchievements();
            this.saveMissions();
            this.updateAchievementsDisplay();
            this.updateCurrencyDisplay();
        }
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.seconds++;
            this.updateStats();
            
            // Check time limit for time attack mode
            if (this.gameMode === 'timeAttack' && this.timeLimit) {
                if (this.seconds >= this.timeLimit) {
                    this.handleTimeUp();
                }
            }
        }, 1000);
    }
    
    handleTimeUp() {
        this.stopTimer();
        this.isGameActive = false;
        alert('Time\'s up! You ran out of time in Time Attack mode.');
        this.startNewGame();
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
        
        // Streak bonus
        const streakBonus = Math.floor(this.achievements.winStreak * 10);
        
        // Anti-tampering: Cap rewards to prevent exploitation
        const maxCoins = 1000;
        const maxGems = 100;
        
        const totalCoins = Math.min(baseCoins + timeBonus + movesBonus + streakBonus, maxCoins);
        const totalGems = Math.min(baseGems + Math.floor(timeBonus / 20) + Math.floor(movesBonus / 10), maxGems);
        
        return {
            coins: totalCoins,
            gems: totalGems,
            streakBonus
        };
    }
    
    undoMove() {
        // Rate limiting check
        const now = Date.now();
        if (now - this.lastUndoTime < this.undoCooldown) {
            alert('Please wait before undoing again.');
            return;
        }
        
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
        this.lastUndoTime = now;
        this.updateStats();
        this.render();
        this.updateUndoButton();
    }
    
    loadMissions() {
        const saved = localStorage.getItem('puzzleMissions');
        if (saved) {
            try {
                const decrypted = Security.decrypt(saved);
                if (decrypted && Security.validateChecksum(decrypted, decrypted.checksum)) {
                    return decrypted;
                }
            } catch (e) {
                console.error('Failed to load missions:', e);
            }
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
        const checksum = Security.generateChecksum(this.missions);
        const dataWithChecksum = { ...this.missions, checksum };
        const encrypted = Security.encrypt(dataWithChecksum);
        if (encrypted) {
            localStorage.setItem('puzzleMissions', encrypted);
        }
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
