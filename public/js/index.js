//DOM
const addIncomeBtn = document.querySelector('.income-btn');
const formsDiv = document.querySelector('.forms');
const closeFormBtn = document.querySelector('.close-btn');
const budgetedMoneyValue = document.querySelector('.money-budgeted-value');
const formCategoryDropDown = document.querySelector('#category');
const formSubCategoryDropDown = document.querySelector('#subcategory');
const addTransactionForm = document.querySelector('.add-transaction-form');
const monthDisplay = document.querySelector('.month');

// STATE
const BUDGET = {
  month: {
    may: {
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
  }

}

// FUNCTIONS

function retrieveCurrentMonth() {
  return new Promise((resolve, reject) => {
    let date = new Date();
    let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    resolve(month[date.getMonth()]);
  })
}

async function setMonth() {
  const currenMonth = await retrieveCurrentMonth();
  monthDisplay.innerHTML = `<h2>${currenMonth}</h2>`;
}

function retrieveCategories() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const categories = Object.keys(BUDGET.month.may.categories);
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
      resolve(BUDGET.month.may.budget + '$');
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
  setMonth();
  setBudgetValue();
  setCategories();
}

window.on('load', function (event) {
  renderState();
})