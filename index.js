// Game state
let gameState = {
    playerScore: 0,
    computerScore: 0,
    gamesPlayed: 0,
    playerChoice: null,
    computerChoice: null,
    isAnimating: false
};

// DOM elements
const playerScoreElement = document.getElementById('playerScore');
const computerScoreElement = document.getElementById('computerScore');
const gamesPlayedElement = document.getElementById('gamesPlayed');
const winRateElement = document.getElementById('winRate');
const playerChoiceElement = document.getElementById('playerChoice');
const computerChoiceElement = document.getElementById('computerChoice');
const resultTextElement = document.getElementById('resultText');
const resultDisplayElement = document.getElementById('resultDisplay');
const resetBtn = document.getElementById('resetBtn');
const confettiContainer = document.getElementById('confettiContainer');

// Choice buttons
const choiceButtons = document.querySelectorAll('.choice-btn');

// Game logic
const choices = ['rock', 'paper', 'scissors'];
const choiceIcons = {
    rock: 'fas fa-hand-rock',
    paper: 'fas fa-hand-paper',
    scissors: 'fas fa-hand-scissors'
};

// Initialize game
function initGame() {
    // Add event listeners
    choiceButtons.forEach(button => {
        button.addEventListener('click', () => handlePlayerChoice(button.dataset.choice));
    });
    
    resetBtn.addEventListener('click', resetGame);
    
    // Load saved game state
    loadGameState();
    updateDisplay();
    
    // Add initial animations
    addEntranceAnimations();
}

// Handle player choice
function handlePlayerChoice(choice) {
    if (gameState.isAnimating) return;
    
    gameState.isAnimating = true;
    gameState.playerChoice = choice;
    
    // Animate player choice
    animateChoice(playerChoiceElement, choice, 'player');
    
    // Simulate computer thinking
    setTimeout(() => {
        const computerChoice = getComputerChoice();
        gameState.computerChoice = computerChoice;
        
        // Animate computer choice
        animateChoice(computerChoiceElement, computerChoice, 'computer');
        
        // Determine winner after a short delay
        setTimeout(() => {
            determineWinner();
        }, 500);
    }, 1000);
}

// Get computer choice
function getComputerChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
}

// Animate choice display
function animateChoice(element, choice, player) {
    // Clear previous content
    element.innerHTML = '';
    
    // Create icon element
    const icon = document.createElement('i');
    icon.className = choiceIcons[choice];
    element.appendChild(icon);
    
    // Add animation classes
    element.style.transform = 'scale(0)';
    element.style.opacity = '0';
    
    // Animate in
    setTimeout(() => {
        element.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
    }, 100);
}

// Determine winner
function determineWinner() {
    const { playerChoice, computerChoice } = gameState;
    let result, winner;
    
    if (playerChoice === computerChoice) {
        result = 'tie';
        winner = null;
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        result = 'win';
        winner = 'player';
    } else {
        result = 'lose';
        winner = 'computer';
    }
    
    // Update game state
    gameState.gamesPlayed++;
    if (result === 'win') {
        gameState.playerScore++;
    } else if (result === 'lose') {
        gameState.computerScore++;
    }
    
    // Animate result
    animateResult(result, winner);
    
    // Update display
    updateDisplay();
    
    // Save game state
    saveGameState();
    
    // Reset animation state after delay
    setTimeout(() => {
        gameState.isAnimating = false;
    }, 2000);
}

// Animate result
function animateResult(result, winner) {
    const resultText = getResultText(result);
    resultTextElement.textContent = resultText;
    
    // Remove previous classes
    resultTextElement.classList.remove('win', 'lose', 'tie');
    
    // Add new class and animate
    resultTextElement.classList.add(result);
    
    // Animate choice icons
    if (winner === 'player') {
        playerChoiceElement.classList.add('winner');
        computerChoiceElement.classList.add('loser');
        createConfetti();
    } else if (winner === 'computer') {
        computerChoiceElement.classList.add('winner');
        playerChoiceElement.classList.add('loser');
    } else {
        // Tie - both get a neutral animation
        playerChoiceElement.style.animation = 'pulse 0.6s ease-in-out';
        computerChoiceElement.style.animation = 'pulse 0.6s ease-in-out';
    }
    
    // Remove animation classes after delay
    setTimeout(() => {
        playerChoiceElement.classList.remove('winner', 'loser');
        computerChoiceElement.classList.remove('winner', 'loser');
        playerChoiceElement.style.animation = '';
        computerChoiceElement.style.animation = '';
    }, 1500);
}

