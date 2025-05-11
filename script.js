let selectedDifficulty = null;
const startButton = document.getElementById('start-button');

function selectDifficulty(difficulty) {
    document.querySelectorAll('.difficulty-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`.difficulty-card.${difficulty === 'facile' ? 'easy' : difficulty === 'moyen' ? 'medium' : 'hard'}`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    selectedDifficulty = difficulty;
  
    
    startButton.removeAttribute('disabled');
    
    localStorage.setItem('gameDifficulty', difficulty);
    
    startButton.href = `play.html?difficulte=${difficulty}`;
}

    const urlParams = new URLSearchParams(window.location.search);
    const difficulty = urlParams.get('difficulte') || localStorage.getItem('gameDifficulty') || 'moyen';
    
    const difficultySettings = {
        'facile': { min: 1, max: 50 },
        'moyen': { min: 1, max: 100 },
        'difficile': { min: 1, max: 200 }
    };
    

    let gameConfig = difficultySettings[difficulty] || difficultySettings.moyen;
    let minRange = gameConfig.min;
    let maxRange = gameConfig.max;
    let secretNumber = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
    let playerAttempts = 0;
    let computerAttempts = 0;
    let gameOver = false;
    alert(gameConfig);
    
    // Variables pour l'IA de l'ordinateur
    let computerMinRange = minRange;
    let computerMaxRange = minRange;

     // Éléments du DOM
     const difficultyBadge = document.getElementById('difficulty-badge');
     const rangeDisplay = document.getElementById('range-display');
     const attemptsCounter = document.getElementById('attempts-counter');
     const targetNumberDisplay = document.getElementById('target-number');
     const playerGuessInput = document.getElementById('player-guess');
     const guessButton = document.getElementById('guess-button');
     const playerDisplay = document.getElementById('player-display');
     const playerHint = document.getElementById('player-hint');
     const playerAttemptsDisplay = document.getElementById('player-attempts');
     const computerDisplay = document.getElementById('computer-display');
     const computerHint = document.getElementById('computer-hint');
     const thinkingMessage = document.getElementById('thinking-message');
     const computerAttemptsDisplay = document.getElementById('computer-attempts');
     const historyLog = document.getElementById('history-log');
     const resultModal = document.getElementById('result-modal');
     const resultIcon = document.getElementById('result-icon');
     const modalTitle = document.getElementById('modal-title');
     const modalMessage = document.getElementById('modal-message');
     
    
     function initGame() {
         difficultyBadge.textContent = `Niveau: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
         rangeDisplay.textContent = `${minRange} - ${maxRange}`;
         
         targetNumberDisplay.textContent = '?';
         historyLog.innerHTML = '<div class="history-item">Partie commencée. Bonne chance!</div>';
         
         playerGuessInput.setAttribute('min', minRange);
         playerGuessInput.setAttribute('max', maxRange);
         playerGuessInput.placeholder = `Entrez un nombre entre ${minRange} et ${maxRange}`;
     }
 
     function addToHistory(player, number, result) {
         const historyItem = document.createElement('div');
         historyItem.className = 'history-item';
         
         let resultText = '';
         if (result === 'correct') {
             resultText = 'Correct! ✓';
         } else if (result === 'high') {
             resultText = 'Trop grand ↑';
         } else if (result === 'low') {
             resultText = 'Trop petit ↓';
         }
         
         historyItem.innerHTML = `<span class="${player}">${player === 'player' ? 'Vous' : 'Ordinateur'}</span>: ${number} - ${resultText}`;
         historyLog.prepend(historyItem);
     }
     function checkGuess(guess, isPlayer = true) {
         let result = '';
         let hintElement = isPlayer ? playerHint : computerHint;
         
         if (guess === secretNumber) {
             result = 'correct';
             hintElement.className = 'hint correct';
             hintElement.textContent = '✓ Exact! Bien joué!';
             endGame(isPlayer);
         } else if (guess > secretNumber) {
             result = 'high';
             hintElement.className = 'hint higher';
             hintElement.textContent = '↑ Trop grand! Essayez plus petit.';
         } else {
             result = 'low';
             hintElement.className = 'hint lower';
             hintElement.textContent = '↓ Trop petit! Essayez plus grand.';
         }
         
         if (isPlayer) {
             playerAttempts++;
             playerAttemptsDisplay.textContent = playerAttempts;
             addToHistory('player', guess, result);
         } else {
             computerAttempts++;
             computerAttemptsDisplay.textContent = computerAttempts;
             addToHistory('computer', guess, result);
         }
         
         attemptsCounter.textContent = playerAttempts + computerAttempts;
         
         return result;
     }
     

     function computerGuess() {
         if (gameOver) return;
         
         thinkingMessage.textContent = 'L\'ordinateur réfléchit...';
         
         setTimeout(() => {
             const guess = Math.floor((computerMinRange + computerMaxRange) / 2);
             computerDisplay.textContent = guess;
             
             const result = checkGuess(guess, false);
             if (result === 'high') {
                 computerMaxRange = guess - 1;
                 thinkingMessage.textContent = 'L\'ordinateur ajuste sa stratégie...';
             } else if (result === 'low') {
                 computerMinRange = guess + 1;
                 thinkingMessage.textContent = 'L\'ordinateur prépare son prochain coup...';
             }
         }, 800);
     }
     

     function endGame(playerWon) {
         gameOver = true;
         
       
         targetNumberDisplay.textContent = secretNumber;
         if (playerWon) {
             resultIcon.textContent = '🏆';
             modalTitle.textContent = 'Félicitations!';
             modalMessage.textContent = `Vous avez deviné le nombre ${secretNumber} en ${playerAttempts} essais! L'ordinateur a fait ${computerAttempts} essais.`;
         } else {
             resultIcon.textContent = '🤖';
             modalTitle.textContent = 'L\'ordinateur a gagné!';
             modalMessage.textContent = `L'ordinateur a deviné le nombre ${secretNumber} en ${computerAttempts} essais. Vous avez fait ${playerAttempts} essais.`;
         }
         
         setTimeout(() => {
             resultModal.classList.add('active');
         }, 1000);
     }
     
  
     guessButton.addEventListener('click', () => {
         if (gameOver) return;
         
         const playerGuess = parseInt(playerGuessInput.value);
         if (isNaN(playerGuess) || playerGuess < minRange || playerGuess > maxRange) {
             alert(`Veuillez entrer un nombre valide entre ${minRange} et ${maxRange}.`);
             return;
         }
         
     
         playerDisplay.textContent = playerGuess;
         
  
         const result = checkGuess(playerGuess);
      
         playerGuessInput.value = '';
         
       
         if (result !== 'correct') {
             setTimeout(computerGuess, 1000);
         }
     });
     
     playerGuessInput.addEventListener('keypress', (e) => {
         if (e.key === 'Enter') {
             guessButton.click();
         }
     });
     
   
     window.onload = initGame;
   