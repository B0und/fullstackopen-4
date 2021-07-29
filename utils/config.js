require('dotenv').config()

const PORT = process.env.PORT || 3003
const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ps8p8.mongodb.net/phonebook?retryWrites=true&w=majority`


module.exports = {
  MONGODB_URI,
  PORT
}