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

module.exports = {
  userData,
  supplierData,
  retailerData
}