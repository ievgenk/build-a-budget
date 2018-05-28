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
  selectedMonth: 5,
  allMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  monthlyBudgetData: '',
  categories: [],
  transactions: [],
  CategoryToAdd: '',
  CategoryToDelete: '',
  SubCategoryToDelete: '',
  subCategoryToBeAdded: '',
  inputTransactionForm: {
    selectedCategory: '',
    selectedSubCategory: ''
  },
  budget: 0
}



// FUNCTIONS

//RENDER MAIN BUDGET TABLE

function renderTable() {
  let categoriesArr = STORE.categories;
  let tableHtml = ``;
  mainTable.innerHTML = '';

  categoriesArr.forEach(categoryObj => {
    let categoryHtml =
      `<thead>
  <tr>
    <th class="add-subCategory-icon" data-subCategory ="${categoryObj.name}">${categoryObj.name}
    <i class="far fa-plus-square add-subCategory-btn hidden"></i>
    </th>
    <th>Budgeted</th>
    <th class="th-delete">Spent
    <span class="remove-icon"> <i class="far fa-minus-square hidden"></i></span>
    </th>
  </tr>
</thead>`;

    let subcategoryHtml = categoryObj.listOfSubCategories.map(subcategory => {
      return `<tbody>
  <tr>
    <td>${subcategory.title}</td>
    <td>${subcategory.budgeted}</td>
    <td class="remove-subcategory-td">
    ${subcategory.spent}
    <span class="remove-icon-subcategory"  data-subCategory="${subcategory._id}">
    <i class="far fa-minus-square hidden"></i>
    </span>
    </td>
  </tr>
  </tbody>`;

    }).join('');

    mainTable.innerHTML += categoryHtml;
    mainTable.innerHTML += subcategoryHtml;

  })
}


// SET CURRENT MONTH TO STORE

function setCurrentMonthToStore() {
  STORE.selectedMonth = moment().month()
}

// RETRIEVE MONTHLY BUDGET DATA

function retrieveMontlyBudgetData() {
  return axios({
      url: `${serverURL}/api/monthlyBudget/${STORE.selectedMonth}`,
      method: 'get'
    })
    .then(result => {
      STORE.monthlyBudgetData = result.data;
      STORE.categories = result.data.categories;
      STORE.budget = result.data.budget;
      STORE.transactions = result.data.transactions;
    });
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
    formCategoryDropDown.value = STORE.inputTransactionForm.selectedCategory;
  } catch (err) {
    console.error(err);
  }
}

function displayCurrentMonth() {
  monthDisplay.innerHTML = `<h2>${STORE.allMonths[STORE.selectedMonth]}</h2>`
}

function displayBudgetValue() {
  budgetedMoneyValue.innerHTML = `${STORE.budget}$`
}


//ADD MONEY TO BUDGET

function addMoneyToBudget() {
  STORE.budget += parseInt(moneyValueInput.value);
  return axios({
    url: `${serverURL}/api/monthlyBudget/${STORE.selectedMonth}`,
    method: 'put',
    data: {
      budget: STORE.budget
    }
  })

}


// SET SUBCATEGORIES

function renderSubCategories() {
  const category = STORE.categories.find(category => category.name === STORE.inputTransactionForm.selectedCategory);
  const subCategoryList = category.listOfSubCategories;
  formSubCategoryDropDown.innerHTML = '';
  for (let subCategory of subCategoryList) {
    let newOption = document.createElement('option');
    newOption.setAttribute('value', subCategory.title);
    let subCategoryText = document.createTextNode(subCategory.title);
    newOption.appendChild(subCategoryText);
    formSubCategoryDropDown.appendChild(newOption);
  }
  formSubCategoryDropDown.value = STORE.inputTransactionForm.selectedSubCategory;
}

//

// RETRIEVE CATEGORIES

function retrieveCategories() {
  return axios.get(serverURL + '/api/categories').then(categories => {
    STORE.categories = categories.data
    STORE.inputTransactionForm.selectedCategory = STORE.categories[0].name;
    STORE.inputTransactionForm.selectedSubCategory = STORE.categories[0].listOfSubCategories[0].title;
  })
}

//ADD A NEW CATEGORY

function addCategory() {
  return axios({
    url: `${serverURL}/api/categories`,
    method: 'post',
    data: {
      categoryName: categoryNameInput.value,
      monthId: STORE.monthlyBudgetData._id
    }
  })
}

//ADD TRANSACTION TO DB

