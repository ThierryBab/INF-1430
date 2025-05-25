import { bubbleSortJS, multiplyMatricesJS } from './calculs.js';

export function testTriJS(array) {
    const start = performance.now();
    bubbleSortJS([...array]);
    const end = performance.now();
    return (end - start).toFixed(3);
}

export function testTriWASM(array, triModule) {
    const n = array.length;
    const ptr = triModule._malloc(n * 4);
    triModule.HEAP32.set(array, ptr / 4);
    const start = performance.now();
    triModule._bubbleSort(ptr, n);
    const end = performance.now();
    triModule._free(ptr);
    return (end - start).toFixed(3);
}

export function testMatrixJS(A, B, n, reps) {
    const start = performance.now();
    for (let i = 0; i < reps; i++) multiplyMatricesJS(A, B, n);
    const end = performance.now();
    return (end - start).toFixed(3);
}

export function testMatrixWASM(A, B, n, reps, matriceModule) {
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

    return (end - start).toFixed(3);
}

export async function performTest(testNumber, results, triModule, matriceModule) {
    const arraySize = Math.floor(Math.random() * 1000) + 10;
    const repeatCount = Math.floor(Math.random() * 5) + 1;
    const baseArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 10000));

    // --- TRI JS ---
    const jsStart = performance.now();
    bubbleSortJS([...baseArray]);
    const jsEnd = performance.now();
    results.push({
        testNumber,
        algorithm: "Tri",
        language: "JavaScript",
        size: arraySize,
        repetitions: repeatCount,
        duration: (jsEnd - jsStart).toFixed(2),
        date: new Date().toLocaleString()
    });

    // --- TRI WASM ---
    const wasmStart = performance.now();
    if (triModule) {
        const ptr = triModule._malloc(arraySize * 4);
        triModule.HEAP32.set(baseArray, ptr / 4);
        triModule._bubbleSort(ptr, arraySize);
        triModule._free(ptr);
    }
    const wasmEnd = performance.now();
    results.push({
        testNumber,
        algorithm: "Tri",
        language: "WebAssembly",
        size: arraySize,
        repetitions: repeatCount,
        duration: (wasmEnd - wasmStart).toFixed(2),
        date: new Date().toLocaleString()
    });

    // --- MATRICES JS ---
    const n = 100;
    const A = Array.from({ length: n * n }, () => Math.floor(Math.random() * 10));
    const B = Array.from({ length: n * n }, () => Math.floor(Math.random() * 10));
    const matJsStart = performance.now();
    for (let i = 0; i < repeatCount; i++) multiplyMatricesJS(A, B, n);
    const matJsEnd = performance.now();
    results.push({
        testNumber,
        algorithm: "Matrices",
        language: "JavaScript",
        size: n,
        repetitions: repeatCount,
        duration: (matJsEnd - matJsStart).toFixed(2),
        date: new Date().toLocaleString()
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

        results.push({
            testNumber,
            algorithm: "Matrices",
            language: "WebAssembly",
            size: n,
            repetitions: repeatCount,
            duration: (matWasmEnd - matWasmStart).toFixed(2),
            date: new Date().toLocaleString()
        });
    }
}
