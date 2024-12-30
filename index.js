const express = require('express')
const app = express()
const chalk = require('chalk')

const port = 3000

app.set("view engine", "ejs");

app.get('/',(req,res) =>{
    res.render('index.ejs')
})

app.listen(port,() =>{
    console.log(chalk.bgBlue.white(`[${port}]`) + ' ' + chalk.green(`http://localhost:${port}`))
})