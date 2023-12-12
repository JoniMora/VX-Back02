const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://devMora:leg.100462@cluster0.xugxw6p.mongodb.net/vx-back02?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
})