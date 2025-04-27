import createTriModule from './tri_tableau.js';
import createMatriceModule from './multiplication_matrice.js';

let triModule = null;
let matriceModule = null;

async function initModules() {
  triModule = await createTriModule();
  matriceModule = await createMatriceModule();
  document.querySelectorAll('button').forEach(btn => btn.disabled = false);
}

initModules();

function parseArray(input) {
  if (!input.trim()) return [];
  if (!input.includes(',')) {
    const size = parseInt(input);
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100000));
  }
  return input.split(',').map(Number);
}

function bubbleSortJS(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

function multiplyMatricesJS(A, B, n) {
  const C = new Array(n * n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        C[i * n + j] += A[i * n + k] * B[k * n + j];
      }
    }
  }
  return C;
}

// Chart.js CONFIGURATION
const ctx = document.getElementById('perfChart').getContext('2d');
const perfChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [
      'Tri JS',
      'Tri WASM',
      'Multiplication Matrices JS (x10)',
      'Multiplication Matrices WASM (x10)'
    ],
    datasets: [{
      label: 'Temps en ms (plus petit = meilleur)',
      data: [0, 0, 0, 0],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54,162,235,1)',
        'rgba(255,206,86,1)',
        'rgba(75,192,192,1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: { beginAtZero: true }
    }
  }
});

function updateChart(index, value) {
  perfChart.data.datasets[0].data[index] = value;
  perfChart.update();
}

// --- Génération de tableau ---
document.getElementById('generateBtn').addEventListener('click', () => {
  const size = Math.floor(Math.random() * 50) + 50;
  const array = Array.from({ length: size }, () => Math.floor(Math.random() * 500));
  document.getElementById('arrayInput').value = array.join(',');
});

document.getElementById('generateBigBtn').addEventListener('click', () => {
  const size = 10000;
  const array = Array.from({ length: size }, () => Math.floor(Math.random() * 100000));
  document.getElementById('arrayInput').value = array.join(',');
});

// --- Tri avec WebAssembly ---
document.getElementById('triWasmBtn').addEventListener('click', () => {
  const array = parseArray(document.getElementById('arrayInput').value);
  const n = array.length;
  const arrPtr = triModule._malloc(n * 4);
  triModule.HEAP32.set(array, arrPtr / 4);

  const start = performance.now();
  triModule._bubbleSort(arrPtr, n);
  const end = performance.now();

  triModule._free(arrPtr);

  const time = (end - start).toFixed(3);
  document.getElementById('result').innerHTML = `<p><strong>WebAssembly Tri</strong> : ${time} ms</p>`;
  updateChart(1, time);
});

// --- Tri avec JavaScript ---
document.getElementById('triJsBtn').addEventListener('click', () => {
  const array = parseArray(document.getElementById('arrayInput').value);

  const start = performance.now();
  bubbleSortJS([...array]);
  const end = performance.now();

  const time = (end - start).toFixed(3);
  document.getElementById('result').innerHTML = `<p><strong>JavaScript Tri</strong> : ${time} ms</p>`;
  updateChart(0, time);
});

// --- Multiplication Matrices avec WebAssembly ---
document.getElementById('matrixWasmBtn').addEventListener('click', () => {
    const n = 500; // taille matrice
    const repetitions = parseInt(document.getElementById('repeatInput').value) || 1;
    
    const A = new Int32Array(n * n).map(() => Math.floor(Math.random() * 10));
    const B = new Int32Array(n * n).map(() => Math.floor(Math.random() * 10));
  
    const aPtr = matriceModule._malloc(n * n * 4);
    const bPtr = matriceModule._malloc(n * n * 4);
    const cPtr = matriceModule._malloc(n * n * 4);
  
    matriceModule.HEAP32.set(A, aPtr / 4);
    matriceModule.HEAP32.set(B, bPtr / 4);
  
    const start = performance.now();
    for (let i = 0; i < repetitions; i++) {
      matriceModule._multiplyMatrices(aPtr, bPtr, cPtr, n);
    }
    const end = performance.now();
  
    matriceModule._free(aPtr);
    matriceModule._free(bPtr);
    matriceModule._free(cPtr);
  
    const time = (end - start).toFixed(3);
    document.getElementById('result').innerHTML = `<p><strong>WebAssembly Multiplication Matrices (x${repetitions})</strong> : ${time} ms</p>`;
    updateChart(3, time);
  });
  

// --- Multiplication Matrices avec JavaScript ---
document.getElementById('matrixJsBtn').addEventListener('click', () => {
    const n = 500;
    const repetitions = parseInt(document.getElementById('repeatInput').value) || 1;
    
    const A = new Array(n * n).fill(0).map(() => Math.floor(Math.random() * 10));
    const B = new Array(n * n).fill(0).map(() => Math.floor(Math.random() * 10));
  
    const start = performance.now();
    for (let i = 0; i < repetitions; i++) {
      multiplyMatricesJS(A, B, n);
    }
    const end = performance.now();
  
    const time = (end - start).toFixed(3);
    document.getElementById('result').innerHTML = `<p><strong>JavaScript Multiplication Matrices (x${repetitions})</strong> : ${time} ms</p>`;
    updateChart(2, time);
  });
  
