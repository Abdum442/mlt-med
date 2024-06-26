const Pool = require('pg').Pool

const pool = new Pool({
  user: 'mlt',
  host: 'localhost',
  database: 'mltdb',
  password: 'mlttrading',
  port: 5432,
})

const sendQuery = async (request, response) => {
  const { queryType, query, data} = request.body;

  try {
    let result;
    switch(queryType) {
      case 'SELECT':
        result = await pool.query(query, data);
        response.status(200).json(result.rows);
        break;
      case 'UPDATE':
        result = await pool.query(query, data);
        response.status(200).json({message: 'Update successful', rowCount: result.rowCount});
        break;
      case 'INSERT':
        result = await pool.query(query, data);
        response.status(200).json({ message: 'Insert successful', rowCount: result.rowCount });
        break;
      case 'DELETE':
        result = await pool.query(query, data);
        response.status(200).json({ message: 'Delete successful', rowCount: result.rowCount });
        break;
      case 'CREATE':
        result = await pool.query(query);
        response.status(201).json({ message: 'Table creation successful' });
        break;
      default:
        response.status(400).json({ error: 'Invalid query type' });
        break;
    }
  } catch (error) {
    response.status(500).json({error: error.message})
  }
}

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
  const { supplierName, contactInfo, address, taxInfo, licenceNumber, remark } = request.body

  // console.log('Supplier Name: ', supplierName);

  pool.query('INSERT INTO suppliers (name, contactinfo, address, taxinfo, licencenumber, remark) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', 
    [supplierName, contactInfo, address, taxInfo, licenceNumber, remark], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(results.rows)
  })
}

const updateSupplier = (request, response) => {
  const iD = parseInt(request.params.id)
  const { id, supplierName, contactInfo, address, taxInfo, licenceNumber, remark } = request.body

  pool.query(
    'UPDATE suppliers SET name = $1, contactinfo = $2, address = $3, taxinfo = $4, licencenumber = $5, remark = $6  WHERE id = $7',
    [supplierName, contactInfo, address, taxInfo, licenceNumber, remark, iD],
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
  const { retailerName, contactInfo, address, taxInfo, licenceNumber, remark } = request.body

  // console.log('request: ', request.body);

  pool.query('INSERT INTO retailers (name, contact, address, tinnumber, licencenumber, remarks) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [retailerName, contactInfo, address, taxInfo, licenceNumber, remark], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(results.rows)
    })
}

const updateRetailer = (request, response) => {
  const iD = parseInt(request.params.id)
  const { id, retailerName, contactInfo, address, taxInfo, licenceNumber, remark } = request.body

  pool.query(
    'UPDATE retailers SET name = $1, contact = $2, address = $3, tinnumber =$4, licencenumber = $5, remarks = $6  WHERE id = $7',
    [retailerName, contactInfo, address, taxInfo, licenceNumber, remark, iD],
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
  const { id, productName, productDescription, sellingPrice, productRemark } = request.body

  // console.log('Expiry Date : ', [iD, name, purchase_price, saling_price, expiry_date, supplier_id, remarks]);

  pool.query(
    'UPDATE products SET name = $1, description = $2, saling_price = $3, remarks = $4  WHERE id = $5',
    [productName, productDescription, sellingPrice, productRemark, iD],
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
  pool.query('SELECT * FROM sales ORDER BY id DESC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addSales = (request, response) => {
  const { product_id, retailer_id, quantity_sold, sale_date, payment_method, amount_received, tax_withheld, checkout_status, order_id, remarks } = request.body

  pool.query('INSERT INTO sales (product_id, retailer_id, quantity_sold, sale_date, payment_method, amount_received, tax_withheld, checkout_status, order_id, remarks) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
    [product_id, retailer_id, quantity_sold, sale_date, payment_method, amount_received, tax_withheld, checkout_status, order_id, remarks], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(results.rows)
    })
}

const deleteSales = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM sales WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Item sales deleted with ID: ${id}`)
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
  const { product_id, supplier_id, quantity, purchase_date, payment_method, amount_paid, tax_withheld, remarks, unit_price } = request.body

  pool.query('INSERT INTO purchase (product_id, supplier_id, quantity, purchase_date, payment_method, amount_paid, tax_withheld, remarks, unit_price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
    [product_id, supplier_id, quantity, purchase_date, payment_method, amount_paid, tax_withheld, remarks, unit_price], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(results.rows)
    })
}

//========================expenses====================================
const getExpenses = (request, response) => {
  pool.query('SELECT * FROM expenses ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addExpenses = (request, response) => {
  const { description, amount, expense_date, payment_method, remarks } = request.body

  pool.query('INSERT INTO expenses (description, amount, expense_date, payment_method, remarks) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [description, amount, expense_date, payment_method, remarks], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(results.rows)
    })
}

//========================Company Loans============================
const getLoans = (request, response) => {
  pool.query('SELECT * FROM company_loans ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addLoans = (request, response) => {
  const { purpose, amount, duration_days, start_date, end_date, remarks } = request.body

  pool.query('INSERT INTO company_loans (purpose, amount, duration_days, start_date, end_date, remarks) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [purpose, amount, duration_days, start_date, end_date, remarks], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(results.rows)
    })
}
//========================Company Debit============================
const getDebit = (request, response) => {
  pool.query('SELECT * FROM company_debit ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addDebit = (request, response) => {
  const { purpose, amount, interest_rate, payment_terms, remarks } = request.body

  pool.query('INSERT INTO company_debit (purpose, amount, interest_rate, payment_terms, remarks) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [purpose, amount, interest_rate, payment_terms, remarks], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(results.rows)
    })
}

//========================Bank Details============================
const getBankDetails = (request, response) => {
  pool.query('SELECT * FROM bank_details ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addBankDetails = (request, response) => {
  const { account_holder, bank_name, account_number, remarks } = request.body

  pool.query('INSERT INTO bank_details (account_holder, bank_name, account_number, remarks) VALUES ($1, $2, $3, $4) RETURNING id',
    [account_holder, bank_name, account_number, remarks], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(results.rows)
    })
}

const getSalesOrderData = (request, response) => {
  pool.query('SELECT * FROM sales_order ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addSalesOrderData = (request, response) => {
  const { customer_id, order_date, total_amount, amount_paid, amount_remaining, checkout_status, tax_withheld } = request.body

  pool.query('INSERT INTO sales_order (customer_id, order_date, total_amount, amount_paid, amount_remaining, checkout_status, tax_withheld) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    [customer_id, order_date, total_amount, amount_paid, amount_remaining, checkout_status, tax_withheld], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(results.rows)
    })
}

const deleteSalesOrderData = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM sales_order WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Order Sales deleted with ID: ${id}`)
  })
}

const salesOrder = {
  getSalesOrderData,
  addSalesOrderData,
  deleteSalesOrderData
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
  addSales,
  deleteSales
}

const purchaseData = {
  getPurchase,
  addPurchase
}

const expenseData = {
  getExpenses,
  addExpenses
}

const loansData = {
  getLoans,
  addLoans
}

const debitData = {
  getDebit,
  addDebit
}

const bankData = {
  getBankDetails,
  addBankDetails
}

module.exports = {
  sendQuery,
  userData,
  supplierData,
  retailerData,
  productData,
  stockData,
  salesData,
  purchaseData,
  expenseData,
  loansData,
  debitData,
  bankData,
  salesOrder
}