const mongoose = require('mongoose')

const db = mongoose.connection

const connectToDB = () => {
  mongoose.connect('mongodb://localhost:27017/manager_test')

  db.on('error', error => {
    console.error('Database connection error!')
    throw error
  })

  db.once('connected', () => console.log('Connected to database'))
}
module.exports = { connectToDB }
