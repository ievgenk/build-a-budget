//DOM
const budgetedMoneyValue = document.querySelector('.money-budgeted-value');
const monthDisplay = document.querySelector('.month');
const mainTable = document.querySelector('.striped-table');
const categoriesHeader = document.querySelector('#categories-header')
const loader = document.querySelector('.cssload-thecube');
// DIVs
const addTransactionFormDiv = document.querySelector('.add-transaction-div');
const mainDiv = document.querySelector('main');
const categoryFormDiv = document.querySelector('.add-category-div');
const addMoneyDiv = document.querySelector('.add-money-div');
const transactionListDiv = document.querySelector('.all-transactions-div');
const addSubcategoryDiv = document.querySelector('.add-subCategory-div');
const moneyBudgetedBtns = document.querySelectorAll('.money-budgeted');
const moneyBudgetFormDiv = document.querySelector('.budget-money-form-div');
// BTNs
const addIncomeBtns = document.querySelectorAll('.income-btn');
const closeFormBtn = document.querySelector('.close-btn');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const addCategoryBtns = document.querySelectorAll('.add-category');
const addMoneyBtns = document.querySelectorAll('.add-money-btn');
const addMoneyCloseBtn = document.querySelector('#add-money-close-btn');
const addSubcategoryCloseBtn = document.querySelector('#add-subCategory-close-btn');
const radioNegative = document.querySelector('#negative');
const radioPositive = document.querySelector('#positive');
const viewAllTransactionsBtn = document.querySelector('.view-all-transactions');
const editCategoriesBtns = document.querySelectorAll('.edit-categories');
const closeBtnBudgetMoney = document.querySelector('.close-btn-budget-money');
const logOutBtn = document.querySelector('.log-out');
const spendingDataBtn = document.querySelector('.spending-data');
const budgetTableBtn = document.querySelector('.budget-table');
const resetBudgetBtns = document.querySelectorAll('.resetBudget-btn');




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
const addSubcategoryForm = document.querySelector('.add-subCategory-form');
const addSubCategoryInput = document.querySelector('#subCategory-title');
const subCategoryBudgeFormDrop = document.querySelector('#subcategory-budget-money-dropdown');
const subCategoryBudgetFormValue = document.querySelector('#subcategory-value');
const allocateBudgetedMoneyForm = document.querySelector('.budget-money-form');


// CHARTS
const chartsDiv = document.querySelector('.charts')
const doughnutChart = document.querySelector('#doughnut-chart');