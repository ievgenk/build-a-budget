//DOM
const budgetedMoneyValue = document.querySelector('.money-budgeted-value');
const monthDisplay = document.querySelector('.month');
const mainTable = document.querySelector('.striped-table');
const mainDiv = document.querySelector('main');
// DIVs
const addTransactionFormDiv = document.querySelector('.add-transaction-div');
const categoryFormDiv = document.querySelector('.add-category-div');
const addMoneyDiv = document.querySelector('.add-money-div');
const transactionListDiv = document.querySelector('.all-transactions-div');
// BTNs
const addIncomeBtn = document.querySelector('.income-btn');
const closeFormBtn = document.querySelector('.close-btn');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const addCategoryBtn = document.querySelector('.add-category');
const addMoneyBtn = document.querySelector('.add-money-btn');
const addMoneyCloseBtn = document.querySelector('#add-money-close-btn');
const radioNegative = document.querySelector('#negative');
const radioPositive = document.querySelector('#positive');
const viewAllTransactionsBtn = document.querySelector('.view-all-transactions');
const editCategoriesBtn = document.querySelector('.edit-categories');


// FORMS
const transactionTable = document.querySelector('.transactions-table');
const formCategoryDropDown = document.querySelector('#category');
const formSubCategoryDropDown = document.querySelector('#subcategory');
const dollarValueInput = document.querySelector('#dollar-value');
const addTransactionForm = document.querySelector('.add-transaction-form');
const briefDescriptionInput = document.querySelector('#description');
const closeBtnCategoryForm = document.querySelector('#close-btn-category');
const categoryForm = document.querySelector('.category-form');
const categoryNameInput = document.querySelector('#category-name');
const addMoneyForm = document.querySelector('.add-money-form');
const moneyValueInput = document.querySelector('#money-value');


// STATE
const BUDGET = {
  selectedYear: 2018,
  selectedMonth: 5,
  byYear: {
    2018: {
      byMonth: {
        4: {
          budget: 1400,
          transactions: [{
            category: 'Bills',
            subCategory: 'Shaw Internet',
            value: 45,
            positive: true,
            negative: false,
            description: ''
          }],
          categories: {
            bills: [{
              title: 'Pet Insurance',
              budgeted: 45,
              spent: 45
            }, {
              title: 'Bc Hydro',
              budgeted: 0,
              spent: 0
            }, {
              title: 'Shaw',
              budgeted: 0,
              spent: 0
            }],
            travelling: [],
            pet: []
          }
        },
        5: {
          budget: 5400,
          transactions: [{
            category: 'Bills',
            subCategory: 'Shaw Internet',
            value: 45,
            positive: true,
            negative: false,
            description: '',
          }],
          categories: {
            bills: [{
              title: 'Freedom Mobile',
              budgeted: 190,
              spent: 0
            }, {
              title: 'Bc Hydro',
              budgeted: 120,
              spent: 60
            }, {
              title: 'Shaw',
              budgeted: 88,
              spent: 88
            }],
            Dinning: [{
              title: 'Tim Hortons',
              budgeted: 60,
              spent: 23
            }, {
              title: 'Starbucks',
              budgeted: 0,
              spent: 0
            }],
            pet: [{
              title: 'Bosleys',
              budgeted: 0,
              spent: 0
            }]
          }
        },
        6: {
          budget: 3400,
          transactions: [{
            category: 'Bills',
            subCategory: 'Shaw Internet',
            value: 45,
            positive: true,
            negative: false,
            description: ''
          }],
          categories: {
            bills: [{
              title: 'Bc Hydro',
              budgeted: 0,
              spent: 0
            }, {
              title: 'Shaw',
              budgeted: 0,
              spent: 0
            }],
            restaurants: [],
            pet: []
          }
        }
      }
    }
  }
};



const STORE = {
  selectedYear: 2018,
  selectedMonth: 5,
  budgets: {
    byYear: {

    }
  }
}



// FUNCTIONS

