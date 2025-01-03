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

await db.get('api').then( endpoints => {
    for(var i = 0; i < endpoints.length; i++){
        app.get(`/${endpoints[i]}`, async (req,res) =>{
            var requested = req.originalUrl.slice(1)
            var data = await retrievedata(requested)
            if(data.length === 0){
                res.status(200).json({success: true,data:null})
               }else{
                   res.status(200).json({success: true,data:data[Math.floor(Math.random() * data.length)]})
               }
        })
    }
})

app.post(`/createendpoint`,async (req,res) => {
        db.get("api").then(async api => {
            if(api == null){
                createendpoint(req.body.endpoint)
                res.status(200).json({success:'successfully added to queue'})
            }else{
            if(api.includes(req.body.endpoint)){
                res.status(400).json({error:"endpoint already exists or is in queue"})
            }else{
                createendpoint(req.body.endpoint)
                res.status(200).json({success:'successfully added to queue'})
            }}
        })
})

app.post(`/adddata`, async (req,res) => {
    const data = {
        "endpoint":req.body.endpoint,
        "data":req.body.data
    }
    await db.get(data.endpoint).then(arr => {
        if(arr.includes(data.data)){
            res.status(400).json({error:'data already exists in endpoint'})
        }else{
            db.push(data.endpoint,data.data)
            res.status(200).json({success:'data successfully added'})
        }
    })
})



async function createendpoint(endp){
    db.push(`api`,endp)
    await db.set(endp,[])
        app.get(`/${endp}`,async (req,res) =>{
            await db.get(endp).then(async data => {
                var requested = req.originalUrl.slice(1)
                var data = await retrievedata(requested)
                if(data.length === 0){
                    res.status(200).json({success: true,data:null})
                   }else{
                       res.status(200).json({success: true,data:data[Math.floor(Math.random() * data.length)]})
                   }
        })
    })
}

async function retrievedata(endp){
    var data = await db.get(endp)
    return data;
}


app.listen(port,() =>{
    console.log(chalk.bgBlue.white.bold(`[${port}]`) + ' ' + chalk.green(`http://localhost:${port}`))
})