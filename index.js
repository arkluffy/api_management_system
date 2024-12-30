import express from "express"
import chalk from "chalk"
import {QuickDB} from "quick.db"

const app = express()
const db = new QuickDB();
const port = 3000

app.set("view engine", "ejs");

app.get(`/`,(req,res) =>{
    res.render('index.ejs')
})

await db.get("api").then(async api => {
    for (var i = 0; i < api.length; i++) {
        await db.get(api[i]).then(data => {
            app.get(`/${api[i]}`,(req,res) =>{
                res.status(200).json({success: true,data:data[Math.floor(Math.random() * data.length)]})
            })
        })
    }
})

app.listen(port,() =>{
    console.log(chalk.bgBlue.white.bold(`[${port}]`) + ' ' + chalk.green(`http://localhost:${port}`))
})