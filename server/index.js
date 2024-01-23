const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', db.userData.getUsers)
app.get('/users/:id', db.userData.getUserById)
app.post('/users', db.userData.createUser)
app.put('/users/:id', db.userData.updateUser)
app.delete('/users/:id', db.userData.deleteUser)

app.get('/suppliers', db.supplierData.getSuppliers)
app.post('/suppliers', db.supplierData.addSupplier)
app.put('/suppliers/:id', db.supplierData.updateSupplier)
app.delete('/suppliers/:id',db.supplierData.deleteSupplier)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})