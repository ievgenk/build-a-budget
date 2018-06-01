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
        console.log(user)
        if (user) {
          document.location.href = user.data.redirect
        }

      })
      .catch(error => {
        console.log(`User could not be logged in. ERROR:${error}`)
      })
  })

  signupForm.on('submit', function (event) {
    event.preventDefault();
    signupUser()
      .then(newUser => {
        console.log(newUser)
        signupFormEmail.value = ''
        signupFormPassword.value = ''
      })
      .catch(error => {
        console.log(`User could not be created. ERROR: ${error}`)
      })
  })
})