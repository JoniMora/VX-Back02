const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://<user>:<password>@c<cluster>.xugxw6p.mongodb.net/vx-back02?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
})