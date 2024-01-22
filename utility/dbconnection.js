const mongoose = require('mongoose');
require('dotenv').config()

const dbconnect = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log('Databse Connected successfully...')
    } catch (error) {
        console.log(error)
    }
}

module.exports = dbconnect