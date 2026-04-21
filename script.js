document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const foodInput = document.getElementById('foodInput');
    const goalInput = document.getElementById('goalInput');
    
    const loadingSection = document.getElementById('loading');
    const resultsSection = document.getElementById('results');
    
    // Result DOM Elements
    const resultFoodName = document.getElementById('resultFoodName');
    const scoreValue = document.getElementById('scoreValue');
    const caloriesValue = document.getElementById('caloriesValue');
    const tipsValue = document.getElementById('tipsValue');
    const alternativeValue = document.getElementById('alternativeValue');

    analyzeBtn.addEventListener('click', () => {
        const food = foodInput.value.trim().toLowerCase();
        const goal = goalInput.value;

        if (!food) {
            alert("Please enter a food item to analyze!");
            foodInput.focus();
            return;
        }

        // UX: Hide results and show loading state
        resultsSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');

        // Simulate AI Network request latency (1.8s) for premium feeling
        setTimeout(() => {
            analyzeFood(food, goal);
            loadingSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            
            // Scroll to results smoothly
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1800);
    });

    // Enter key support for input field
    foodInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            analyzeBtn.click();
        }
    });

    function analyzeFood(food, goal) {
        // AI Logic Keyword Dictionary (Mock logic for demonstration)
        const db = {
            unhealthy: ["burger", "pizza", "fries", "coke", "soda", "donut", "cake", "chips", "hotdog", "chocolate", "ice cream", "fried"],
            healthy: ["apple", "banana", "salad", "broccoli", "spinach", "chicken breast", "salmon", "oats", "fruit", "vegetable", "kale", "quinoa"],
            moderate: ["rice", "roti", "bread", "pasta", "noodles", "potato", "milk", "cheese", "chapati"]
        };

        let category = "unknown";
        if (db.unhealthy.some(item => food.includes(item))) category = "unhealthy";
        else if (db.healthy.some(item => food.includes(item))) category = "healthy";
        else if (db.moderate.some(item => food.includes(item))) category = "moderate";
        else {
            // Default heuristics if food is not in dictionary
            category = food.length % 2 === 0 ? "moderate" : "healthy"; 
            if(food.includes("fried") || food.includes("sweet") || food.includes("syrup")) category = "unhealthy";
        }

        // Generate response based on resolved category & user goal
        generateOutput(food, category, goal);
    }

    function generateOutput(food, category, goal) {
        // Formatting header presentation
        const capitalizedFood = food.charAt(0).toUpperCase() + food.slice(1);
        resultFoodName.innerHTML = `${capitalizedFood} <span style="color:var(--text-muted); font-weight:400;">Analysis</span>`;

        // Clear dynamic score classes
        scoreValue.className = "score-badge";

        if (category === "unhealthy") {
            scoreValue.textContent = "Unhealthy";
            scoreValue.classList.add("score-unhealthy");
            caloriesValue.textContent = "~400 - 800 kcal";
            
            if (goal === "Weight Loss") {
                tipsValue.textContent = "High in processed carbs and unhealthy fats. This will severely hinder steady weight loss progress.";
                alternativeValue.innerHTML = "<strong>Grilled chicken salad</strong>, lentil soup, or a veggie lettuce wrap.";
            } else if (goal === "Fitness & Muscle") {
                tipsValue.textContent = "Lacks lean protein for muscle recovery and contains high inflammatory fats that slow healing.";
                alternativeValue.innerHTML = "<strong>Lean beef burger with whole wheat bun</strong>, or grilled salmon with quinoa.";
            } else {
                tipsValue.textContent = "High in sodium and saturated fats. Continuous consumption increases cardiovascular risk.";
                alternativeValue.innerHTML = "<strong>Home-cooked version</strong> using less oil, whole grains, and fresh ingredients.";
            }
        } 
        else if (category === "moderate") {
            scoreValue.textContent = "Moderate";
            scoreValue.classList.add("score-moderate");
            caloriesValue.textContent = "~200 - 400 kcal";
            
            if (goal === "Weight Loss") {
                tipsValue.textContent = "Contains decent energy but watch portion sizes carefully to maintain your daily calorie deficit.";
                alternativeValue.innerHTML = "<strong>Cauliflower rice or zucchini noodles</strong> to cut carb density.";
            } else if (goal === "Fitness & Muscle") {
                tipsValue.textContent = "Provides excellent primary carbohydrates needed for pre or post-workout energy reserves.";
                alternativeValue.innerHTML = "<strong>Add 2 eggs or chicken breast</strong> to boost the much-needed protein profile.";
            } else {
                tipsValue.textContent = "A balanced dietary staple. Good for sustained daily energy if paired correctly.";
                alternativeValue.innerHTML = "<strong>Ensure paired with high-fiber veggies</strong> to balance blood sugar spikes.";
            }
        } 
        else {
            scoreValue.textContent = "Healthy";
            scoreValue.classList.add("score-healthy");
            caloriesValue.textContent = "~50 - 200 kcal";
            
            if (goal === "Weight Loss") {
                tipsValue.textContent = "Excellent choice! Highly satiating, low in calorie density, and rich in essential micronutrients.";
                alternativeValue.innerHTML = "<strong>Perfect as is.</strong> Enjoy it guilt-free or add a squeeze of lemon!";
            } else if (goal === "Fitness & Muscle") {
                tipsValue.textContent = "Great for vitamins and vital recovery, but may lack enough protein/calories for pure mass gain.";
                alternativeValue.innerHTML = "<strong>Pair this with a protein shake</strong> or Greek yogurt for optimal muscle synthesis.";
            } else {
                tipsValue.textContent = "Nutrient-dense profile that heavily supports overall well-being, gut health, and immune defense.";
                alternativeValue.innerHTML = "<strong>Keep it up!</strong> Variety is key, so make sure to mix up your colors daily.";
            }
        }
    }
});