// Get result text
function getResultText(result) {
    const resultTexts = {
        win: ['VICTORY!', 'YOU WIN!', 'DOMINANCE!', 'CHAMPION!'],
        lose: ['DEFEAT!', 'YOU LOSE!', 'TRY AGAIN!', 'NEXT TIME!'],
        tie: ['DRAW!', 'TIE GAME!', 'STALEMATE!', 'EVEN MATCH!']
    };
    
    const texts = resultTexts[result];
    return texts[Math.floor(Math.random() * texts.length)];
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
            
            confettiContainer.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 50);
    }
}

// Update display
function updateDisplay() {
    playerScoreElement.textContent = gameState.playerScore;
    computerScoreElement.textContent = gameState.computerScore;
    gamesPlayedElement.textContent = gameState.gamesPlayed;
    
    // Calculate win rate
    const winRate = gameState.gamesPlayed > 0 
        ? Math.round((gameState.playerScore / gameState.gamesPlayed) * 100)
        : 0;
    winRateElement.textContent = winRate + '%';
    
    // Animate score changes
    animateScoreChange(playerScoreElement);
    animateScoreChange(computerScoreElement);
}

// Animate score change
function animateScoreChange(element) {
    element.style.transform = 'scale(1.2)';
    element.style.color = '#4ecdc4';
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.color = '#fff';
    }, 300);
}

// Reset game
function resetGame() {
    // Animate reset button
    resetBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        resetBtn.style.transform = 'scale(1)';
    }, 150);
    
    // Reset game state
    gameState = {
        playerScore: 0,
        computerScore: 0,
        gamesPlayed: 0,
        playerChoice: null,
        computerChoice: null,
        isAnimating: false
    };
    
    // Reset display
    playerChoiceElement.innerHTML = '<i class="fas fa-question"></i>';
    computerChoiceElement.innerHTML = '<i class="fas fa-question"></i>';
    resultTextElement.textContent = 'Choose your weapon!';
    resultTextElement.classList.remove('win', 'lose', 'tie');
    
    // Update display
    updateDisplay();
    
    // Save game state
    saveGameState();
    
    // Add reset animation
    addResetAnimation();
}

// Add reset animation
function addResetAnimation() {
    const elements = [playerChoiceElement, computerChoiceElement, resultTextElement];
    
    elements.forEach((element, index) => {
        element.style.animation = 'fadeInUp 0.5s ease-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    });
}

// Add entrance animations
function addEntranceAnimations() {
    const elements = document.querySelectorAll('.choice-btn, .reset-btn, .game-stats');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Save game state to localStorage
function saveGameState() {
    const saveData = {
        playerScore: gameState.playerScore,
        computerScore: gameState.computerScore,
        gamesPlayed: gameState.gamesPlayed
    };
    localStorage.setItem('rpsGameState', JSON.stringify(saveData));
}

// Load game state from localStorage
function loadGameState() {
    const savedData = localStorage.getItem('rpsGameState');
    if (savedData) {
        const data = JSON.parse(savedData);
        gameState.playerScore = data.playerScore || 0;
        gameState.computerScore = data.computerScore || 0;
        gameState.gamesPlayed = data.gamesPlayed || 0;
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (gameState.isAnimating) return;
    
    switch(e.key.toLowerCase()) {
        case 'r':
            handlePlayerChoice('rock');
            break;
        case 'p':
            handlePlayerChoice('paper');
            break;
        case 's':
            handlePlayerChoice('scissors');
            break;
        case ' ':
            e.preventDefault();
            resetGame();
            break;
    }
});

// Add hover effects for choice buttons
choiceButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        if (!gameState.isAnimating) {
            button.style.transform = 'translateY(-5px) scale(1.05)';
        }
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
    });
});

// Add sound effects (optional - using Web Audio API)
function playSound(frequency, duration) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
        // Sound not supported or blocked
    }
}

// Enhanced choice button interactions
choiceButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Add click sound
        playSound(800, 0.1);
        
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '100px';
        ripple.style.height = '100px';
        ripple.style.marginLeft = '-50px';
        ripple.style.marginTop = '-50px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', initGame);

window.addEventListener('focus', () => {
    loadGameState();
    updateDisplay();
});

document.documentElement.style.scrollBehavior = 'smooth';
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
