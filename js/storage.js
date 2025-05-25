const resultsKey = "performanceResults";
export let perfData = JSON.parse(localStorage.getItem(resultsKey)) || [];

export function saveResult(entry) {
    perfData.push(entry);
    localStorage.setItem(resultsKey, JSON.stringify(perfData));
    addRowToTable(entry);
}

export function resetResults() {
    localStorage.removeItem(resultsKey);
    perfData = [];
    document.querySelector("#resultsTable tbody").innerHTML = "";
}

export function addRowToTable(entry) {
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

export function logResults(results) {
    const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    resultsTable.innerHTML = "";
    results.forEach(result => {
        const row = resultsTable.insertRow();
        row.insertCell(0).textContent = result.algorithm;
        row.insertCell(1).textContent = result.language;
        row.insertCell(2).textContent = result.size;
        row.insertCell(3).textContent = result.repetitions;
        row.insertCell(4).textContent = result.duration;
        row.insertCell(5).textContent = result.date;
    });
    displayCategoryAverages(calculateCategoryAverages(results));
}

export function calculateCategoryAverages(results) {
    const averages = {
        triJS: { totalDuration: 0, count: 0 },
        triWASM: { totalDuration: 0, count: 0 },
        matrixJS: { totalDuration: 0, count: 0 },
        matrixWASM: { totalDuration: 0, count: 0 }
    };

    results.forEach(result => {
        let key = "";
        if (result.algorithm === "Tri") {
            key = result.language === "JavaScript" ? "triJS" : "triWASM";
        } else if (result.algorithm === "Matrices") {
            key = result.language === "JavaScript" ? "matrixJS" : "matrixWASM";
        }

        if (averages[key]) {
            averages[key].totalDuration += parseFloat(result.duration || result.durationMs || 0);
            averages[key].count += 1;
        }
    });

    return [
        {
            category: "Tri JS",
            averageDuration: averages.triJS.count ? (averages.triJS.totalDuration / averages.triJS.count).toFixed(2) : "0.00"
        },
        {
            category: "Tri WASM",
            averageDuration: averages.triWASM.count ? (averages.triWASM.totalDuration / averages.triWASM.count).toFixed(2) : "0.00"
        },
        {
            category: "Matrix JS",
            averageDuration: averages.matrixJS.count ? (averages.matrixJS.totalDuration / averages.matrixJS.count).toFixed(2) : "0.00"
        },
        {
            category: "Matrix WASM",
            averageDuration: averages.matrixWASM.count ? (averages.matrixWASM.totalDuration / averages.matrixWASM.count).toFixed(2) : "0.00"
        }
    ];
}


export function displayCategoryAverages(categoryAverages) {
    const averagesTable = document.getElementById('categoryAveragesTable').getElementsByTagName('tbody')[0];
    averagesTable.innerHTML = "";
    categoryAverages.forEach(average => {
        const row = averagesTable.insertRow();
        row.insertCell(0).textContent = average.category;
        row.insertCell(1).textContent = average.averageDuration;
    });
}
