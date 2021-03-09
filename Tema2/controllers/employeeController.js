const Employee = require('../models/employeeModel')

const { getPostData } = require('../utils')


async function getEmployees(req, res) {
    try {
        const msg = await Employee.findAll()

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(msg))
    } catch (error) {
        console.log(error)
    }
}


async function getEmployee(req, res, id) {
    try {
        const msg = await Employee.findById(id)

        if(!msg || JSON.stringify(msg) === '[]') {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Employee Not Found' }))
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(msg))
            console.log(msg)
        }
    } catch (error) {
        console.log(error)
    }
}


async function hireEmployee(req, res) {
    try {
        const body = await getPostData(req)

        const { Name, Age, Details } = JSON.parse(body)

        const employee = {
            Name,
            Age,
            Details
        }
        console.log(employee)
        const newEmployee = await Employee.create(employee)
        res.writeHead(201, { 'Content-Type': 'application/json' })
        console.log(newEmployee)
        const newEmployee2 = {id:newEmployee["insertId"],...employee}
        return res.end(JSON.stringify(newEmployee2))

    } catch (error) {
        console.log(error)
    }
}


async function hireEmployees(req, res) {
    try {
        const body = await getPostData(req)

        let Body = JSON.parse(body)
        console.log("lungime",Body.length)
        console.log("/n/n Doar 1",Body[1] )
        var newEmployees = []
        for (i=0;i<Body.length;i++){
            const { Name, Age, Details } = Body[i]

            const employee = {
                Name,
                Age,
                Details
            }
            console.log(employee)
            const newEmployee = await Employee.create(employee)
            const newEmployee2 = {id:newEmployee["insertId"],...employee}
            newEmployees[i]=newEmployee2
        }


        res.writeHead(201, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify(newEmployees))

    } catch (error) {
        console.log(error)
    }
}

async function updateEmployee(req, res, id) {
    try {
        const employee = await Employee.findById(id)
        if(!employee) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Employee Not Found' }))
        } else {
            const body = await getPostData(req)
            const { Name, Age, Details } = JSON.parse(body)
            let string = JSON.stringify(employee)
            let data = JSON.parse(string);
            const employeeData = {
                Name: Name || data[0]['Name'],
                Age: Age || data[0]['Age'],
                Details: Details || data[0]['Details']
            }
            const updateEmployee = await Employee.update(id, employeeData)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify(await Employee.findById(id)))
        }
 

    } catch (error) {
        console.log(error)
    }
}


async function fireEmployee(req, res, id) {
    try {
        const employee = await Employee.findById(id)
        if(!employee || employee.toString() === "") {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Employee Not Found' }))
        } else {
            await Employee.remove(id)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: `Employee ${id} removed` }))
        }
    } catch (error) {
        console.log(error)
    }
}


async function fireEmployees(req, res) {
    try {
            await Employee.removeAll()
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: `You fired everyone.` }))
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getEmployee,
    getEmployees,
    hireEmployee,
    hireEmployees,
    updateEmployee,
    fireEmployee

}