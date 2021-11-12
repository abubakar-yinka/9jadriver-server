const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Driver = require('./models/driverModel')
const Account = require('./models/accountModel')
const drivers = require('./data/drivers')
const connectDB = require('./config/db')

dotenv.config()

connectDB()

const importData = async () => {
    try {
        await Driver.deleteMany()
        await Account.deleteMany()
        const createdDrivers = await Driver.insertMany(drivers)
        const adminDrivers = createdDrivers[0]._id

        // const userAccount = Account.map(account => {
        //     return {...account, userId: adminUsers}
        // })
        // await Account.insertMany(userAccount)

        // console.log(`Data Imported. Admin users: ${adminUsers}`)
        process.exit()
    } catch (error) {
        console.error(`${error}`)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await Driver.deleteMany()
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