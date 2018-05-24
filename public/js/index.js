const serverURL = 'http://127.0.0.1:8080'

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
  allMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  categories: [],
  inputTransactionForm: {
    selectedCategory: '',
    selectedSubCategory: ''
  },
  budget: 0
}



// FUNCTIONS

//RENDER MAIN BUDGET TABLE

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


//SET CATEGORIES

function renderCategories() {
  try {


    const categories = STORE.categories;
    formCategoryDropDown.innerHTML = '';
    for (let category of categories) {
      let newOption = document.createElement('option');
      newOption.setAttribute('value', category.name);
      let categoryText = document.createTextNode(category.name);
      newOption.appendChild(categoryText);
      formCategoryDropDown.appendChild(newOption);
    }
  } catch (err) {
    console.error(err);
  }
}

// GET CALL TO RETRIEVE CURRENT YEAR AND MONTH BUDGET

function retrieveBudgetValue() {
  return axios.get(`${serverURL}/api/budget/${STORE.selectedYear}/${STORE.selectedMonth}`)
    .then(budgetData => STORE.budget = budgetData.data.budget)
}

function displayCurrentMonth() {
  monthDisplay.innerHTML = `<h2>${STORE.allMonths[STORE.selectedMonth - 1]}</h2>`
}

function displayBudgetValue() {
  budgetedMoneyValue.innerHTML = `${STORE.budget}$`
}


//ADD MONEY TO BUDGET

function addMoneyToBudget() {
  STORE.budget += parseInt(moneyValueInput.value);
  return axios({
    url: `${serverURL}/api/budget/${STORE.selectedYear}/${STORE.selectedMonth}`,
    method: 'put',
    data: {
      budget: STORE.budget
    }
  })
}


// RETRIEVE SUBCATEGORIES

function retrieveSubCategory() {
  let choseCategory = formCategoryDropDown.options[formCategoryDropDown.selectedIndex].textContent;
  let subCategoryArr = BUDGET.byYear[BUDGET.selectedYear].byMonth[BUDGET.selectedMonth].categories[choseCategory];
  let subCategoryList = subCategoryArr.map(subCatergory => {
    return subCatergory.title;
  })
  return subCategoryList;
};

// SET SUBCATEGORIES

function renderSubCategories() {
  const category = STORE.categories.find(category => category.name === STORE.inputTransactionForm.selectedCategory);
  const subCategoryList = category.listOfSubCategories;
  formSubCategoryDropDown.innerHTML = '';
  for (let subCategory of subCategoryList) {
    let newOption = document.createElement('option');
    newOption.setAttribute('value', subCategory);
    let subCategoryText = document.createTextNode(subCategory);
    newOption.appendChild(subCategoryText);
    formSubCategoryDropDown.appendChild(newOption);
  }
}

//

// RETRIEVE CATEGORIES

function retrieveCategories() {
  return axios.get(serverURL + '/api/categories').then(categories => {
    STORE.categories = categories.data
  })
}

//ADD A NEW CATEGORY

function addCategory() {
  return axios({
    url: `${serverURL}/api/categories`,
    method: 'post',
    data: {
      categoryName: categoryNameInput.value
    }
  })
}

//ADD TRANSACTION

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

//SAVE TRANSACTION TO THE STATE OBJECT

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

//DISPLAY ALL TRANSACTIONS

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

// ADDING EVENT LISTENERS ON ADD SUBCATEGORY BUTTONS

function addListenersOnSubcategoryButtons() {
  let btnArr = document.querySelectorAll('.add-subCategory-icon')
  for (let i = 0; i < btnArr.length; i++) {
    btnArr[i].on('click', function (event) {
      let category = event.currentTarget.textContent.trim();

      console.log(event.currentTarget.textContent.trim());
    })
  }
}

// EVENT LISTENERS -- DOM RENDERING



//ADD INCOME BTN

addIncomeBtn.on('click', function () {
  addTransactionFormDiv.classList.toggle('hidden');
})

// CLOSE FORM BTN

closeFormBtn.on('click', function () {
  event.currentTarget.parentNode.parentNode.classList.toggle('hidden');

})

// CLOSE FORM BTN

closeBtnCategoryForm.on('click', function () {
  event.currentTarget.parentNode.parentNode.classList.toggle('hidden');

})

// LEFT ARROW BTN

leftArrow.on('click', function (event) {
  if (STORE.selectedMonth > 1) {
    STORE.selectedMonth--;
    retrieveBudgetValue()
      .then(renderState);
  } else {
    return;
  }
})

// RIGHT ARROW BTN

rightArrow.on('click', function (event) {;
  if (STORE.selectedMonth < STORE.allMonths.length) {
    STORE.selectedMonth++;
    retrieveBudgetValue()
      .then(renderState);
  } else {
    return;
  }

})


//ADD CATEGORY BTN

addCategoryBtn.on('click', function (event) {
  categoryFormDiv.classList.toggle('hidden');
})

//CATEGORY FORM CATEGORY DROPDOWN

formCategoryDropDown.on('change', function (event) {
  STORE.inputTransactionForm.selectedCategory = event.currentTarget.value;
  renderSubCategories();
})

// CATEGORY FORM SUBCATEGORY DROPDOWN

formSubCategoryDropDown.on('change', function (event) {
  STORE.inputTransactionForm.selectedSubCategory = event.currentTarget.value;
})

//CATEGORY FORM

categoryForm.on('submit', function (event) {
  event.preventDefault();
  addCategory().then(response => {
      if (response.status === 200) {
        alert('Category added to DB succesfully')
      }
      console.log(response)
    })
    .then(retrieveCategories)
    .then(renderState)
    .catch(err => {
      alert('Category already exists')
    })
})

//CLOSE BTN

addMoneyCloseBtn.on('click', function (event) {
  event.currentTarget.parentNode.parentNode.classList.toggle('hidden');
})

//VIEW ALL TRANSACTION BTN

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

//ADD MONEY BTN

addMoneyBtn.on('click', function (event) {
  addMoneyDiv.classList.toggle('hidden');
})

//ADD MONEY FORM

addMoneyForm.on('submit', function (event) {
  event.preventDefault();
  addMoneyToBudget()
    .then(renderState).then(alert('Succesfully added money to budget'));

})

//ADD TRANSACTION FORM

addTransactionForm.on('submit', function (event) {
  event.preventDefault();

  addingTransactionValueToState();
  renderState();
})

//EDIT CATEGORIES BTN

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

// RENDER STATE

function renderState() {
  retrieveBudgetValue();
  displayBudgetValue();
  displayCurrentMonth();
  renderCategories();
  renderTable();
  displayAllTransactions();
  addListenersOnSubcategoryButtons();
}

window.on('load', function (event) {
  retrieveCategories()
    .then(retrieveBudgetValue)
    .then(displayBudgetValue)
    .then(renderState);
})