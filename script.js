/* Javascript for the final project
******************************************
*/

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function injectHTML(list) {
    console.log('fired injectHTML');
    const target = document.querySelector('#cleanup_list');
    target.innerHTML = '';
    list.forEach((item) => {
        const str = `<li>${item.organization.concat(": ", item.major_wshed, ": ", item.number_bags)}</li>`;
        target.innerHTML += str;
    });
}

function filterList(list, query) {
    return list.filter((item) => {
        return item.number_bags == query;
    })
}

function cutCleanupList(list) {
    console.log('fired cut list');
    const range = [...Array(10).keys()];
    return newArray = range.map((item) => {
        const index = getRandomIntInclusive(0, list.length - 1);
        return list[index];
    })
}

function initChart(target, data, labels) {
    const chart = new Chart(target, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Frequency of Cleanups for each Watershed',
            data: data,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
      return chart;
}

// helper to de-scope charts
function transportChart(chart) {
    return chart;
}

function processChartData(passedData) {
    const watershed_array = passedData.map(item => {
        return {
            major_wshed: item.major_wshed
        }  
    })
    //console.log(watershed_array);

    const dataForChart = watershed_array.reduce((col, item, idx) => {
        if (!col[item.major_wshed]) {
            col[item.major_wshed] = 1
        }
        else {
            col[item.major_wshed] += 1
        }
        return col;
    })

    const dataSet = Object.values(dataForChart);
    const labels = Object.keys(dataForChart);

    return [dataSet, labels];
}


async function mainEvent() {
    const mainForm = document.querySelector('.main_form');
    const loadDataButton = document.querySelector('#data_load');
    const generateListButton = document.querySelector('#generate');
    const chart = document.querySelector('#myChart');
    const textField = document.querySelector('#destro');

    let currentList = []; // scope is at the main event function level
    //let descoped_newChart = null;
    let newChart = null;
 
    loadDataButton.addEventListener('click', async(submitEvent) => {
        console.log('loading data');

        const results = await fetch('https://data.princegeorgescountymd.gov/resource/9tsa-iner.json');
        currentList = await results.json(); 
        console.log('table currentList');
        console.table(currentList);
        
        let chartData = processChartData(currentList);
        newChart = initChart(chart, chartData[0], chartData[1]);
    })

    // Button Events Listeners below

    generateListButton.addEventListener('click', (event) => {
        console.log('generate new cleanup list');
        const cleanupList = cutCleanupList(currentList);
        injectHTML(cleanupList);
    })

    textField.addEventListener('input', (event) => {
        console.log('input', event.target.value);
        const newList = filterList(currentList, event.target.value);
        console.log(newList);
        console.table(newList);
        injectHTML(newList);
        newChart.destroy()
        let fChartData = processChartData(newList);
        newChart = initChart(chart, fChartData[0], fChartData[1]);
    })
}




/* Event listener for firing main event when page elements have loaded */
document.addEventListener('DOMContentLoaded', async () => mainEvent());
