require('dotenv').config({ path: __dirname + '/.env' });
require('./server/connection');

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const port = process.env.PORT;

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

let auth = require('./server/routes/auth');

app.use(process.env['API_V1']+"employee" , auth);


app.listen(port, ()=>{
    console.log(`https server running on port ${port}`);
});


////aakash.bist@algoscale.com
