const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors=require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.okfsr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
  try{
    await client.connect();
    const serviceCollection=client.db('doctors_portal').collection("services")
    app.get('/service',async(req,res)=>{
      const quary={}
      const cursor=serviceCollection.find(quary)
      const services=await cursor.toArray()
      res.send(services)
    })

  }
  finally{
 
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})