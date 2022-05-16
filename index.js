const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.okfsr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db('doctors_portal').collection("services")
    const bookingCollection = client.db('doctors_portal').collection("booking")
    app.get('/service', async (req, res) => {
      const quary = {}
      const cursor = serviceCollection.find(quary)
      const services = await cursor.toArray()
      res.send(services)
    })

    app.get('/avilable', async (req, res) => {
      const date = req.query.date;

      const services = await serviceCollection.find().toArray()
      const quary = { date: date, }
      const bookings = await bookingCollection.find(quary).toArray()

      services.forEach(service => {
        const serviceBooking = bookings.filter(book => book.treatment === service.name)
        const bookedSlots = serviceBooking.map(book => book.slot)
        const avilable = service.slots.filter(slot => !bookedSlots.includes(slot))
        service.slots = avilable
      })
      res.send(services)

    })

    app.get('/booking', async (req, res) => {
      const patient = req.query.patient
      const quary = { patient: patient }
      const bookings = await bookingCollection.find(quary).toArray()
      res.send(bookings)
    })

    app.post('/booking', async (req, res) => {
      const booking = req.body;
      const query = { treatment: booking.treatment, date: booking.date, patient: booking.patient }
      const exists = await bookingCollection.findOne(query)
      if (exists) {
        return res.send({ success: false, booking: exists })
      }
      const result = await bookingCollection.insertOne(booking);

      return res.send({ success: true, result })
    })




  }
  finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})