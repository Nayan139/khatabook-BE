const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URL, 
    {
        useNewUrlParser: true,
    }
)

const con = mongoose.connection

con.on("open", () => {
    console.log('DB successfully connected...')
})