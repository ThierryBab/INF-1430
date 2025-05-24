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
document.getElementById('runTestsBtn').addEventListener('click', function () {
    // Désactiver les autres boutons pour éviter de lancer d'autres tests pendant l'exécution
    disableButtons();

    const testsCount = 100; // Nombre de tests à effectuer
    const results = [];

    // Lancer les tests en masse
    for (let i = 0; i < testsCount; i++) {
        performTest(i + 1, results);  // Appeler une fonction pour chaque test
    }

    // Une fois tous les tests effectués, réactiver les boutons
    setTimeout(() => {
        enableButtons();
        logResults(results);
    }, 3000);  // Vous pouvez ajuster le délai en fonction de la durée des tests
});

function generateRandomArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 10000)); // Valeurs aléatoires
    }
    return arr;
}

function logResults(results) {
    const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];

    // Vider les résultats existants pour éviter les doublons si plusieurs tests sont effectués
    resultsTable.innerHTML = "";

    // Ajouter les résultats dans le tableau détaillé
    results.forEach(result => {
        const row = resultsTable.insertRow();

        row.insertCell(0).textContent = result.algorithm;
        row.insertCell(1).textContent = result.language;
        row.insertCell(2).textContent = result.size;
        row.insertCell(3).textContent = result.repetitions;
        row.insertCell(4).textContent = result.duration;
        row.insertCell(5).textContent = result.date;
    });

    // Calculer les moyennes par catégorie
    const categoryAverages = calculateCategoryAverages(results);

    // Afficher les moyennes dans un tableau dédié
    displayCategoryAverages(categoryAverages);
}



function performTest(testNumber, results) {
    const arraySize = Math.floor(Math.random() * 1000) + 10;
    const repeatCount = Math.floor(Math.random() * 5) + 1;
    const baseArray = generateRandomArray(arraySize);

    // --- TRI JS ---
    const jsStartTime = performance.now();
    bubbleSortJS([...baseArray]);
    const jsEndTime = performance.now();
    const jsDuration = jsEndTime - jsStartTime;

    results.push({
        testNumber,
        algorithm: "Tri",
        language: "JavaScript",
        size: arraySize,
        repetitions: repeatCount,
        duration: jsDuration.toFixed(2),
        date: new Date().toLocaleString(),
    });

    // --- TRI WASM ---
    const wasmStartTime = performance.now();
    if (triModule) {
        const ptr = triModule._malloc(arraySize * 4);
        triModule.HEAP32.set(baseArray, ptr / 4);
        triModule._bubbleSort(ptr, arraySize);
        triModule._free(ptr);
    }
    const wasmEndTime = performance.now();
    const wasmDuration = wasmEndTime - wasmStartTime;

    results.push({
        testNumber,
        algorithm: "Tri",
        language: "WebAssembly",
        size: arraySize,
        repetitions: repeatCount,
        duration: wasmDuration.toFixed(2),
        date: new Date().toLocaleString(),
    });

    // --- MATRICES JS ---
    const n = 100;
    const A = Array.from({ length: n * n }, () => Math.floor(Math.random() * 10));
    const B = Array.from({ length: n * n }, () => Math.floor(Math.random() * 10));
    const matJsStart = performance.now();
    for (let i = 0; i < repeatCount; i++) multiplyMatricesJS(A, B, n);
    const matJsEnd = performance.now();
    const matJsDuration = matJsEnd - matJsStart;

    results.push({
        testNumber,
        algorithm: "Matrices",
        language: "JavaScript",
        size: n,
        repetitions: repeatCount,
        duration: matJsDuration.toFixed(2),
        date: new Date().toLocaleString(),
    });

    // --- MATRICES WASM ---
    if (matriceModule) {
        const aPtr = matriceModule._malloc(n * n * 4);
        const bPtr = matriceModule._malloc(n * n * 4);
        const cPtr = matriceModule._malloc(n * n * 4);

        matriceModule.HEAP32.set(A, aPtr / 4);
        matriceModule.HEAP32.set(B, bPtr / 4);

        const matWasmStart = performance.now();
        for (let i = 0; i < repeatCount; i++) {
            matriceModule._multiplyMatrices(aPtr, bPtr, cPtr, n);
        }
        const matWasmEnd = performance.now();

        matriceModule._free(aPtr);
        matriceModule._free(bPtr);
        matriceModule._free(cPtr);

        const matWasmDuration = matWasmEnd - matWasmStart;

        results.push({
            testNumber,
            algorithm: "Matrices",
            language: "WebAssembly",
            size: n,
            repetitions: repeatCount,
            duration: matWasmDuration.toFixed(2),
            date: new Date().toLocaleString(),
        });
    }
}



function disableButtons() {
    document.getElementById('runTestsBtn').disabled = true;
    document.getElementById('triWasmBtn').disabled = true;
    document.getElementById('triJsBtn').disabled = true;
    document.getElementById('matrixWasmBtn').disabled = true;
    document.getElementById('matrixJsBtn').disabled = true;
}

function enableButtons() {
    document.getElementById('runTestsBtn').disabled = false;
    document.getElementById('triWasmBtn').disabled = false;
    document.getElementById('triJsBtn').disabled = false;
    document.getElementById('matrixWasmBtn').disabled = false;
    document.getElementById('matrixJsBtn').disabled = false;
}
function calculateCategoryAverages(results) {
    const averages = {
        triJS: { totalDuration: 0, count: 0 },
        triWASM: { totalDuration: 0, count: 0 },
        matrixJS: { totalDuration: 0, count: 0 },
        matrixWASM: { totalDuration: 0, count: 0 }
    };

    // Regrouper les résultats par catégorie d'algorithmes et langage
    results.forEach(result => {
        let key = "";
        if (result.algorithm === "Tri") {
            key = result.language === "JavaScript" ? "triJS" : "triWASM";
        } else if (result.algorithm === "Matrices") {
            key = result.language === "JavaScript" ? "matrixJS" : "matrixWASM";
        }

        if (averages[key]) {
            averages[key].totalDuration += parseFloat(result.duration);
            averages[key].count += 1;
        }
    });

    // Calculer les moyennes pour chaque catégorie
    const averageResults = [
        { category: "Tri JS", averageDuration: (averages.triJS.totalDuration / averages.triJS.count).toFixed(2) },
        { category: "Tri WASM", averageDuration: (averages.triWASM.totalDuration / averages.triWASM.count).toFixed(2) },
        { category: "Matrix JS", averageDuration: (averages.matrixJS.totalDuration / averages.matrixJS.count).toFixed(2) },
        { category: "Matrix WASM", averageDuration: (averages.matrixWASM.totalDuration / averages.matrixWASM.count).toFixed(2) }
    ];

    return averageResults;
}

function displayCategoryAverages(categoryAverages) {
    const averagesTable = document.getElementById('categoryAveragesTable').getElementsByTagName('tbody')[0];

    // Vider le tableau des moyennes
    averagesTable.innerHTML = "";

    // Ajouter les moyennes dans le tableau
    categoryAverages.forEach(average => {
        const row = averagesTable.insertRow();

        row.insertCell(0).textContent = average.category;
        row.insertCell(1).textContent = average.averageDuration; // Moyenne des durées
    });
}

