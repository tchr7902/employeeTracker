import express from 'express';
import mysql from 'mysql2';
import inquirer from 'inquirer';
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
            db.end();
            console.log('Exiting application!')
        } else {
            console.log('Invalid input!')
        }
    })
}

////////////////////////////////////
function viewAllDepartments() {
    const query = 'SELECT * FROM departments';

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.table(results);
        }
        init();
    })
};


////////////////////////////////////
function viewAllRoles() {
    const query = 'SELECT * FROM roles';

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.table(results);
        }
        init();
    })
};


////////////////////////////////////
function viewAllEmployees() {
    const query = 'SELECT * FROM employees';

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.table(results);
        }
        init();
    })
};


////////////////////////////////////
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the department',
        },
    ])
    .then((answers) => {
        const query = 'INSERT INTO departments (name) VALUES (?)';

        db.query(query, [answers.departmentName], (err, results) => {
            if(err) {
                console.error(err);
            } else {
                console.log('Department added successfully!');
            }

            init();
        })
    })
};


////////////////////////////////////
function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'Enter the name of the role',
        },
    ])
    .then((answers) => {
        const query = 'INSERT INTO roles (name) VALUES (?)';

        db.query(query, [answers.roleName], (err, results) => {
            if(err) {
                console.error(err);
            } else {
                console.log('Role added successfully!');
            }

            init();
        })
    })
};


////////////////////////////////////
function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employeeName',
            message: 'Enter the name of the employee',
        },
    ])
    .then((answers) => {
        const query = 'INSERT INTO employee (name) VALUES (?)';

        db.query(query, [answers.employeeName], (err, results) => {
            if(err) {
                console.error(err);
            } else {
                console.log('Employee added successfully!');
            }

            init();
        })
    })
};


////////////////////////////////////
function updateEmployeeRole() {

};