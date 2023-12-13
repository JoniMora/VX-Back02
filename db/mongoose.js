const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://<user>:<password>@<cluster>.mongodb.net/vx-back02?retryWrites=true&w=majority`, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true 
})