//DOM
const addIncomeBtn = $('.income-btn');


// STATE
const BUDGET = {
  budget: 0,
  transactions: [{
    category: 'Bills',
    title: 'Shaw Internet',
    budgeted: 80,
    spent: 0
  }],

}


// EVENT LISTENERS

addIncomeBtn.on('click', function () {
  console.log('Clicked')
})