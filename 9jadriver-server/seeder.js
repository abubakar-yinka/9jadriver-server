const mongoose = require('mongoose')
const dotenv = require('dotenv')
const User = require('./models/userModel')
const Account = require('./models/accountModel')
const users = require('./data/users')
const connectDB = require('./config/db')

dotenv.config()

connectDB()

const importData = async () => {
    try {
        await User.deleteMany()
        await Account.deleteMany()
        const createdUsers = await User.insertMany(users)
        const adminUsers = createdUsers[0]._id

        // const userAccount = Account.map(account => {
        //     return {...account, userId: adminUsers}
        // })
        // await Account.insertMany(userAccount)

        console.log(`Data Imported. Admin users: ${adminUsers}`)
        process.exit()
    } catch (error) {
        console.error(`${error}`)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await User.deleteMany()
        await Account.deleteMany()

        console.log('Data Destroyed')
        process.exit()
    } catch (error) {
        console.error(`${error}`)
        process.exit(1)
    }
}

if (process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}