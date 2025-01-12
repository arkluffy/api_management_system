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

// create api key system
await db.get('api').then( endpoints => {
    if(endpoints !== null){
       for(var i = 0; i < endpoints.length; i++){
        app.get(`/${endpoints[i]}`, async (req,res) =>{
            var requested = req.originalUrl.slice(1)
            var data = await retrievedata(requested)
            console.log(chalk.bgBlue.white.bold(`[/${requested}]`) + ' ' + chalk.green('data successfully provided'))
            if(data.length === 0){
                res.status(200).json({success: true,data:null})
               }else{
                   res.status(200).json({success: true,data:data[Math.floor(Math.random() * data.length)]})
               }
        })
    }}
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

app.post(`/generateapikey`, (req,res) => {
    const retrieveddata = {
        "endp": req.body.endpoint
    }
    var apikey = Math.random().toString(36).substr(2,50)
    db.push(`${retrievedata.endp}.apikeys`,apikey)
    console.log(apikey)
    res.status(200).json({success:"api key successfully added", apikey})
})

app.post(`/adddata`, async (req,res) => {
    const linkdata = {
        "endpoint":req.body.endpoint,
        "data":req.body.data
    }
    console.log(chalk.bgBlue.white.bold(`[${linkdata.endpoint}]` + ' ' + chalk.green(`${linkdata.data}`)))
    var data = await retrievedata(linkdata.endpoint)
        if(data.includes(linkdata.data)){
            res.status(400).json({error:'data already exists in endpoint'})
        }else{
            console.log(linkdata.data)
            db.push(linkdata.endpoint + ".data",linkdata.data)
            res.status(200).json({success:'data successfully added'})
        }
})



async function createendpoint(endp){
    db.push(`api`,endp)
    
    console.log(chalk.bgBlue.white.bold(`[/createendpoint]`) + ' ' + chalk.green(`${endp} created`))
    await db.set(endp,{apikeys:[],data:[]})
        app.get(`/${endp}`,async (req,res) =>{
            await db.get(endp.data).then(async data => {
                var requested = req.originalUrl.slice(1)
                var data = await retrievedata(requested)
                if(data === null){
                    res.status(200).json({success: true,data:null})
                   }else{
                       res.status(200).json({success: true,data:data[Math.floor(Math.random() * data.length)]})
                   }
        })
    })
}

async function retrievedata(endp){
    console.log(endp)
    var data = await db.get(endp + ".data")
    console.log(data)
    return data;

}

app.listen(port,() =>{
    console.log(chalk.bgBlue.white.bold(`[${port}]`) + ' ' + chalk.green(`http://localhost:${port}`))
})

