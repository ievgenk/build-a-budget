// NAVBAR TOGGLE
const sideNav = document.querySelector('.mdl-layout__drawer')
const loginTab = document.querySelector('.login-title');
const loginTabTitle = document.querySelector('.login-h3')
const registerTabTitle = document.querySelector('.signup-h3')
const registerTab = document.querySelector('.register-title');


document.addEventListener('DOMContentLoaded', function () {
  signupForm.classList.add('hide')
  loginTabTitle.classList.add('form-border');
})


function toggleDrawerOnClick() {
  let drawer = document.querySelector('.mdl-layout')

  drawer.MaterialLayout.toggleDrawer()
}


sideNav.on('click', function (event) {
  if (event.target.classList.contains('mdl-navigation__link')) {
    toggleDrawerOnClick();
  }
})

registerTab.on('click', function (event) {
  if (registerTabTitle.classList.contains('form-border') && loginForm.classList.contains('hide')) {
    return;
  } else {
    loginTabTitle.classList.toggle('form-border');
    loginForm.classList.toggle('hide');
    registerTabTitle.classList.toggle('form-border');
    signupForm.classList.toggle('hide');
  }
})

loginTab.on('click', function (event) {
  if (loginTabTitle.classList.contains('form-border') && signupForm.classList.contains('hide')) {
    return;
  } else {
    loginTabTitle.classList.toggle('form-border');
    loginForm.classList.toggle('hide');
    registerTabTitle.classList.toggle('form-border');
    signupForm.classList.toggle('hide');
  }
})