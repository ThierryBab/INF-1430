import createTriModule from '../tri_tableau.js';
import createMatriceModule from '../multiplication_matrice.js';
import { initCharts } from './charts.js';
import { disableButtons, enableButtons, updateButtonsState } from './ui.js';
import { performTest } from './tests.js';
import { logResults } from './storage.js';
import { registerEventListeners } from './events.js';

let triModule = null;
let matriceModule = null;

async function init() {
    triModule = await createTriModule();
    matriceModule = await createMatriceModule();

    document.querySelectorAll('button').forEach(btn => btn.disabled = false);
    const arrayInput = document.getElementById('arrayInput');
    arrayInput.addEventListener('input', updateButtonsState);
    updateButtonsState();

    initCharts();
    registerEventListeners(triModule, matriceModule);
}


document.addEventListener('DOMContentLoaded', init);

document.getElementById('runTestsBtn').addEventListener('click', function () {
    disableButtons();
    const testsCount = 10;
    const results = [];
    for (let i = 0; i < testsCount; i++) {
        performTest(i + 1, results, triModule, matriceModule);
    }
    setTimeout(() => {
        enableButtons();
        logResults(results);
    }, 3000);
});