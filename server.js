// Modules
const express = require('express');
const app = express();
const config = require('./config');
const mongoose = require('mongoose');
const {
  Budget,
  Year
} = require('./models/budget');

// DataBase Connection
mongoose.connect('mongodb://localhost:27017/BuildABudget')
  .then(() => {
    console.log('Connected to DB sucesfully');
  })
  .catch((err) => {
    console.err(err);
  })



// Middleware
app.use(express.static('public'));

// Server Funcationality

app.get('/budget', (req, res) => {
  Budget.findOne({
      selectedYear: 2018,
      selectedMonth: 5,
    })
    .populate('byYear')
    .then(result => res.send(result))

  // new Year({
  //     year: 2018
  //   }).save()
  //   .then(year =>
  //     new Budget({
  //       selectedYear: 2018,
  //       selectedMonth: 5,
  //       byYear: [year._id]
  //     }).save())
  //   .then(result => res.send(result))




  //     byMonth: {
  //       month: 5,
  //       budget: 2300,
  //       transactions: {
  //         category: 'Bills',
  //         subCategory: 'Freedom Mobile',
  //         value: '120',
  //         positive: false,
  //         negative: true,
  //         description: 'Monthly cell phone bill'
  //       },
  //       categories: {
  //         name: 'Bills',
  //         listOfSubCategories: [{
  //           title: 'Freedom Mobile',
  //           budgeted: 190,
  //           spent: 120
  //         }]
  //       }
  //     }
  //   }
  // })

})

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`)
})


module.exports = {
  app
}