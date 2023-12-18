
const connectToMongo=require('./db');
const express = require('express')
var cors = require('cors')

//express js code
connectToMongo();
var app = express()
const port = 5000

// app.get('/api/auth', (req, res) => {   //requsting a api file from json
//   res.send('Hello World!')
// })
app.use(cors())       //for api call through web(frontend)
app.use(express.json());   //to use the request body add this midlewear is mandatory

//will mount the link (auth) on specific path
app.use('/api/auth',require('./routes/auth'));//to create a new user,login
app.use('/api/note',require('./routes/note'));
app.use('/api/auth/getuser',require('./routes/getuser'));

app.listen(port, () => {
  console.log(`iNotebook app listening on port ${port}`)
})


