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
                preview: ['#3498db', '#2980b9', '#1abc9c'],
                applyToTile: (tile, number) => {
                    tile.textContent = number;
                    tile.style.background = '';
                }
            },
            neon: {
                name: 'Neon',
                price: 1000,
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
                price: 1000,
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
                price: 1000,
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
                price: 1000,
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
                price: 1000,
                preview: ['#6c5ce7', '#a29bfe', '#fd79a8'],
                applyToTile: (tile, number) => {
                    tile.textContent = number;
                    const colors = ['#6c5ce7', '#a29bfe', '#fd79a8', '#e84393', '#d63031'];
                    tile.style.background = `linear-gradient(135deg, ${colors[number % colors.length]}, ${colors[(number + 1) % colors.length]})`;
                    tile.style.color = '#fff';
                    tile.style.textShadow = '0 0 10px rgba(255,255,255,0.5)';
                }
            }
        };
        
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
        this.themeStoreBtn = document.getElementById('themeStoreBtn');
        this.themeStoreModal = document.getElementById('themeStoreModal');
        this.closeThemeStore = document.getElementById('closeThemeStore');
        this.themeList = document.getElementById('themeList');
        
        this.achievements = this.loadAchievements();
        this.missions = this.loadMissions();
        this.themes = this.loadThemes();
        this.currentTheme = this.themes.currentTheme || 'default';
        
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
        this.startNewGame();
    }
    
    startNewGame() {
        this.stopTimer();
        this.moves = 0;
        this.seconds = 0;
        this.isGameActive = true;
        this.moveHistory = [];
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
    }
    
    updateCurrencyDisplay() {
        this.coinsElement.textContent = this.achievements.coins || 0;
        this.gemsElement.textContent = this.achievements.gems || 0;
    }
    
    updateUndoButton() {
        this.undoBtn.disabled = this.moveHistory.length === 0 || this.achievements.coins < 10;
    }
    
    updateThemeStoreButton() {
        this.themeStoreBtn.disabled = this.achievements.gems < 1000;
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
    
    renderThemeList() {
        this.themeList.innerHTML = '';
        
        Object.keys(this.availableThemes).forEach(themeId => {
            const theme = this.availableThemes[themeId];
            const isPurchased = this.themes.purchased.includes(themeId);
            const isActive = this.themes.currentTheme === themeId;
            
            const themeItem = document.createElement('div');
            themeItem.className = `theme-item ${isPurchased ? 'purchased' : ''} ${isActive ? 'active' : ''}`;
            
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
            
            const status = document.createElement('div');
            status.className = `theme-status ${isPurchased ? 'purchased' : ''} ${isActive ? 'active' : ''}`;
            status.textContent = isActive ? 'Active' : isPurchased ? 'Owned' : 'Purchase';
            
            themeItem.appendChild(preview);
            themeItem.appendChild(name);
            themeItem.appendChild(price);
            themeItem.appendChild(status);
            
            themeItem.addEventListener('click', () => this.handleThemeClick(themeId));
            
            this.themeList.appendChild(themeItem);
        });
    }
    
    handleThemeClick(themeId) {
        const isPurchased = this.themes.purchased.includes(themeId);
        
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
            coins: 0,
            gems: 0
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
        
        // Anti-tampering: Cap rewards to prevent exploitation
        const maxCoins = 1000;
        const maxGems = 100;
        
        const totalCoins = Math.min(baseCoins + timeBonus + movesBonus, maxCoins);
        const totalGems = Math.min(baseGems + Math.floor(timeBonus / 20) + Math.floor(movesBonus / 10), maxGems);
        
        return {
            coins: totalCoins,
            gems: totalGems
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
