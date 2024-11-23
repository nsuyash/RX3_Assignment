const mongoose = require('mongoose')
require("dotenv").config();

const mongoUrl = process.env.MONGODB_URL

const initializeDatabase = async () => {
  try {
    const connected = await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    if(connected){
      console.log('Connected Successfully.')
    }
  } catch (error) {
    console.log('Connection failed', error)
  }
}

module.exports = { initializeDatabase }