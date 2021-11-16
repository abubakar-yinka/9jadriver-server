const bcrypt = require('bcryptjs')

const drivers = [
    {
        firstName: 'Abubakar',
        lastName: 'Ibrahim',
        email: 'aibrahim332@stu.ui.edu.ng',
        password: bcrypt.hashSync('123456', 10),
        phoneNumber: '+2347085897656'
    },
    {
        firstName: 'Maryam',
        lastName: 'Mudasiru',
        email: 'maryammudasiru@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        phoneNumber: '+2347085897656'
    },
    {
        firstName: 'Robiat',
        lastName: 'Azeez',
        email: 'rbeeazeez@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        phoneNumber: '+2347085897656'
    },
    {
        firstName: 'Gafar',
        lastName: 'Akinkunmi',
        email: 'lordsirkunle001@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        phoneNumber: '+2347085897656'
    },
    {
        firstName: 'Oyebolade',
        lastName: 'Oladokun',
        email: 'oyeboladeoluwaferanmi@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        phoneNumber: '+2347085897656'
    },
]

module.exports = drivers