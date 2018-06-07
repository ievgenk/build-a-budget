const serverURL = 'http://127.0.0.1:8080'

// TOATSTR
toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-center",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "2000",
  "timeOut": "2000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

// STATE

const STORE = {
  activeUserId: localStorage.getItem('userId'),
  selectedMonth: 5,
  allMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  monthlyBudgetData: '',
  allSubcategories: [],
  totalSpentPerCat: [],
  totalSpentPerCatTitles: [],
  mainAreaMode: 'budget',
  categories: [],
  categoriesTotalSpent: [],
  transactions: [],
  transactionToBeDeleted: {},
  CategoryToAdd: '',
  CategoryToDelete: '',
  SubCategoryToDelete: '',
  SubCategoryToDeleteBudgeted: 0,
  subCategoryToBeAdded: '',
  inputTransactionForm: {
    selectedCategory: '',
    selectedSubCategory: ''
  },
  budget: 0
}



// FUNCTIONS

//RENDER MAIN BUDGET TABLE

function renderMainArea() {
  switch (STORE.mainAreaMode) {
    case 'budget':
      {
        transactionListDiv.classList.add('hidden');
        doughnutChart.classList.add('hidden');
        mainTable.classList.remove('hidden');
        categoriesHeader.classList.remove('hidden');
        break;
      }
    case 'transactions':
      {
        transactionListDiv.classList.remove('hidden');
        doughnutChart.classList.add('hidden');
        mainTable.classList.add('hidden');
        categoriesHeader.classList.add('hidden');
        break;
      }
    case 'chart':
      {
        transactionListDiv.classList.add('hidden');
        doughnutChart.classList.remove('hidden');
        mainTable.classList.add('hidden');
        categoriesHeader.classList.add('hidden');
        break;
      }
    default:
      throw new Error(`Invalid main area mode: ${STORE.mainAreaMode}`)
  }
}

