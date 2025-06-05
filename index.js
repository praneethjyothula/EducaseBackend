const express = require('express');

const {open} = require('sqlite');


const app = express()


const cors = require('cors')
app.use(express.json())

app.use(cors())
const path = require('path')


const sqlite3 = require('sqlite3')

const bcrypt = require('bcrypt')


const dbPath = path.join(__dirname,'test.db');

let db = null;

const intitalize = async() =>{

    try {
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database

        })

        app.listen(5000,() =>{
            console.log('SERVER IS RUNNING AT http://localhost:5000')
        })
        
    } catch (error) {

        console.log(error)
        
    }

}


app.post('/register',async(request,response) =>{

    


    const {data} = request.body

    const {id,name,number,email,password,company} = data

    
    const get_query =   `SELECT * FROM user WHERE email = '${email}' `

    const get_result = await db.get(get_query)

    if(get_result === undefined){

        const hased_password = await bcrypt.hash(password,10)


        const post_query = `INSERT INTO user (id,full_name,phone_number,email,password,company_name)VALUES
        ('${id}','${name}',${number},'${email}','${hased_password}','${company}')
        `

        const post_result= await db.run(post_query)
        
        response.send('USER DETAILS POSTED')

    }else{
        response.send('USER ALREADY EXIST')
    }
})



app.post('/login',async(request,response) =>{

    const {data} = request.body
    const {emailData,passData} = data
    
    

    const get_query =   `SELECT * FROM user WHERE email = '${emailData}' `

    const get_result = await db.get(get_query)

    if(get_result === undefined){

        response.send('USER NOT REGISTERED')

    }else{

        const compared_password = await bcrypt.compare(passData,get_result.password)

        if(compared_password){

            response.send('VALID PASSWORD')

        }else{
            response.send('INVALID PASSWORD')
        }

    }
})




intitalize()


