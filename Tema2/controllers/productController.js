const Product = require('../models/productModel')

const { getPostData } = require('../utils')


async function getProducts(req, res) {
    try {
        const msg = await Product.findAll()

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(msg))
    } catch (error) {
        console.log(error)
    }
}


async function getProduct(req, res, id) {
    try {
        const msg = await Product.findById(id)

        if(!msg || JSON.stringify(msg) === '[]') {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Product Not Found' }))
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(msg))
            console.log(msg)
        }
    } catch (error) {
        console.log(error)
    }
}


async function createProduct(req, res) {
    try {
        const body = await getPostData(req)

        const { Name, Age, Details } = JSON.parse(body)

        const employee = {
            Name,
            Age,
            Details
        }
        console.log(employee)
        const newProduct = await Product.create(employee)

        res.writeHead(201, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify(newProduct))  

    } catch (error) {
        console.log(error)
    }
}

async function updateProduct(req, res, id) {
    try {
        const employee = await Product.findById(id)
        if(!employee) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Product Not Found' }))
        } else {
            const body = await getPostData(req)
            const { Name, Age, Details } = JSON.parse(body)
            let string = JSON.stringify(employee)
            let data = JSON.parse(string);
            const employeeData = {
                Name: Name || data['Name'],
                Age: Age || data['Age'],
                Details: Details || data['Details']
            }
            const updateEmployee = await Product.update(id, employeeData)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify(updateEmployee))
        }
 

    } catch (error) {
        console.log(error)
    }
}


async function deleteProduct(req, res, id) {
    try {
        const employee = await Product.findById(id)

        if(!employee ) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Product Not Found' }))
        } else {
            await Product.remove(id)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: `Product ${id} removed` }))
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}