document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calorieForm');
    const resultDiv = document.getElementById('result');
    const calorieResult = document.getElementById('calorieResult');
    const calculateButton = document.getElementById('calculateButton');

    // Add this function to check form validity
    function checkFormValidity() {
        const isValid = form.checkValidity();
        calculateButton.disabled = !isValid;
        calculateButton.classList.toggle('bg-gray-500', !isValid);
        calculateButton.classList.toggle('bg-blue-500', isValid);
    }

    // Add event listeners to all form inputs
    form.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', checkFormValidity);
    });

    // Initial check
    checkFormValidity();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateCalories();
    });

    function calculateCalories() {
        console.log('Calculating calories...');
        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseInt(document.getElementById('height').value);
        const activity = parseFloat(document.getElementById('activity').value);

        let bmr;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weight / 2.2) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight / 2.2) + (3.098 * height) - (4.330 * age);
        }

        const tdee = bmr * activity;

        const trainingType = document.getElementById('trainingType').value;
        
        let proteinPercentage, carbPercentage, fatPercentage;
        let weightLoss, maintenance, weightGain;

        switch(trainingType) {
            case 'cardio':
                proteinPercentage = 0.20;
                carbPercentage = 0.55;
                fatPercentage = 0.25;
                weightLoss = tdee - 300;
                maintenance = tdee;
                weightGain = tdee + 300;
                break;
            case 'bodybuilding':
                proteinPercentage = 0.30;
                carbPercentage = 0.40;
                fatPercentage = 0.30;
                weightLoss = tdee - 500;
                maintenance = tdee;
                weightGain = tdee + 500;
                break;
            case 'weightloss':
                proteinPercentage = 0.30;
                carbPercentage = 0.45;
                fatPercentage = 0.25;
                weightLoss = tdee - 500;
                maintenance = tdee - 250;
                weightGain = tdee;
                break;
            case 'everyday':
            default:
                proteinPercentage = 0.25;
                carbPercentage = 0.50;
                fatPercentage = 0.25;
                weightLoss = tdee - 300;
                maintenance = tdee;
                weightGain = tdee + 300;
        }

        displayResults(weightLoss, maintenance, weightGain, proteinPercentage, carbPercentage, fatPercentage, trainingType);
    }

    function displayResults(weightLoss, maintenance, weightGain, proteinPercentage, carbPercentage, fatPercentage, trainingType) {
        const proteinGrams = calculateMacro(maintenance, proteinPercentage);
        const carbGrams = calculateMacro(maintenance, carbPercentage);
        const fatGrams = calculateMacro(maintenance, fatPercentage);

        let trainingTypeText;
        switch(trainingType) {
            case 'cardio': trainingTypeText = "Cardio / Endurance"; break;
            case 'bodybuilding': trainingTypeText = "Bodybuilding"; break;
            case 'weightloss': trainingTypeText = "Weight Loss"; break;
            case 'everyday': trainingTypeText = "Everyday Life"; break;
        }

        const resultHTML = `
            <h2 class="text-xl font-semibold mb-4">Daily Caloric Needs (${trainingTypeText}):</h2>
            <ul class="list-disc pl-5 space-y-2 mb-6">
                <li><strong>Weight loss:</strong> ${Math.round(weightLoss)} calories/day</li>
                <li><strong>Maintenance:</strong> ${Math.round(maintenance)} calories/day</li>
                <li><strong>Weight gain:</strong> ${Math.round(weightGain)} calories/day</li>
            </ul>
            <h2 class="text-xl font-semibold mb-4">Recommended Macros:</h2>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>Protein:</strong> ${proteinGrams} g (${Math.round(proteinPercentage * 100)}%)</li>
                <li><strong>Carbohydrates:</strong> ${carbGrams} g (${Math.round(carbPercentage * 100)}%)</li>
                <li><strong>Fat:</strong> ${fatGrams} g (${Math.round(fatPercentage * 100)}%)</li>
            </ul>
        `;

        calorieResult.innerHTML = resultHTML;
        resultDiv.classList.remove('hidden');
    }

    function calculateMacro(calories, percentage) {
        const caloriesFromMacro = calories * percentage;
        const grams = percentage === 0.25 ? caloriesFromMacro / 4 : 
                      percentage === 0.45 ? caloriesFromMacro / 4 :
                      caloriesFromMacro / 9;
        return Math.round(grams);
    }

    console.log('Form:', document.getElementById('calorieForm'));
    console.log('Result Div:', document.getElementById('result'));
    console.log('Calorie Result:', document.getElementById('calorieResult'));

    const footer = document.getElementById('footer');
    const content = document.querySelector('.bg-white');

    function checkFooterOverlap() {
        const footerRect = footer.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();

        if (footerRect.top < contentRect.bottom) {
            footer.classList.add('bg-gray-200', 'bg-opacity-75');
        } else {
            footer.classList.remove('bg-gray-200', 'bg-opacity-75');
        }
    }

    // Check on load and resize
    window.addEventListener('load', checkFooterOverlap);
    window.addEventListener('resize', checkFooterOverlap);

    // Check when the form is submitted (in case the result changes the content height)
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateCalories();
        setTimeout(checkFooterOverlap, 0); // Check after the DOM has updated
    });
});
