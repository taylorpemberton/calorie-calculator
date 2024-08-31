document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calorieForm');
    const resultDiv = document.getElementById('result');
    const calorieResult = document.getElementById('calorieResult');
    const calculateButton = document.getElementById('calculateButton');
    const inputs = form.querySelectorAll('input, select');

    function checkInputs() {
        let allFilled = true;
        inputs.forEach(input => {
            if (!input.value) {
                allFilled = false;
            }
        });

        if (allFilled) {
            calculateButton.classList.remove('bg-gray-500', 'cursor-not-allowed');
            calculateButton.classList.add('bg-blue-500', 'hover:bg-blue-600');
            calculateButton.disabled = false;
        } else {
            calculateButton.classList.add('bg-gray-500', 'cursor-not-allowed');
            calculateButton.classList.remove('bg-blue-500', 'hover:bg-blue-600');
            calculateButton.disabled = true;
        }
    }

    inputs.forEach(input => {
        input.addEventListener('input', checkInputs);
    });

    // Initial check
    checkInputs();

    // Allow hitting enter to expand dropdowns
    const dropdowns = document.querySelectorAll('select');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.click();
            }
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseInt(document.getElementById('height').value);
        const activity = parseFloat(document.getElementById('activity').value);

        if (!age || !gender || !weight || !height || !activity) {
            console.error('All fields must be filled');
            return;
        }

        const weightKg = weight * 0.453592;

        let bmr;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weightKg) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weightKg) + (3.098 * height) - (4.330 * age);
        }

        const calories = Math.round(bmr * activity);

        calorieResult.textContent = `${calories} calories per day`;
        resultDiv.classList.remove('hidden');
        console.log('Calculation complete:', calories);
    });
});
