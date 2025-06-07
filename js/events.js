import { parseArray } from './ui.js';
import { triChart, matrixChart, updateChart } from './charts.js';
import { saveResult, resetResults, perfData, addRowToTable } from './storage.js';
import { testTriJS, testTriWASM, testMatrixJS, testMatrixWASM } from './tests.js';
import { updateButtonsState } from './ui.js';


export function registerEventListeners(triModule, matriceModule) {
    document.getElementById('generateBigBtn')?.addEventListener('click', () => {
        const size = 10000;
        const array = Array.from({ length: size }, () => Math.floor(Math.random() * 100000));
        const arrayInput = document.getElementById('arrayInput');
        arrayInput.value = array.join(',');
        updateButtonsState();
    });


    document.getElementById('triJsBtn')?.addEventListener('click', () => {
        const array = parseArray(document.getElementById('arrayInput').value);
        const time = testTriJS(array);
        document.getElementById('triResultJS').innerHTML = `<p><strong>Tri JS :</strong> ${time} ms</p>`;
        updateChart(triChart, 0, time);
        saveResult({ algo: 'tri', language: 'JS', inputSize: array.length, repetitions: 1, durationMs: parseFloat(time), date: new Date().toISOString() });
    });

    document.getElementById('triWasmBtn')?.addEventListener('click', () => {
        const array = parseArray(document.getElementById('arrayInput').value);
        const time = testTriWASM(array, triModule);
        document.getElementById('triResultWASM').innerHTML = `<p><strong>Tri WASM :</strong> ${time} ms</p>`;
        updateChart(triChart, 1, time);
        saveResult({ algo: 'tri', language: 'WASM', inputSize: array.length, repetitions: 1, durationMs: parseFloat(time), date: new Date().toISOString() });
    });

    document.getElementById('matrixJsBtn')?.addEventListener('click', () => {
        const n = 500;
        const reps = parseInt(document.getElementById('repeatInput').value) || 1;
        const A = Array.from({ length: n * n }, () => Math.floor(Math.random() * 10));
        const B = Array.from({ length: n * n }, () => Math.floor(Math.random() * 10));
        const time = testMatrixJS(A, B, n, reps);
        document.getElementById('matrixResultJS').innerHTML = `<p><strong>JS Matrices (x${reps}) :</strong> ${time} ms</p>`;
        updateChart(matrixChart, 0, time, `JS (x${reps})`);
        saveResult({ algo: 'matrices', language: 'JS', inputSize: n, repetitions: reps, durationMs: parseFloat(time), date: new Date().toISOString() });
    });

    document.getElementById('matrixWasmBtn')?.addEventListener('click', () => {
        const n = 500;
        const reps = parseInt(document.getElementById('repeatInput').value) || 1;
        const A = new Int32Array(n * n).map(() => Math.floor(Math.random() * 10));
        const B = new Int32Array(n * n).map(() => Math.floor(Math.random() * 10));
        const time = testMatrixWASM(A, B, n, reps, matriceModule);
        document.getElementById('matrixResultWASM').innerHTML = `<p><strong>WASM Matrices (x${reps}) :</strong> ${time} ms</p>`;
        updateChart(matrixChart, 1, time, `WASM (x${reps})`);
        saveResult({ algo: 'matrices', language: 'WASM', inputSize: n, repetitions: reps, durationMs: parseFloat(time), date: new Date().toISOString() });
    });

    document.getElementById('resetResultsBtn')?.addEventListener('click', resetResults);

    perfData.forEach(addRowToTable);
}
