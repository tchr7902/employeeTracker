const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const port = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

////////////////////////////////////
const db = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: 'tchr7902',
    database: 'employees_db'
},
    console.log('Connected to the employees_db database')
);

////////////////////////////////////
function init() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ],
        },
    ])
    .then((answers) => {
        if(answers == 'View all departments') {
            viewAllDepartments();
        } else if (answers == 'View all roles') {
            viewAllRoles();
        } else if (answers == 'View all employees') {
            viewAllEmployees();
        } else if (answers == 'Add a department') {
            addDepartment();
        } else if (answers == 'Add a role') {
            addRole();
        } else if (answers == 'Add an employee') {
            addEmployee();
        } else if (answers == 'Update an employee role') {
            updateEmployeeRole();
        } else if (answers == 'Exit') {
            Connection.end();
            console.log('Exiting application!')
        } else {
            console.log('Invalid input!')
        }
    })
}

////////////////////////////////////
function viewAllDepartments() {

};


function viewAllRoles() {

};


function viewAllEmployees() {

};


function addDepartment() {

};


function addRole() {

};


function addEmployee() {

};


function updateEmployeeRole() {

};