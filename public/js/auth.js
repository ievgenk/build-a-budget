const loginForm = document.querySelector('.login');
const loginFormEmail = document.querySelector('#email');
const loginFormPassword = document.querySelector('#password');
const signupForm = document.querySelector('.signup');
const signupFormEmail = document.querySelector('#emailSignup');
const signupFormPassword = document.querySelector('#passwordSignup');



function loginUser() {
  return axios({
    method: 'post',
    url: `${serverURL}/api/user/login`,
    data: {
      email: loginFormEmail.value,
      password: loginFormPassword.value
    }
  })
}

function signupUser() {
  return axios({
    method: 'post',
    url: `${serverURL}/api/user/signup`,
    data: {
      email: signupFormEmail.value,
      password: signupFormPassword.value
    }
  })
}





window.on('load', function (event) {
  loginForm.on('submit', function (event) {
    event.preventDefault();
    loginUser()
      .then(user => {
        localStorage.setItem('token', user.data.token)
        localStorage.setItem('userId', user.data.user)
        if (user.status === 200) {
          document.location.href = user.data.redirect
        }
      })
      .catch(error => {
        toastr.error('Ooops something happened, authentication failed.')
      })
  })

  signupForm.on('submit', function (event) {
    event.preventDefault();
    signupUser()
      .then(newUser => {
        if (newUser.status === 201) {
          toastr.success('You have successfully signed-up.')
        }
        signupFormEmail.value = ''
        signupFormPassword.value = ''
      })
      .catch(error => {
        toastr.error('Ooops something happened, we could not create this user.')
      })
  })
})