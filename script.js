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

        const weightLoss = tdee - 500;
        const weightGain = tdee + 500;

        displayResults(weightLoss, tdee, weightGain);
    }

    function displayResults(weightLoss, maintenance, weightGain) {
        const resultHTML = `
            <h2 class="text-xl font-semibold mb-4">Daily Caloric Needs:</h2>
            <div class="space-y-2">
                <p><strong>Weight loss:</strong> ${Math.round(weightLoss)} calories/day</p>
                <p><strong>Maintenance:</strong> ${Math.round(maintenance)} calories/day</p>
                <p><strong>Weight gain:</strong> ${Math.round(weightGain)} calories/day</p>
            </div>
            <h3 class="text-lg font-semibold mt-6 mb-2">Recommended macronutrients:</h3>
            <div class="space-y-2">
                <p><strong>Protein:</strong> ${calculateMacro(maintenance, 0.25)} g</p>
                <p><strong>Carbohydrates:</strong> ${calculateMacro(maintenance, 0.45)} g</p>
                <p><strong>Fat:</strong> ${calculateMacro(maintenance, 0.30)} g</p>
            </div>
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
