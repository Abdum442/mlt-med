const Pool = require('pg').Pool
const pool = new Pool({
  user: 'mlt',
  host: 'localhost',
  database: 'mltdb',
  password: 'mlttrading',
  port: 5432,
})
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { fullname, username, password, role, has_pic } = request.body

  pool.query('INSERT INTO users (fullname, username, password, role, has_pic) VALUES ($1, $2, $3, $4, $5) RETURNING id', 
                               [fullname, username, password, role, has_pic], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })
}

const getSuppliers = (request, response) => {
  pool.query('SELECT * FROM suppliers ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addSupplier = (request, response) => {
  const { supplierName, contactInfo, address, taxInfo, LicenceNumber, remark } = request.body

  // console.log('Supplier Name: ', supplierName);

  pool.query('INSERT INTO suppliers (name, contactinfo, address, taxinfo, licencenumber, remark) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', 
    [supplierName, contactInfo, address, taxInfo, LicenceNumber, remark], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(results.rows)
  })
}

const updateSupplier = (request, response) => {
  const iD = parseInt(request.params.id)
  const { id, supplierName, contactInfo, address, taxInfo, LicenceNumber, remark } = request.body

  pool.query(
    'UPDATE suppliers SET name = $1, contactinfo = $2, address = $3, taxinfo = $4, licencenumber = $5, remark = $6  WHERE id = $7',
    [supplierName, contactInfo, address, taxInfo, LicenceNumber, remark, iD],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Supplier modified with ID: ${id}`)
    }
  )
}

const deleteSupplier = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM suppliers WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Supplier deleted with ID: ${id}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

// -------------------------------retailer-----------------------

const getRetailers = (request, response) => {
  pool.query('SELECT * FROM retailers ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addRetailer = (request, response) => {
  const { retailerName, contactInfo, address, remark } = request.body

  // console.log('request: ', request.body);

  pool.query('INSERT INTO retailers (name, contact, address, remarks) VALUES ($1, $2, $3, $4) RETURNING id',
    [retailerName, contactInfo, address, remark], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(results.rows)
    })
}

const updateRetailer = (request, response) => {
  const iD = parseInt(request.params.id)
  const { id, retailerName, contactInfo, address, remark } = request.body

  pool.query(
    'UPDATE retailers SET name = $1, contact = $2, address = $3, remarks = $4  WHERE id = $5',
    [retailerName, contactInfo, address, remark, iD],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Retailer modified with ID: ${id}`)
    }
  )
}

const deleteRetailer = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM retailers WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Retailer deleted with ID: ${id}`)
  })
}

const getProducts = (request, response) => {
  pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addProduct = (request, response) => {
  const { name, description, purchase_price, saling_price,
    expiry_date, supplier_id, remarks } = request.body

  pool.query('INSERT INTO products (name, description, purchase_price, saling_price, expiry_date, supplier_id, remarks) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    [name, description, purchase_price, saling_price, expiry_date, supplier_id, remarks], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(results.rows)
    })
}
const updateProduct = (request, response) => {
  const iD = parseInt(request.params.id)
  const { id, name, description, purchase_price, saling_price, expiry_date, supplier_id, remarks } = request.body

  console.log('Expiry Date : ', [iD, name, purchase_price, saling_price, expiry_date, supplier_id, remarks]);

  pool.query(
    'UPDATE products SET name = $1, description = $2, purchase_price = $3, saling_price = $4, expiry_date = $5, supplier_id = $6, remarks = $7  WHERE id = $8',
    [name, description, purchase_price, saling_price, expiry_date, supplier_id, remarks, iD],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Product modified with ID: ${id}`)
    }
  )
}

const deleteProduct = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Product deleted with ID: ${id}`)
  })
}

const getStock = (request, response) => {
  pool.query('SELECT * FROM company_stock ORDER BY product_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
const addStock = (request, response) => {
  const { product_id, quantity, purchase_id, supplier_id, remarks } = request.body

  pool.query('INSERT INTO company_stock (product_id, quantity, purchase_id, supplier_id, remarks) VALUES ($1, $2, $3, $4, $5) RETURNING product_id',
    [product_id, quantity, purchase_id, supplier_id, remarks], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Stock added with product ID: ${results.rows}`)
    })
}

const updateStock = (request, response) => {
  const iD = parseInt(request.params.id)
  const { product_id, quantity, purchase_id, supplier_id, remarks } = request.body

  pool.query(
    'UPDATE company_stock SET quantity = $2, purchase_id = $3, supplier_id = $4, remarks = $5  WHERE product_id = $1',
    [product_id, quantity, purchase_id, supplier_id, remarks],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Product modified with ID: ${product_id}`)
    }
  )
}

const getSales = (request, response) => {
  pool.query('SELECT * FROM sales ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addSales = (request, response) => {
  const { product_id, retailer_id, quantity_sold, sale_date, payment_method, amount_received, remarks } = request.body

  pool.query('INSERT INTO sales (product_id, retailer_id, quantity_sold, sale_date, payment_method, amount_received, remarks) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    [product_id, retailer_id, quantity_sold, sale_date, payment_method, amount_received, remarks], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${results.rows}`)
    })
}

const getPurchase = (request, response) => {
  pool.query('SELECT * FROM purchase ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addPurchase = (request, response) => {
  const { product_id, supplier_id, quantity, purchase_date, payment_method, amount_paid, tax_withheld, remarks } = request.body

  pool.query('INSERT INTO purchase (product_id, supplier_id, quantity, purchase_date, payment_method, amount_paid, tax_withheld, remarks) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
    [product_id, supplier_id, quantity, purchase_date, payment_method, amount_paid, tax_withheld, remarks], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(results.rows)
    })
}

const userData = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}

const supplierData = {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier
}

const retailerData = {
  getRetailers,
  addRetailer,
  updateRetailer,
  deleteRetailer
}

const productData = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
}

const stockData = {
  getStock,
  addStock,
  updateStock
}

const salesData = {
  getSales,
  addSales
}

const purchaseData = {
  getPurchase,
  addPurchase
}

module.exports = {
  userData,
  supplierData,
  retailerData,
  productData,
  stockData,
  salesData,
  purchaseData
}