function renderTable() {
  let categoriesArr = STORE.categories;
  let tableHtml = ``;
  mainTable.innerHTML = '';

  categoriesArr.forEach(categoryObj => {
    let categoryHtml =
      `<thead>
  <tr>
    <th class="add-subCategory-icon" data-subCategory ="${categoryObj.name}">Category - ${categoryObj.name}
    <i class="far fa-plus-square add-subCategory-btn hidden"></i>
    </th>
    <th>Money Budgeted</th>
    <th class="th-delete">Money Spent
    <span class="remove-icon"> <i class="far fa-minus-square hidden"></i></span>
    </th>
  </tr>
</thead>`;

    let subcategoryHtml = categoryObj.listOfSubCategories.map(subcategory => {
      return `<tbody>
  <tr>
    <td>${subcategory.title}</td>
    <td>${parseFloat(subcategory.budgeted).toFixed(2)}</td>
    <td class="remove-subcategory-td">
    ${parseFloat(subcategory.spent).toFixed(2)}
    <span class="remove-icon-subcategory"  data-subCategory="${subcategory._id}" data-valueSubCategory="${subcategory.budgeted}" data-transaction-vale>
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

// ADDING ALL SUBCATEGORIES TO THE STORE

function addAllSubcategoriesToStore() {
  STORE.allSubcategories = [];
  STORE.categories.forEach(category => {
    for (let subCategory of category.listOfSubCategories) {
      STORE.allSubcategories.push(subCategory)
    }
  })
}

// RETRIEVE MONTHLY BUDGET DATA

function retrieveMontlyBudgetData() {
  if (STORE.activeUserId.length > 1) {}
  return axios({
      url: `${serverURL}/api/monthlyBudget/${STORE.selectedMonth}`,
      method: 'get',
      headers: {
        'authorization': localStorage.getItem('token')
      }
    })
    .then(result => {
      STORE.monthlyBudgetData = result.data;
      STORE.categories = result.data.categories;
      STORE.budget = result.data.budget;
      STORE.transactions = result.data.transactions;
    })
    .then(() => {
      if (STORE.categories.length > 0) {
        STORE.inputTransactionForm.selectedCategory = STORE.categories[0].name;
        if (STORE.categories[0].listOfSubCategories.length > 0) {
          STORE.inputTransactionForm.selectedSubCategory = STORE.categories[0].listOfSubCategories[0].title;
        }
      }

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
  monthDisplay.innerHTML = `<h2>${STORE.allMonths[STORE.selectedMonth]} </h2><h2>${moment().format("YYYY")}</h2>`
}

function displayBudgetValue() {
  budgetedMoneyValue.innerHTML = `<p>Your Budget:</p>$${parseFloat(STORE.budget).toFixed(2)}`
}


//ADD MONEY TO BUDGET

function addMoneyToBudget() {
  STORE.budget += parseInt(moneyValueInput.value);
  return axios({
    url: `${serverURL}/api/monthlyBudget/${STORE.selectedMonth}`,
    method: 'put',
    data: {
      budget: STORE.budget
    },
    headers: {
      'authorization': localStorage.getItem('token')
    }
  })

}


// RENDER SUBCATEGORIES TO INPUT TRANSACTION FORM

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

// RENDER SUBCATEGORIES TO BUDGET MONEY FORM

function renderSubCategoriesBudgetForm() {
  subCategoryBudgeFormDrop.innerHTML = '';
  for (let subCategory of STORE.allSubcategories) {
    let newOption = document.createElement('option');
    newOption.setAttribute('value', subCategory.title);
    let subCategoryText = document.createTextNode(subCategory.title);
    newOption.appendChild(subCategoryText);
    subCategoryBudgeFormDrop.appendChild(newOption);
  }
}


// DISTRIBUTE BUDGETED MONEY TO A SUBCATEGORY

function distributeBudgetedMoney() {
  let matchingSubCategory = STORE.allSubcategories.find(subCategory => subCategory.title === subCategoryBudgeFormDrop.value)
  let subCategoryId = matchingSubCategory._id

  if (STORE.budget < parseInt(subCategoryBudgetFormValue.value)) {
    return alert('Insufficient fund to transfer')
  }

  return axios({
    url: `${serverURL}/api/monthlyBudget`,
    method: 'put',
    data: {
      monthId: STORE.monthlyBudgetData._id,
      subCategoryId: subCategoryId,
      value: parseInt(subCategoryBudgetFormValue.value)
    },
    headers: {
      'authorization': localStorage.getItem('token')
    }
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
    },
    headers: {
      'authorization': localStorage.getItem('token')
    }
  })
}

//ADD TRANSACTION TO DB

function addATransaction() {
  let selectedCat = STORE.categories.find(category => category.name === STORE.inputTransactionForm.selectedCategory);

  let selectedCatName = selectedCat.name

  let selectSubCatName = selectedCat.listOfSubCategories.find(subCategory => subCategory.title === STORE.inputTransactionForm.selectedSubCategory).title

  let subCategoryId = selectedCat.listOfSubCategories.find(subCategory => subCategory.title === STORE.inputTransactionForm.selectedSubCategory)._id;

  let dollarValue;


  if (radioNegative.checked === true) {
    dollarValue = -(parseFloat(dollarValueInput.value).toFixed(2));
  } else if (radioPositive.checked === true) {
    dollarValue = parseFloat(dollarValueInput.value).toFixed(2);
  }

  let briefDescription = briefDescriptionInput.value;


  return axios({
    url: `${serverURL}/api/transactions`,
    method: 'post',
    data: {
      subCategoryId: subCategoryId,
      category: selectedCatName,
      subCategory: selectSubCatName,
      value: dollarValue,
      description: briefDescription,
      monthId: STORE.monthlyBudgetData._id
    },
    headers: {
      'authorization': localStorage.getItem('token')
    }
  })
}


//DISPLAY ALL TRANSACTIONS

function displayAllTransactions() {
  const transactionArr = STORE.monthlyBudgetData.transactions;
  let transactionsHTML = '';

  if (transactionArr.length < 1) {
    return transactionTable.innerHTML = `<h1>No transactions posted this month.</h1>`
  }

  let transactionProperties = Object.keys(transactionArr[0]);
  transactionsHTML += `<thead>
  <tr>
    <th>Category
    </th>
    <th>Subcategory</th>
    <th>
    Value
    </th>
    <th>
    Description
    </th>
  </tr>
</thead>`
  for (let transaction of transactionArr) {
    transactionsHTML +=
      `<tbody>
        <tr>
          <td>${transaction.category}</td>
          <td>${transaction.subCategory}</td>
          <td>${transaction.value}</td>
          <td class="delete-btn-transaction-td" data-transactionId="${transaction._id}"data-transactionSubCategory="${transaction.subCategory}" data-transaction-value="${transaction.value}"><span>${transaction.description}</span>
          <button class="remove-transaction"><i class="far fa-minus-square"></i></button>
          </td>
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
    },
    headers: {
      'authorization': localStorage.getItem('token')
    }
  })
}

// DELETING CATEGORIES FROM DB

function deleteCategory() {
  let categoryToDelete = STORE.CategoryToDelete;
  let matchingCategory = STORE.categories.find(category => {
    return category.name === categoryToDelete;
  })
  let totalValue = 0;
  matchingCategory.listOfSubCategories.forEach(subCategory => {
    return totalValue += subCategory.budgeted;
  })

  let categoryId = matchingCategory._id;

  let arrOfSubCatIds = matchingCategory.listOfSubCategories.map(subCategory => {
    return subCategory._id
  })



  return axios({
    url: `${serverURL}/api/categories/${categoryId}`,
    method: 'delete',
    data: {
      monthId: STORE.monthlyBudgetData._id,
      value: totalValue,
      subCatArr: arrOfSubCatIds
    },
    headers: {
      'authorization': localStorage.getItem('token')
    }
  })
}

// DELETING SUBCATEGORY FROM DB

function deleteSubCategory() {
  let subCategoryToDelete = STORE.SubCategoryToDelete;
  let subCategoryToDeleteBudgeted = STORE.SubCategoryToDeleteBudgeted;
  return axios({
    url: `${serverURL}/api/subcategories/${subCategoryToDelete}`,
    method: 'delete',
    data: {
      monthID: STORE.monthlyBudgetData._id,
      budgeted: subCategoryToDeleteBudgeted
    },
    headers: {
      'authorization': localStorage.getItem('token')
    }
  })
}

// DELETING TRANSACTION FROM DB

function deleteTransaction() {
  return axios({
    url: `${serverURL}/api/transactions/${STORE.transactionToBeDeleted.id}`,
    method: 'delete',
    data: {
      monthID: STORE.monthlyBudgetData._id,
      subCategory: STORE.transactionToBeDeleted.subCategory,
      value: parseFloat(STORE.transactionToBeDeleted.value)
    },
    headers: {
      'authorization': localStorage.getItem('token')
    }
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


// ADDING EVENT LISTENERS ON DELETE TRANSACTION BTNS

function addListenersDeleteTransaction() {
  document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-transaction')) {
      STORE.transactionToBeDeleted.id = event.target.parentNode.getAttribute("data-transactionId")
      let subCategoryTitle = event.target.parentNode.getAttribute("data-transactionSubCategory")
      STORE.transactionToBeDeleted.value = event.target.parentNode.getAttribute("data-transaction-value")


      let subCat = STORE.allSubcategories.find(subcategory => {
        return subcategory.title === subCategoryTitle;
      })
      if (subCat === undefined) {
        STORE.transactionToBeDeleted.subCategory = undefined
      } else {
        STORE.transactionToBeDeleted.subCategory = subCat._id
      }
      console.log('Delete Transaction')
      deleteTransaction()
        .then(refreshState)
    }
  })
}


// REFRESH STATE

function refreshState() {
  return retrieveMontlyBudgetData()
    .then(renderState)
}

// EVENT LISTENERS -- DOM RENDERING

// FORM CHECKBOXES


// SPENDING DATA BTN

spendingDataBtn.on('click', function (event) {
  if (STORE.mainAreaMode === 'chart') {
    STORE.mainAreaMode = 'budget'
  } else {
    STORE.mainAreaMode = 'chart'
    removeExistingChart();
    categoriesTotalSpent()
    drawAChart();
  }
  renderMainArea();
})

// Log Out Btn

logOutBtn.on('click', function (event) {
  localStorage.clear()
})

//Money Budget Div

moneyBudgetedDiv.on('click', function (event) {
  moneyBudgetFormDiv.classList.toggle('hidden');
})

// MONEY BUDGET DIV CLOSE BTN

closeBtnBudgetMoney.on('click', function (event) {
  event.currentTarget.parentNode.parentNode.classList.toggle('hidden');
})

//ADD SUBCATEGORY FORM

addSubcategoryForm.on('submit', function (event) {
  event.preventDefault();
  saveSubCategoryToDB()
    .then(result => {
      if (result.status === 200) {
        addSubcategoryDiv.classList.toggle('hidden');
        toastr.success('New subcategory was successfully created')
      }
    })
    .then(refreshState)
})


//ADD INCOME BTN

addIncomeBtn.on('click', function () {
  renderSubCategories();
  addTransactionFormDiv.classList.toggle('hidden')
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
    STORE.allSubcategories = [];
    STORE.totalSpentPerCat = [];
    STORE.totalSpentPerCatTitles = [];
    refreshState()
      .then(removeExistingChart)
      .then(categoriesTotalSpent)
      .then(drawAChart)
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
    STORE.allSubcategories = [];
    STORE.totalSpentPerCat = [];
    STORE.totalSpentPerCatTitles = [];
    refreshState()
      .then(removeExistingChart)
      .then(categoriesTotalSpent)
      .then(drawAChart)

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
        toastr.success('New category was successfully added you your budget.')
        categoryFormDiv.classList.toggle('hidden')
        categoryNameInput.value = ''
        STORE.totalSpentPerCat = [];
        STORE.totalSpentPerCatTitles = [];
        STORE.categoriesTotalSpent = [];
      }
    })
    .then(refreshState)
    .catch(err => {
      toastr.error('Category was not added to your budget.')
      console.log(err)
    })
})

