import axios from "axios"
import db from "./index.js"
import QuickDB from "quick.db"

await axios.get('http://localhost:3000/fact').then((response) => {
    console.log(response.data)
})

