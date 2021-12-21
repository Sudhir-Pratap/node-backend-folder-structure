const mongoose = require('mongoose')

const connectDB = async databaseURI => {
    const conn = await mongoose.connect(databaseURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
}

module.exports = connectDB