function renderTable() {
  let categories = BUDGET.byYear[BUDGET.selectedYear].byMonth[BUDGET.selectedMonth].categories;
  let tableHtml = ``;
  for (let category in categories) {
    let categoryHtml =
      `<thead>
    <tr>
      <th class="add-subCategory-icon">${category}
      <i class="far fa-plus-square add-subCategory-btn hidden"></i>
      </th>
      <th>Budgeted</th>
      <th class="remove-icon">Spent
        <i class="far fa-minus-square hidden"></i>
      </th>
    </tr>
  </thead>`;
    let subcategoryHtml =
      Object.values(categories[category]).map(subCategory => {
        return `<tbody>
        <tr>
          <td>${subCategory.title}</td>
          <td>${subCategory.budgeted}</td>
          <td class="remove-icon">${subCategory.spent}
            <i class="far fa-minus-square hidden"></i>
          </td>
        </tr>
        </tbody>`;
      })
    let categoryUnitHtml = categoryHtml + subcategoryHtml;
    tableHtml += categoryUnitHtml;
  }
  mainTable.innerHTML = tableHtml;
}



function sortMonthsAscending() {
  let arrOfMonths = Object.keys(BUDGET.byYear[BUDGET.selectedYear].byMonth);
  let ascendingArrOfMonths = arrOfMonths.sort()
  return ascendingArrOfMonths;
}

function retrieveBudgetData() {
  return new Promise((resolve, reject) => {
    //AXIOS request
    setTimeout(() => {
      STORE.budgets.byYear[STORE.selectedYear].byMonth[STORE.selectedMonth] = { //DATA/}
      }
      resolve();
    }, 500)
  })
}

function setMonth() {
  let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currenMonth = month[BUDGET.selectedMonth - 1];
  monthDisplay.innerHTML = `<h2>${currenMonth}</h2>`;
}

function retrieveCategories() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const categories = Object.keys(BUDGET.byYear[BUDGET.selectedYear].byMonth[BUDGET.selectedMonth].categories);
      resolve(categories);
    }, 500)
  })
}

