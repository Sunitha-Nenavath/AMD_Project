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

    loadHistory();

    // 1. Core Advanced AI Analysis
    analyzeBtn.addEventListener('click', async () => {
        const food = foodInput.value.trim();
        const goal = goalInput.value;

        if (!food) {
            alert("Please enter a food item to analyze!");
            foodInput.focus();
            return;
        }

        // Grab context data dynamically evaluating BMI directly prior to calling API
        const h = parseFloat(bmiHeight.value);
        const w = parseFloat(bmiWeight.value);
        let computedBmi = bmiValue.textContent !== '--' ? bmiValue.textContent : null;

        if (!computedBmi && h && w) {
            computedBmi = (w / ((h/100) * (h/100))).toFixed(1);
        }

        const payload = {
            food, goal,
            height: h || "Not provided",
            weight: w || "Not provided",
            bmi: computedBmi || "Not provided"
        };

        // UI Transition
        resultsSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');

        try {
            // Call Node.js Full-Stack Backend
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || "Failed to analyze food.");
            }

            // Bind JSON Response to Dynamic Cards
            populateResults(food, data);
            
            // Log History locally
            saveToHistory(data.food_name || food, goal, data.health_score);
            
            // Present DOM
            loadingSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            alert("Analysis Error: " + error.message);
            loadingSection.classList.add('hidden');
        }
    });

    foodInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') analyzeBtn.click();
    });

    // 2. BMI Standard Computation System
    calcBmiBtn.addEventListener('click', () => {
        const h = parseFloat(bmiHeight.value) / 100;
        const w = parseFloat(bmiWeight.value);

        if (!h || !w || h <= 0 || w <= 0) {
            alert("Please input valid height and weight values directly to compute your exact body mass offset.");
            return;
        }

        const bmi = (w / (h * h)).toFixed(1);
        bmiValue.textContent = bmi;

        let category = "Normal weight";
        let color = "#34d399";
        
        if (bmi < 18.5) { category = "Underweight"; color = "#fbbf24"; }
        else if (bmi >= 25 && bmi < 29.9) { category = "Overweight"; color = "#fbbf24"; }
        else if (bmi >= 30) { category = "Obese"; color = "#f87171"; }

        bmiCategory.textContent = category;
        bmiCategory.style.color = color;
        bmiValue.style.color = color;

        bmiResult.classList.remove('hidden');
    });

    // 3. Mapping Complex Macro Output to Views
    function populateResults(originalFood, data) {
        document.getElementById('resultFoodName').innerHTML = `${data.food_name || originalFood} <span style="color:var(--text-muted); font-weight:400; font-size: 1.1rem;">AI Validation Matrix</span>`;
        
        const scoreVal = document.getElementById('scoreValue');
        scoreVal.textContent = data.health_score || "Unknown";
        scoreVal.className = "score-badge";
        
        const healthLower = (data.health_score || "").toLowerCase();
        if (healthLower.includes("unhealthy")) scoreVal.classList.add("score-unhealthy");
        else if (healthLower.includes("moderate")) scoreVal.classList.add("score-moderate");
        else scoreVal.classList.add("score-healthy");

        document.getElementById('caloriesValue').textContent = data.estimated_calories || "Unknown";
        
        // Safety wrap nested properties
        const macros = data.macronutrients || {};
        document.getElementById('macroProtein').textContent = macros.protein || "--";
        document.getElementById('macroCarbs').textContent = macros.carbs || "--";
        document.getElementById('macroFats').textContent = macros.fats || "--";

        document.getElementById('reasonValue').textContent = data.reason || "--";
        document.getElementById('adviceValue').textContent = data.personalized_advice || "--";
        document.getElementById('portionValue').textContent = data.portion_recommendation || "--";
        document.getElementById('alternativeValue').innerHTML = `<strong>${data.healthier_alternative || "--"}</strong>`;

        const dp = data.one_day_diet_plan || {};
        document.getElementById('dpBreakfast').textContent = dp.breakfast || "--";
        document.getElementById('dpLunch').textContent = dp.lunch || "--";
        document.getElementById('dpDinner').textContent = dp.dinner || "--";
        document.getElementById('dpSnacks').textContent = dp.snacks || "--";
    }

    // 4. Memory Controller
    function saveToHistory(food, goal, health) {
        let history = JSON.parse(localStorage.getItem('foodHistory')) || [];
        history.unshift({ food, goal, health: health || "Unknown", date: new Date().toLocaleDateString() });
        if(history.length > 10) history.pop();
        localStorage.setItem('foodHistory', JSON.stringify(history));
        loadHistory();
    }

    function loadHistory() {
        let history = JSON.parse(localStorage.getItem('foodHistory')) || [];
        historyList.innerHTML = '';
        historyCount.textContent = `(${history.length})`;

        if (history.length === 0) {
            historyList.innerHTML = '<li style="color:var(--text-muted); text-align:center; padding:1rem;">Your queries are retained locally!</li>'; return;
        }

        history.forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            
            let badgeClass = 'score-healthy';
            const h = (item.health || "").toLowerCase();
            if(h.includes('unhealthy')) badgeClass = 'score-unhealthy';
            if(h.includes('moderate')) badgeClass = 'score-moderate';

            li.innerHTML = `
                <div><span class="history-food">${item.food}</span> <span style="line-height:2.2; color:var(--text-muted); font-size:0.8rem; margin-left:0.5rem; display:block;">(${item.goal})</span></div>
                <div class="history-badge ${badgeClass}">${item.health}</div>
            `;
            historyList.appendChild(li);
        });
    }

    clearHistoryBtn.addEventListener('click', () => {
        if(confirm("Erase local memory stack completely?")) {
            localStorage.removeItem('foodHistory');
            loadHistory();
        }
    });
});