function addATransaction() {
  let selectedCat = STORE.categories.find(category => category.name === STORE.inputTransactionForm.selectedCategory)

  let selectSubCatId = selectedCat.listOfSubCategories.find(subCategory => subCategory.title === STORE.inputTransactionForm.selectedSubCategory)._id

  let booleanValue;




  return axios({
    url: `${serverURL}/api/transactions`,
    method: 'post',
    data: {
      subCategory: selectSubCatId,
      value: dollarValueInput.value,

    }
  })
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

// ADDING SUBCATEGORIES TO DB

function saveSubCategoryToDB() {
  STORE.subCategoryToBeAdded = addSubCategoryInput.value;

  let categoryId = STORE.categories.find(category => {
    return category.name === STORE.CategoryToAdd;
  })
  return axios({
    url: `${serverURL}/api/subcategories`,
    method: 'post',
    data: {
      category: categoryId._id,
      title: STORE.subCategoryToBeAdded
    }
  })
}

// DELETING CATEGORIES FROM DB

function deleteCategory() {
  let categoryToDelete = STORE.CategoryToDelete;
  let matchingCategory = STORE.categories.find(category => {
    return category.name === categoryToDelete;
  })
  let categoryId = matchingCategory._id;

  return axios({
    url: `${serverURL}/api/categories/${categoryId}`,
    method: 'delete'
  })
}

// DELETING SUBCATEGORY FROM DB

function deleteSubCategory() {
  let subCategoryToDelete = STORE.SubCategoryToDelete;
  return axios({
    url: `${serverURL}/api/subcategories/${subCategoryToDelete}`,
    method: 'delete'
  })
}


// ADDING EVENT LISTENERS ON ADD SUBCATEGORY BUTTONS

function addListenersOnSubcategoryButtons() {
  let btnArr = document.querySelectorAll('.add-subCategory-icon')
  for (let i = 0; i < btnArr.length; i++) {
    btnArr[i].on('click', function (event) {
      STORE.CategoryToAdd = event.currentTarget.parentNode.firstElementChild.getAttribute("data-subcategory");
      addSubcategoryDiv.classList.toggle('hidden');
    })
  }
}



// EVENT LISTENERS -- DOM RENDERING


//ADD SUBCATEGORY FORM

addSubcategoryForm.on('submit', function (event) {
  event.preventDefault();
  saveSubCategoryToDB()
    .then(retrieveCategories)
    .then(renderState)
})


//ADD INCOME BTN

addIncomeBtn.on('click', function () {
  addTransactionFormDiv.classList.toggle('hidden');
  STORE.inputTransactionForm.selectedSubCategory = '';
})

// CLOSE FORM BTN

addSubcategoryCloseBtn.on('click', function () {
  event.currentTarget.parentNode.parentNode.classList.toggle('hidden');
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
  if (STORE.selectedMonth > 0) {
    STORE.selectedMonth--;
    STORE.inputTransactionForm.selectedSubCategory = '';
    STORE.inputTransactionForm.selectedCategory = '';
    formSubCategoryDropDown.value = STORE.inputTransactionForm.selectedSubCategory;
    renderState();
  } else {
    return;
  }
})

// RIGHT ARROW BTN

rightArrow.on('click', function (event) {;
  if (STORE.selectedMonth < STORE.allMonths.length - 1) {
    STORE.selectedMonth++;
    STORE.inputTransactionForm.selectedSubCategory = '';
    STORE.inputTransactionForm.selectedCategory = '';
    formSubCategoryDropDown.value = STORE.inputTransactionForm.selectedSubCategory;
    renderState();
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
  let selectedSubCategory = STORE.inputTransactionForm.selectedSubCategory;
  selectedSubCategory = STORE.categories.find(category =>
    category.name === event.currentTarget.value
  );
  if (selectedSubCategory.listOfSubCategories.length > 0) {
    selectedSubCategory = selectedSubCategory.listOfSubCategories[0].title
  }
  STORE.inputTransactionForm.selectedSubCategory = selectedSubCategory;
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
  return

})

//EDIT CATEGORIES BTN

editCategoriesBtn.on('click', function (event) {
  const addSubCategoryBtns = document.querySelectorAll('.add-subCategory-btn');
  const deleteCategoryBtns = document.querySelectorAll('.fa-minus-square');
  const tableRemoveIcons = document.querySelectorAll('.remove-icon');
  const subCategoryTableRemoveIcons = document.querySelectorAll('.remove-icon-subcategory');


  for (let i = 0; i < deleteCategoryBtns.length; i++) {
    deleteCategoryBtns[i].classList.toggle('hidden');
  }
  for (let i = 0; i < addSubCategoryBtns.length; i++) {
    addSubCategoryBtns[i].classList.toggle('hidden');
  }

  for (let icon of tableRemoveIcons) {
    icon.on('click', function (event) {
      STORE.CategoryToDelete = event.currentTarget.parentNode.previousElementSibling.previousElementSibling.getAttribute("data-subcategory");
      deleteCategory()
        .then(renderState)
    })
  }

  for (let subCatIcon of subCategoryTableRemoveIcons) {
    subCatIcon.on('click', function (event) {
      STORE.SubCategoryToDelete = event.currentTarget.getAttribute("data-subcategory");
      deleteSubCategory()
        .then(retrieveCategories)
        .then(renderState)
    })
  }

})

// RENDER STATE

function renderState() {
  retrieveMontlyBudgetData()
    .then(displayBudgetValue)
    .then(displayCurrentMonth)
    .then(renderTable)
    .then(addListenersOnSubcategoryButtons)
    .then(renderCategories)
  //renderTable();
  //displayAllTransactions();
  //addListenersOnSubcategoryButtons();

}

window.on('load', function (event) {
  // retrieveCategories()
  //   .then(renderState);
  setCurrentMonthToStore();
  renderState();
})