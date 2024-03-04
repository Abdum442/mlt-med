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

app.get('/retailers', db.retailerData.getRetailers)
app.post('/retailers', db.retailerData.addRetailer)
app.put('/retailers/:id', db.retailerData.updateRetailer)
app.delete('/retailers/:id', db.retailerData.deleteRetailer)

app.get('/products', db.productData.getProducts);
app.post('/products', db.productData.addProduct);
app.put('/products/:id', db.productData.updateProduct)
app.delete('/products/:id', db.productData.deleteProduct)

app.get('/stock', db.stockData.getStock);

app.get('/sales', db.salesData.getSales);
app.post('/sales', db.salesData.addSales);


app.get('/purchase', db.purchaseData.getPurchase);
app.post('/purchase', db.purchaseData.addPurchase);

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})