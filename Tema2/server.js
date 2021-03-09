const http = require('http')
const { getEmployees, getEmployee, hireEmployee, hireEmployees, updateEmployee, fireEmployee } = require('./controllers/employeeController')

const server = http.createServer((req, res) => {
    if(req.url === '/api/employees' && req.method === 'GET') {
        getEmployees(req, res)
    } else if(req.url.match(/\/api\/employee\/\w+/) && req.method === 'GET') {
        const id = req.url.split('/')[3]
        getEmployee(req, res, id)
    } else if(req.url === '/api/employee' && req.method === 'POST') {
        hireEmployee(req, res)
    } else if(req.url === '/api/employees' && req.method === 'POST') {
        hireEmployees(req, res)
    } else if(req.url.match(/\/api\/employee\/\w+/) && req.method === 'PUT') {
        const id = req.url.split('/')[3]
        updateEmployee(req, res, id)
    } else if(req.url === '/api/employees' && req.method === 'PUT') {
        res.writeHead(405, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Not allowed' }))
    } else if(req.url.match(/\/api\/employee\/\w+/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3]
        fireEmployee(req, res, id)
    } else if(req.url === '/api/employees' && req.method === 'DELETE') {
        res.writeHead(405, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Not allowed' }))
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Route Not Found' }))
    }
})

const PORT =  process.env.PORT || 5000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

module.exports = server;
