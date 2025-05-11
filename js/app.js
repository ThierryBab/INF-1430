import createTriModule from '../tri_tableau.js';
import createMatriceModule from '../multiplication_matrice.js';

let triModule = null;
let matriceModule = null;
let triChart = null;
let matrixChart = null;

async function initModules() {
    triModule = await createTriModule();
    matriceModule = await createMatriceModule();
    document.querySelectorAll('button').forEach(btn => btn.disabled = false);
}

// Initialisation des graphiques
function initCharts() {
    const triCtx = document.getElementById('triChart')?.getContext('2d');
    const matrixCtx = document.getElementById('matrixChart')?.getContext('2d');

    if (triCtx) {
        triChart = new Chart(triCtx, {
            type: 'bar',
            data: {
                labels: ['JS', 'WASM'],
                datasets: [{
                    label: 'Tri - Temps en ms',
                    data: [0, 0],
                    backgroundColor: ['#36A2EB', '#FF6384']
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    if (matrixCtx) {
        matrixChart = new Chart(matrixCtx, {
            type: 'bar',
            data: {
                labels: ['JS', 'WASM'],
                datasets: [{
                    label: 'Multiplication - Temps en ms',
                    data: [0, 0],
                    backgroundColor: ['#FFCE56', '#4BC0C0']
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}

function updateChart(chart, index, value, labelUpdate = null) {
    if (!chart) return;
    chart.data.datasets[0].data[index] = value;
    if (labelUpdate) chart.data.labels[index] = labelUpdate;
    chart.update();
}

function parseArray(input) {
    if (!input.trim()) return [];
    if (!input.includes(',')) {
        const size = parseInt(input);
        return Array.from({ length: size }, () => Math.floor(Math.random() * 100000));
    }
    return input.split(',').map(Number);
}

function bubbleSortJS(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

function multiplyMatricesJS(A, B, n) {
    const C = new Array(n * n).fill(0);
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
            for (let k = 0; k < n; k++)
                C[i * n + j] += A[i * n + k] * B[k * n + j];
    return C;
}

// ---- Actions utilisateur ----
document.addEventListener('DOMContentLoaded', () => {
    initModules();
    initCharts();

    document.getElementById('generateBigBtn')?.addEventListener('click', () => {
        const size = 10000;
        const array = Array.from({ length: size }, () => Math.floor(Math.random() * 100000));
        document.getElementById('arrayInput').value = array.join(',');
    });

    document.getElementById('triJsBtn')?.addEventListener('click', () => {
        const array = parseArray(document.getElementById('arrayInput').value);
        const start = performance.now();
        bubbleSortJS([...array]);
        const end = performance.now();
        const time = (end - start).toFixed(3);

        document.getElementById('triResult').innerHTML = `<p><strong>Tri JS :</strong> ${time} ms</p>`;
        updateChart(triChart, 0, time);
        saveResult({ algo: 'tri', language: 'JS', inputSize: array.length, repetitions: 1, durationMs: parseFloat(time), date: new Date().toISOString() });
    });

    document.getElementById('triWasmBtn')?.addEventListener('click', () => {
        const array = parseArray(document.getElementById('arrayInput').value);
        const n = array.length;
        const ptr = triModule._malloc(n * 4);
        triModule.HEAP32.set(array, ptr / 4);

        const start = performance.now();
        triModule._bubbleSort(ptr, n);
        const end = performance.now();

        triModule._free(ptr);
        const time = (end - start).toFixed(3);
        document.getElementById('triResult').innerHTML = `<p><strong>Tri WASM :</strong> ${time} ms</p>`;
        updateChart(triChart, 1, time);
        saveResult({ algo: 'tri', language: 'WASM', inputSize: n, repetitions: 1, durationMs: parseFloat(time), date: new Date().toISOString() });
    });

    document.getElementById('matrixJsBtn')?.addEventListener('click', () => {
        const n = 500;
        const reps = parseInt(document.getElementById('repeatInput').value) || 1;
        const A = Array.from({ length: n * n }, () => Math.floor(Math.random() * 10));
        const B = Array.from({ length: n * n }, () => Math.floor(Math.random() * 10));
        const start = performance.now();
        for (let i = 0; i < reps; i++) multiplyMatricesJS(A, B, n);
        const end = performance.now();
        const time = (end - start).toFixed(3);

        document.getElementById('matrixResult').innerHTML = `<p><strong>JS Matrices (x${reps}) :</strong> ${time} ms</p>`;
        updateChart(matrixChart, 0, time, `JS (x${reps})`);
        saveResult({ algo: 'matrices', language: 'JS', inputSize: n, repetitions: reps, durationMs: parseFloat(time), date: new Date().toISOString() });
    });

    document.getElementById('matrixWasmBtn')?.addEventListener('click', () => {
        const n = 500;
        const reps = parseInt(document.getElementById('repeatInput').value) || 1;
        const A = new Int32Array(n * n).map(() => Math.floor(Math.random() * 10));
        const B = new Int32Array(n * n).map(() => Math.floor(Math.random() * 10));

        const aPtr = matriceModule._malloc(n * n * 4);
        const bPtr = matriceModule._malloc(n * n * 4);
        const cPtr = matriceModule._malloc(n * n * 4);

        matriceModule.HEAP32.set(A, aPtr / 4);
        matriceModule.HEAP32.set(B, bPtr / 4);

        const start = performance.now();
        for (let i = 0; i < reps; i++) {
            matriceModule._multiplyMatrices(aPtr, bPtr, cPtr, n);
        }
        const end = performance.now();

        matriceModule._free(aPtr);
        matriceModule._free(bPtr);
        matriceModule._free(cPtr);

        const time = (end - start).toFixed(3);
        document.getElementById('matrixResult').innerHTML = `<p><strong>WASM Matrices (x${reps}) :</strong> ${time} ms</p>`;
        updateChart(matrixChart, 1, time, `WASM (x${reps})`);
        saveResult({ algo: 'matrices', language: 'WASM', inputSize: n, repetitions: reps, durationMs: parseFloat(time), date: new Date().toISOString() });
    });

    document.getElementById('resetResultsBtn')?.addEventListener('click', resetResults);

    // Charger les anciens résultats
    perfData.forEach(addRowToTable);
});

const resultsKey = "performanceResults";
let perfData = JSON.parse(localStorage.getItem(resultsKey)) || [];

function addRowToTable(entry) {
    const tbody = document.querySelector("#resultsTable tbody");
    const row = tbody.insertRow();
    row.innerHTML = `
        <td>${entry.algo}</td>
        <td>${entry.language}</td>
        <td>${entry.inputSize}</td>
        <td>${entry.repetitions}</td>
        <td>${entry.durationMs}</td>
        <td>${new Date(entry.date).toLocaleString()}</td>
    `;
}

function saveResult(entry) {
    perfData.push(entry);
    localStorage.setItem(resultsKey, JSON.stringify(perfData));
    addRowToTable(entry);
}

function resetResults() {
    localStorage.removeItem(resultsKey);
    perfData = [];
    document.querySelector("#resultsTable tbody").innerHTML = "";
}