// ALLOCATE BUDGETED MONEY FORM

allocateBudgetedMoneyForm.on('submit', function (event) {
  event.preventDefault();

  distributeBudgetedMoney()
    .then(result => {
      console.log(result)
      if (result.status === 204) {
        moneyBudgetFormDiv.classList.toggle('hidden')
        toastr.success('You succesfully re-destributed money.')

      }
    })
    .then(refreshState)
})

//CLOSE BTN

addMoneyCloseBtn.on('click', function (event) {
  event.currentTarget.parentNode.parentNode.classList.toggle('hidden');
})

//VIEW ALL TRANSACTION BTN

viewAllTransactionsBtn.on('click', function (event) {
  if (STORE.mainAreaMode === 'transactions') {
    STORE.mainAreaMode = 'budget'
  } else {
    STORE.mainAreaMode = 'transactions'
    displayAllTransactions();
  }
  renderMainArea();
})

//ADD MONEY BTN

addMoneyBtn.on('click', function (event) {
  addMoneyDiv.classList.toggle('hidden');
})

//ADD MONEY FORM

addMoneyForm.on('submit', function (event) {
  event.preventDefault();
  addMoneyToBudget()
    .then(result => {
      if (result.status = 200) {
        toastr.success('Money was successfully added to your budget.')
      }
    })
    .then(refreshState)
    .then(() => {
      moneyValueInput.value = ''
      addMoneyDiv.classList.toggle('hidden')
    });
})

