import express from "express"
import chalk from "chalk"
import {QuickDB} from "quick.db"

const app = express()
const db = new QuickDB();
const port = 3000

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended:false }));

app.get(`/`,(req,res) =>{
    res.render('index.ejs')
})

// db.set('api',[])
// db.set('newendpoints',[])
    await db.get("api").then(async api => {
        for (var i = 0; i < api.length; i++) {
            await db.get(api[i]).then(data => {
                    app.get(`/${api[i]}`,(req,res) =>{
                        if(data.length === 0){
                            res.status(200).json({success: true,data:null})
                        }else{
                            res.status(200).json({success: true,data:data[Math.floor(Math.random() * data.length)]})
                        }
                    })
            })
        }
    })


app.post(`/createendpoint`,async (req,res) => {
    db.get('newendpoints').then(async newapi => {
        db.get("api").then(async api => {
            if(newapi.includes(req.body.endpoint) || api.includes(req.body.endpoint)){
                res.status(400).json({error:"endpoint already exists or is in queue"})
            }else{
                createendpoint(req.body.endpoint)
                res.status(200).json({success:'successfully added to queue'})
            }
        })
    })
})



async function createendpoint(endp){
    db.push(`api`,endp)
    await db.set(endp,[])
    await db.get(endp).then(data => {
        app.get(`/${endp}`,(req,res) =>{
            if(data.length === 0){
             res.status(200).json({success: true,data:null})
            }else{
                res.status(200).json({success: true,data:data[Math.floor(Math.random() * data.length)]})
            }
        })
    })
}


app.listen(port,() =>{
    console.log(chalk.bgBlue.white.bold(`[${port}]`) + ' ' + chalk.green(`http://localhost:${port}`))
})