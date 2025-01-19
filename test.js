import axios from "axios"


await axios.get('http://localhost:3000/1', {
    headers: {
        'Authorization': 'F1kZ11km0Xk7AtOfLQdZyCH7VbXSbyFvJb0KRga6DOuuCMnze'
    }
})
.then((res) => {
    console.log(res.data)
})
.catch((err) => console.error(err));