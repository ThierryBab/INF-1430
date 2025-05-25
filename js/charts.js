export let triChart = null;
export let matrixChart = null;

export function initCharts() {
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

export function updateChart(chart, index, value, labelUpdate = null) {
    if (!chart) return;
    chart.data.datasets[0].data[index] = value;
    if (labelUpdate) chart.data.labels[index] = labelUpdate;
    chart.update();
}
