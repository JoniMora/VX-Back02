const express = require('express')
require('./db/mongoose')
const swaggerUI = require('swagger-ui-express')
const swaggerSpec = require('./config/swaggerConfig')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

app.use(express.json())

app.use(require('./routes/appointment'))
app.use(require('./routes/auth'))
app.use(require('./routes/doctors'))
app.use(require('./routes/specialties'))

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})