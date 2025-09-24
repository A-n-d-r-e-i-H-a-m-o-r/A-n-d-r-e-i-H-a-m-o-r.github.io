let originalProblems = [];
let problems = [];
let currentProblem = 0;
let correctAnswers = 0;
let totalAnswers = 0;

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function shuffleProblems() {
    problems = shuffleArray(originalProblems);
    currentProblem = 0;
    displayProblem();
}

function displayProblem() {
    const problem = problems[currentProblem];
    const problemCard = document.getElementById('problemCard');
    
    problemCard.innerHTML = `
        <div class="problem-title">${problem.title}</div>
        <div class="difficulty ${problem.difficulty}">${problem.difficulty.toUpperCase()}</div>
        <div class="problem-description">${problem.description}</div>
        <div class="example"><strong>Example:</strong><pre>${problem.example}</pre></div>
        
        <div class="quiz-section">
            <div class="quiz-question">${problem.question}</div>
            <ul class="options">
                ${problem.options.map((option, index) => `
                    <li class="option">
                        <label>
                            <input type="radio" name="answer" value="${index}">
                            ${option}
                        </label>
                    </li>
                `).join('')}
            </ul>
            <button class="submit-btn" onclick="checkAnswer()">Submit Answer</button>
            <button class="next-btn" id="nextBtn" onclick="nextProblem()">Next Problem</button>
            
            <div class="result" id="result"></div>
            <div class="explanation" id="explanation"></div>
        </div>
    `;
    
    updateProgress();
}

function checkAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) {
        alert('Please select an answer!');
        return;
    }

    const answerIndex = parseInt(selectedAnswer.value);
    const problem = problems[currentProblem];
    const result = document.getElementById('result');
    const explanation = document.getElementById('explanation');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.querySelector('.submit-btn');

    totalAnswers++;

    if (answerIndex === problem.correct) {
        correctAnswers++;
        result.className = 'result correct';
        result.innerHTML = '🎉 Correct! Well done!';
    } else {
        result.className = 'result incorrect';
        result.innerHTML = `❌ Incorrect. The correct answer is: "${problem.options[problem.correct]}"`;
    }

    explanation.innerHTML = `<strong>Explanation:</strong><br>${problem.explanation}`;
    
    result.style.display = 'block';
    explanation.style.display = 'block';
    nextBtn.style.display = 'inline-block';

    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.disabled = true;
    });

    submitBtn.disabled = true;
    updateStats();
}

function nextProblem() {
    currentProblem = (currentProblem + 1) % problems.length;
    displayProblem();
}

function updateProgress() {
    const progress = ((currentProblem + 1) / problems.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

function updateStats() {
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('totalCount').textContent = totalAnswers;
    const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
    document.getElementById('accuracy').textContent = accuracy + '%';
}

// Initialize the app when page loads
window.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('problems.json');
        if (!response.ok) throw new Error('Failed to load problems.json');
        originalProblems = await response.json();
        shuffleProblems();
        updateStats();
    } catch (error) {
        console.error('Error loading problems:', error);
        alert('Failed to load problems. Please try again.');
    }
});