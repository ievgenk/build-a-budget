// SETTING DATA NEEDE FOR CHART
var barSpentChart;

function categoriesTotalSpent() {
  let spentDataArr = STORE.categories.map(category => {

    let totalSpent = 0;

    category.listOfSubCategories.forEach(subCategory => {
      totalSpent += subCategory.spent;
    })

    return STORE.categoriesTotalSpent.push({
      name: category.name,
      spent: totalSpent
    })
  })

  STORE.categoriesTotalSpent.forEach(category => {
    STORE.totalSpentPerCat.push(category.spent)
  })
  STORE.categoriesTotalSpent.forEach(category => {
    STORE.totalSpentPerCatTitles.push(category.name)
  })



}

function drawAChart() {
  Chart.defaults.global.defaultFontFamily = 'Lato';
  Chart.defaults.global.defaultFontSize = 18;

  barSpentChart = new Chart(doughnutChart, {
    type: 'bar',
    data: {
      labels: STORE.totalSpentPerCatTitles,
      datasets: [{
        label: 'Dollar Amount Spent',
        data: STORE.totalSpentPerCat,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      title: {
        display: true,
        position: "top",
        fontSize: 22,
        fontFamily: 'Lato',
        text: 'Expenditure by Categories',
        padding: 50
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  })

  STORE.categoriesTotalSpent = [];

}

function removeExistingChart() {
  if (barSpentChart) {
    barSpentChart.destroy()
  } else {
    return
  }
}