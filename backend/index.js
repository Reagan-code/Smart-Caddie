const express = require("express")
app = express()
require("dotenv").config()
app.use(express.json())
const mongo= require("./models/mongo");
mongo()

app.get('get', (req, res) => {
    book.Model.find()
    .then(result => res.json(result))
    .catch(err => res.json(err))
})
app.post('add', (req, res) => {
    const book = req.body.book;
    book.Model.create()
    book:book
})
    .then(result => res.json(result))
    .catch(err => res.json(err))
    
const port = process.env.PORT || 4000
app.listen(port, ()=> console.log(`port connected ${port}`) )