async function setCategories() {
  try {
    const categories = await retrieveCategories();
    formCategoryDropDown.innerHTML = '';
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
      resolve(BUDGET.byYear[BUDGET.selectedYear].byMonth[BUDGET.selectedMonth].budget + '$');
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

function retrieveSubCategory() {
  let choseCategory = formCategoryDropDown.options[formCategoryDropDown.selectedIndex].textContent;
  let subCategoryArr = BUDGET.byYear[BUDGET.selectedYear].byMonth[BUDGET.selectedMonth].categories[choseCategory];
  let subCategoryList = subCategoryArr.map(subCatergory => {
    return subCatergory.title;
  })
  return subCategoryList;
};



function renderSubCategories() {
  let subCategoryList = retrieveSubCategory();
  formSubCategoryDropDown.innerHTML = '';
  for (let subCategory of subCategoryList) {
    let newOption = document.createElement('option');
    newOption.setAttribute('value', subCategory);
    let subCategoryText = document.createTextNode(subCategory);
    newOption.appendChild(subCategoryText);
    formSubCategoryDropDown.appendChild(newOption);
  }
}

function addCategory() {
  let categories = BUDGET.byYear[BUDGET.selectedYear].byMonth[BUDGET.selectedMonth].categories;

  for (let category in categories) {
    if (category != categoryNameInput.value) {
      categories[categoryNameInput.value] = [];
      alert('Succesfully added')
      categoryNameInput.value = '';
      break;
    } else {
      alert('This category already exists')
    }
  }
}

function addMoneyToBudget() {
  BUDGET.byYear[BUDGET.selectedYear].byMonth[BUDGET.selectedMonth].budget += parseInt(moneyValueInput.value);
  moneyValueInput.value = '';
  alert('Money Succesfully were added to your budget');
}

function addATransaction() {
  let newTransaction = {
    category: formCategoryDropDown.value,
    subCategory: formSubCategoryDropDown.value,
    value: `${dollarValueInput.value}`
  }
  if (radioNegative.checked) {
    newTransaction.positive = false,
      newTransaction.negative = true
  } else {
    newTransaction.positive = true,
      newTransaction.negative = false
  }
  newTransaction.description = briefDescriptionInput.value;
  BUDGET.byYear[BUDGET.selectedYear].byMonth[BUDGET.selectedMonth].transactions.push(newTransaction);
  briefDescriptionInput.value = '';
  dollarValueInput.value = '';
  alert('Your Transaction has been sucesfully added')
  return newTransaction;
}

function addingTransactionValueToState() {
  let newTransaction = addATransaction();
  let stateCategories = Object.keys(BUDGET.byYear[BUDGET.selectedYear].byMonth[BUDGET.selectedMonth].categories)

  for (let category of stateCategories) {
    if (newTransaction.category === category) {
      let selectedCategory = BUDGET.byYear[BUDGET.selectedYear].byMonth[BUDGET.selectedMonth].categories[category];

      let selectedSubCategory = selectedCategory.filter(selectedCategory => selectedCategory.title === newTransaction.subCategory)

      if (newTransaction.positive === true) {
        BUDGET.byYear[BUDGET.selectedYear].byMonth[BUDGET.selectedMonth].budget += parseInt(newTransaction.value);
      } else if (newTransaction.negative === true) {
        selectedSubCategory[0].spent -= (newTransaction.value * -1);
        selectedSubCategory[0].budgeted -= newTransaction.value;
      }

    }
  }
}

function displayAllTransactions() {
  const transactionArr = BUDGET.byYear[BUDGET.selectedYear].byMonth[BUDGET.selectedMonth].transactions;
  let transactionsHTML = '';

  for (let transaction of transactionArr) {
    let transactionProperties = Object.keys(transaction);
    transactionsHTML +=
      `<thead>
    <tr>
      <th>${transactionProperties[0]}
      </th>
      <th>${transactionProperties[1]}</th>
      <th>
      ${transactionProperties[2]}
      </th>
      <th>
      ${transactionProperties[5]}
      </th>
    </tr>
  </thead>
  <tbody>
        <tr>
          <td>${transaction.category}</td>
          <td>${transaction.subCategory}</td>
          <td>${transaction.value}</td>
          <td>${transaction.description}</td>
        </tr>
        </tbody>`;
  }
  transactionTable.innerHTML = transactionsHTML;
}

// EVENT LISTENERS -- DOM RENDERING

addIncomeBtn.on('click', function () {
  addTransactionFormDiv.classList.toggle('hidden');
})
closeFormBtn.on('click', function () {
  event.currentTarget.parentNode.parentNode.classList.toggle('hidden');

})

closeBtnCategoryForm.on('click', function () {
  event.currentTarget.parentNode.parentNode.classList.toggle('hidden');

})

leftArrow.on('click', function (event) {
  let ascendingArrOfMonths = sortMonthsAscending();
  if (ascendingArrOfMonths[0] < BUDGET.selectedMonth) {
    BUDGET.selectedMonth--;
  } else {
    return;
  }
  renderState();
})
rightArrow.on('click', function (event) {
  let ascendingArrOfMonths = sortMonthsAscending();
  if (ascendingArrOfMonths[ascendingArrOfMonths.length - 1] > BUDGET.selectedMonth) {
    BUDGET.selectedMonth++;
  } else {
    return;
  }
  renderState();
})


addCategoryBtn.on('click', function (event) {
  categoryFormDiv.classList.toggle('hidden');
})

formCategoryDropDown.on('click', function (event) {
  renderSubCategories();
})

categoryForm.on('submit', function (event) {
  event.preventDefault();
  addCategory();
  renderState();
})

addMoneyCloseBtn.on('click', function (event) {
  event.currentTarget.parentNode.parentNode.classList.toggle('hidden');
})

viewAllTransactionsBtn.on('click', function (event) {
  mainDiv.classList.toggle('hidden');
  if (mainDiv.classList.contains('hidden')) {
    event.currentTarget.textContent = 'Back To Budget';
  } else {
    event.currentTarget.textContent = 'View All Transactions';
  }
  displayAllTransactions();
  transactionListDiv.classList.toggle('hidden');
})

addMoneyBtn.on('click', function (event) {
  addMoneyDiv.classList.toggle('hidden');
})

addMoneyForm.on('submit', function (event) {
  event.preventDefault();
  addMoneyToBudget();
  renderState();
})

addTransactionForm.on('submit', function (event) {
  event.preventDefault();
  addingTransactionValueToState();
  renderState();
})

editCategoriesBtn.on('click', function (event) {
  const addSubCategoryBtns = document.querySelectorAll('.add-subCategory-btn');
  const deleteCategoryBtns = document.querySelectorAll('.fa-minus-square');
  for (let i = 0; i < deleteCategoryBtns.length; i++) {
    deleteCategoryBtns[i].classList.toggle('hidden');
  }
  for (let i = 0; i < addSubCategoryBtns.length; i++) {
    addSubCategoryBtns[i].classList.toggle('hidden');
  }
})

function renderState() {
  setMonth();
  setBudgetValue();
  setCategories();
  renderTable();
  displayAllTransactions();
}

window.on('load', function (event) {
  renderState();
})