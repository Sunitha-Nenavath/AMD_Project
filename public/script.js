document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const analyzeBtn = document.getElementById('analyzeBtn');
    const foodInput = document.getElementById('foodInput');
    const goalInput = document.getElementById('goalInput');
    const loadingSection = document.getElementById('loading');
    const resultsSection = document.getElementById('results');

    // BMI Elements
    const calcBmiBtn = document.getElementById('calcBmiBtn');
    const bmiHeight = document.getElementById('bmiHeight');
    const bmiWeight = document.getElementById('bmiWeight');
    const bmiResult = document.getElementById('bmiResult');
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');

    // History Elements
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const historyCount = document.getElementById('historyCount');

    // Initialize Local Storage History
    loadHistory();

    // 1. AI Analysis Event Listener
    analyzeBtn.addEventListener('click', async () => {
        const food = foodInput.value.trim();
        const goal = goalInput.value;

        if (!food) {
            alert("Please enter a food item to analyze!");
            foodInput.focus();
            return;
        }

        // UI Reset
        resultsSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');

        try {
            // Call Node.js Backend API
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ food, goal })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || "Failed to analyze food. Ensure Gemini API key is configured.");
            }

            // Populate Results
            populateResults(food, data);
            
            // Save to LocalStorage
            saveToHistory(food, goal, data.health);
            
            // Display Results
            loadingSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            alert("Error: " + error.message);
            loadingSection.classList.add('hidden');
        }
    });

    // Enter key support
    foodInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') analyzeBtn.click();
    });

    // 2. BMI Calculator Logic
    calcBmiBtn.addEventListener('click', () => {
        const h = parseFloat(bmiHeight.value) / 100; // cm to m
        const w = parseFloat(bmiWeight.value);

        if (!h || !w || h <= 0 || w <= 0) {
            alert("Please enter valid height and weight.");
            return;
        }

        const bmi = (w / (h * h)).toFixed(1);
        bmiValue.textContent = bmi;

        let category = "Normal weight";
        let color = "#34d399"; // green
        
        if (bmi < 18.5) { category = "Underweight"; color = "#fbbf24"; }
        else if (bmi >= 25 && bmi < 29.9) { category = "Overweight"; color = "#fbbf24"; }
        else if (bmi >= 30) { category = "Obese"; color = "#f87171"; }

        bmiCategory.textContent = category;
        bmiCategory.style.color = color;
        bmiValue.style.color = color;

        bmiResult.classList.remove('hidden');
    });

    // 3. UI Population Helper
    function populateResults(food, data) {
        document.getElementById('resultFoodName').innerHTML = `${food.charAt(0).toUpperCase() + food.slice(1)} <span style="color:var(--text-muted); font-weight:400;">Analysis</span>`;
        
        const scoreVal = document.getElementById('scoreValue');
        scoreVal.textContent = data.health || "Unknown";
        scoreVal.className = "score-badge"; // reset classes
        
        const healthLower = (data.health || "").toLowerCase();
        if (healthLower.includes("unhealthy")) scoreVal.classList.add("score-unhealthy");
        else if (healthLower.includes("moderate")) scoreVal.classList.add("score-moderate");
        else scoreVal.classList.add("score-healthy");

        document.getElementById('caloriesValue').textContent = data.calories || "Unknown";
        document.getElementById('tipsValue').textContent = data.tips || "No specific tips provided.";
        document.getElementById('alternativeValue').innerHTML = `<strong>${data.suggestion || "None"}</strong>`;
    }

    // 4. Local Storage History Management
    function saveToHistory(food, goal, health) {
        let history = JSON.parse(localStorage.getItem('foodHistory')) || [];
        history.unshift({ food, goal, health, date: new Date().toLocaleDateString() });
        if(history.length > 10) history.pop(); // Keep only last 10
        localStorage.setItem('foodHistory', JSON.stringify(history));
        loadHistory();
    }

    function loadHistory() {
        let history = JSON.parse(localStorage.getItem('foodHistory')) || [];
        historyList.innerHTML = '';
        historyCount.textContent = `(${history.length})`;

        if (history.length === 0) {
            historyList.innerHTML = '<li style="color:var(--text-muted); text-align:center; padding:1rem;">No recent searches.</li>'; return;
        }

        history.forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            
            let badgeClass = 'score-healthy';
            const h = (item.health || "").toLowerCase();
            if(h.includes('unhealthy')) badgeClass = 'score-unhealthy';
            if(h.includes('moderate')) badgeClass = 'score-moderate';

            li.innerHTML = `
                <div><span class="history-food">${item.food}</span> <span style="color:var(--text-muted); font-size:0.8rem; margin-left:0.5rem;">(${item.goal})</span></div>
                <div class="history-badge ${badgeClass}">${item.health}</div>
            `;
            historyList.appendChild(li);
        });
    }

    clearHistoryBtn.addEventListener('click', () => {
        if(confirm("Clear all search history?")) {
            localStorage.removeItem('foodHistory');
            loadHistory();
        }
    });
});
