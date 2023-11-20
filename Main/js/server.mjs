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
function promptAsync(questions) {
    return new Promise((resolve) => {
        inquirer.prompt(questions).then(resolve);
    })
}


async function init() {
    const answers = await promptAsync([
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

    if(answers.action === 'View all departments') {
        viewAllDepartments();
    } else if (answers.action === 'View all roles') {
        viewAllRoles();
    } else if (answers.action === 'View all employees') {
        viewAllEmployees();
    } else if (answers.action === 'Add a department') {
        addDepartment();
    } else if (answers.action === 'Add a role') {
        addRole();
    } else if (answers.action === 'Add an employee') {
        addEmployee();
    } else if (answers.action === 'Update an employee role') {
        updateEmployeeRole();
    } else if (answers.action === 'Exit') {
        db.end();
        console.log('Exiting application!')
    } else {
        console.log('Invalid input!')
        init();
    }
}

////////////////////////////////////
async function viewAllDepartments() {
    const query = 'SELECT * FROM departments';

    try {
        const results = await queryAsync(query);
        console.table(results);
    } catch (err) {
        console.error(err);
    }

    init();
};


////////////////////////////////////
async function viewAllRoles() {
    const query = 'SELECT * FROM roles';

    try {
        const results = await queryAsync(query);
        console.table(results);
    } catch(err) {
        console.error(err);
    }

    init();
};


////////////////////////////////////
async function viewAllEmployees() {
    const query = 'SELECT * FROM employees';

    try {
        const results = await queryAsync(query);
        console.table(results);
    } catch (err) {
        console.error(err);
    }

    init();
};


////////////////////////////////////
async function addDepartment() {
    const answers = await promptAsync([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the department',
        },
    ])

    const query = 'INSERT INTO departments (name) VALUES (?)';

    try {
        await queryAsync(query, [answers.departmentName]);
        console.log('Department added successfully!');
    } catch (err) {
        console.error(err);
    }

    init();
};


////////////////////////////////////
async function addRole() {
    const departments = await queryAsync('SELECT id, name FROM departments')
    
    const answers = await promptAsync([
                {
                    type: 'input',
                    name: 'roleName',
                    message: 'Enter the name of the role:',
                },
                {
                    type: 'input',
                    name: 'roleSalary',
                    message: 'Enter the salary for this role:',
                },
                {
                    type: 'list',
                    name: 'departmentId',
                    message: 'Select the department for this role:',
                    choices: departments.map(department => ({name: department.name, value: department.id }))
                },
            ])

        const query = 'INSERT INTO roles (title, salary, departments_id) VALUES (?, ?, ?)';

        try {
            await queryAsync(query, [answers.roleName, answers.roleSalary, answers.departmentId])
            console.log('Role added successfully!');
        } catch (err) {
            console.error(err);
        }
        
        init();
};


////////////////////////////////////
async function addEmployee() {

    const roles = await queryAsync('SELECT id, title FROM roles;');
    const employees = await queryAsync('SELECT id, CONCAT(first_name, " ", last_name) AS manager FROM employees;');

    const answers = await promptAsync([
        {
            type: 'input',
            name: 'employeeFirstName',
            message: 'Enter the first name of the employee',
        },
        {
            type: 'input',
            name: 'employeeLastName',
            message: 'Enter the last name of the employee',
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the role for the employee',
            choices: roles.map(role => ({ name: role.title, value: role.id })),
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Select the manager for the employee',
            choices: [{ name: 'None', value: null }, ...employees.map(employee => ({ name: employee.manager, value: employee.id }))]
        },
]);

const query = 'INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?)';

    try {
        await queryAsync(query, [answers.employeeFirstName, answers.employeeLastName, answers.roleId, answers.managerId]);
        console.log('Employee added successfully!');
    } catch (err) {
        console.error(err);
    }

    init();
}

////////////////////////////////////
async function updateEmployeeRole() {
    const employees = await queryAsync('SELECT id, CONCAT(first_name, " ", last_name) AS employee FROM employees;');
    const roles = await queryAsync('SELECT id, title FROM roles');

    const answers = await promptAsync([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to update:',
            choices: employees.map(employee => ({ name: employee.employee, value: employee.id }))
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the new role for the employee:',
            choices: roles.map(roles => ({ name: roles.title, value: roles.id })),
        },
    ])

    const query = 'UPDATE employees SET roles_id = ? WHERE id = ?';

    try {
        await queryAsync(query, [answers.roleId, answers.employeeId]);
        console.log('Employee role updated successfully!');
    } catch (err) {
        console.error(err);
    }

    init();
};


////////////////////////////////////
function queryAsync(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if(err) {
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

init();