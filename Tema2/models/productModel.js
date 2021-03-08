const config = require('../config/config');
const mysql = require('mysql');
const { v4: uuidv4 } = require('uuid')

const { writeDataToFile } = require('../utils')


function findAll() {
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection(config);
        let sql = 'SELECT * FROM cc2';
        let query = db.query(sql, (err, results) => {
            if(err) throw err;
            resolve(results)
        });
    })
}

function findById(id) {
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection(config);
        let sql = `SELECT * FROM cc2 WHERE id = ${id}`;
        let query = db.query(sql, (err, results) => {
            if(err) throw err;
            resolve(results)
        });

    })
}

function create(employee) {
    return new Promise((resolve, reject) => {
        const newProduct = {id: uuidv4(), ...employee}
        const db = mysql.createConnection(config);
        let sql = `insert into cc2 SET ?`;
        db.query(sql, newProduct, (err, results) => {
            if(err) throw err;
            resolve(results)
        });
    })
}

function update(id, employee) {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE cc2 SET ? WHERE id = ${id}`;
        const db = mysql.createConnection(config);
        let updateEmployee = {...employee}
        console.log(employee)
        db.query(sql, updateEmployee, (err, results) => {
            if(err) throw err;
            resolve(results)
        });
    })
}

function remove(id) {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM cc2 WHERE id = ${id}`;
        const db = mysql.createConnection(config);
        db.query(sql, (err, results) => {
            if(err) throw err;
        });
        resolve()
    })
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
}