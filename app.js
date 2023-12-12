const express = require('express')
require('./db/mongoose')

app.use('/auth', require('./routes/auth'))

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

// const bcrypt = require('bcryptjs')

// const myFunction = async () => {
//     const password = 'testPass1'
//     const hashedPassword = await bcrypt.hash(password, 8)

//     console.log(password)
//     console.log(hashedPassword)

//     const isMatch = await bcrypt.compare('testPass1', hashedPassword)
//     console.log(isMatch)
// }

// myFunction()