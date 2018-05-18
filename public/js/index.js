//DOM
const addIncomeBtn = document.querySelector('.income-btn');
const formsDiv = document.querySelector('.forms');
const closeFormBtn = document.querySelector('.close-btn');


// STATE
const BUDGET = {
  budget: 0,
  transactions: [{
    category: 'Bills',
    title: 'Shaw Internet',
    budgeted: 80,
    spent: 0
  }],
  categories: {
    bills: ['Bc Hydro', 'Shaw']
  }
}

// FUNCTIONS


// EVENT LISTENERS

addIncomeBtn.on('click', function () {
  formsDiv.classList.toggle('hidden');
})
closeFormBtn.on('click', function () {
  formsDiv.classList.toggle('hidden');
})