// Tri à bulles
export function bubbleSortJS(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

// Multiplication de matrices
export function multiplyMatricesJS(A, B, n) {
    const C = new Array(n * n).fill(0);
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
            for (let k = 0; k < n; k++)
                C[i * n + j] += A[i * n + k] * B[k * n + j];
    return C;
}
