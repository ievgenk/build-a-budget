//DOM
const addIncomeBtn = document.querySelector('.income-btn');
const formsDiv = document.querySelector('.forms');
const closeFormBtn = document.querySelector('.close-btn');
const budgetedMoneyValue = document.querySelector('.money-budgeted-value');
const formCategoryDropDown = document.querySelector('#category');


// STATE
const BUDGET = {
  budget: 2400,
  transactions: [{
    category: 'Bills',
    title: 'Shaw Internet',
    budgeted: 80,
    spent: 0
  }],
  categories: {
    bills: ['Bc Hydro', 'Shaw'],
    restaurants: [],
    pet: []
  }
}

// FUNCTIONS
function retrieveCategories() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const categories = Object.keys(BUDGET.categories);
      resolve(categories);
    }, 500)
  })
}

async function setCategories() {
  try {
    const categories = await retrieveCategories();
    for (let category of categories) {
      let newOption = document.createElement('option');
      newOption.setAttribute('value', category);
      let categoryText = document.createTextNode(category);
      newOption.appendChild(categoryText);
      formCategoryDropDown.appendChild(newOption);
    }
  } catch (err) {
    console.error(err);
  }
}



function retrieveBudgetValue() {
  return new Promise((resolve, reject) => {
    setInterval(() => {
      resolve(BUDGET.budget + '$');
    }, 500)
  })
}

async function setBudgetValue() {
  try {
    budgetedMoneyValue.textContent = await retrieveBudgetValue();
  } catch (err) {
    console.error(err)
  }
}


// EVENT LISTENERS

addIncomeBtn.on('click', function () {
  formsDiv.classList.toggle('hidden');
})
closeFormBtn.on('click', function () {
  formsDiv.classList.toggle('hidden');
})

// DOM RENDERING

function renderState() {
  setBudgetValue();
  setCategories();
}

window.on('load', function (event) {
  renderState();
})