//ADD TRANSACTION FORM

addTransactionForm.on('submit', function (event) {
  event.preventDefault();
  addATransaction()
    .then(transaction => {
      if (transaction.status === 200) {
        STORE.totalSpentPerCat = [];
        STORE.totalSpentPerCatTitles = [];
        STORE.categoriesTotalSpent = [];
        addTransactionFormDiv.classList.toggle('hidden')
        toastr.success('You have successfully added a new transaction.')
      }
    })
    .then(categoriesTotalSpent)
    .then(refreshState)
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
        .then(refreshState)
    })
  }

  for (let subCatIcon of subCategoryTableRemoveIcons) {
    subCatIcon.on('click', function (event) {
      STORE.SubCategoryToDelete = event.currentTarget.getAttribute("data-subcategory");
      STORE.SubCategoryToDeleteBudgeted = parseFloat(event.currentTarget.getAttribute("data-valueSubCategory")).toFixed(2);
      deleteSubCategory()
        .then(refreshState)
    })
  }



})

// RENDER STATE

function renderState() {
  displayBudgetValue();
  displayCurrentMonth();
  renderTable();
  addListenersOnSubcategoryButtons();
  renderCategories();
  addAllSubcategoriesToStore();
  renderSubCategoriesBudgetForm()
  displayAllTransactions();
  renderMainArea();
}

window.on('load', function (event) {
  addListenersDeleteTransaction();
  setCurrentMonthToStore();
  refreshState();
})