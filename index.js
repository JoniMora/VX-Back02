const express = require('express')
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/doctors'))

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})