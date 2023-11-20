// importing all frameworks
import express from 'express';
import mysql from 'mysql2';
import inquirer from 'inquirer';


// building app and middleware
const port = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// creating connection to mysql database
const db = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: 'tchr7902',
    database: 'employees_db'
},
    console.log('Connected to the employees_db database')
);


// setting up the Promise
function promptAsync(questions) {
    return new Promise((resolve) => {
        inquirer.prompt(questions).then(resolve);
    })
}

// initialization function
async function init() {

    // options for user to choose from
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

    // calling functions depending on given answer from the prompt
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

// inserts sql query and uses console.table to display results from the departments table
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


// selects all from roles table, uses console.table to display results
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


// selects all employees table, uses console.table to display results
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


// function to add department, prompts for the name, then inserts the department into the departments table using a query
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


// function to add a role
async function addRole() {
    // gets all departments, so the role can be put into a certain department
    const departments = await queryAsync('SELECT id, name FROM departments')
    
    // prompts for name, salary, and department of new role
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

        // inserts new role and all corresponding info into the roles table
        const query = 'INSERT INTO roles (title, salary, departments_id) VALUES (?, ?, ?)';

        try {
            await queryAsync(query, [answers.roleName, answers.roleSalary, answers.departmentId])
            console.log('Role added successfully!');
        } catch (err) {
            console.error(err);
        }
        
        init();
};


// function to add employee
async function addEmployee() {

    // queries to select the roles and managers
    const roles = await queryAsync('SELECT id, title FROM roles;');
    const employees = await queryAsync('SELECT id, CONCAT(first_name, " ", last_name) AS manager FROM employees;');

    // prompts for first name, last name, role, and the manager for new employee
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

// query to insert the new employee into employees db
const query = 'INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?)';

    try {
        await queryAsync(query, [answers.employeeFirstName, answers.employeeLastName, answers.roleId, answers.managerId]);
        console.log('Employee added successfully!');
    } catch (err) {
        console.error(err);
    }

    init();
}

// function to update an employees role
async function updateEmployeeRole() {
    // queries to select employees and their role
    const employees = await queryAsync('SELECT id, CONCAT(first_name, " ", last_name) AS employee FROM employees;');
    const roles = await queryAsync('SELECT id, title FROM roles');

    // prompts to choose an employee to update, and what role to change them too
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

    // updates employee role
    const query = 'UPDATE employees SET roles_id = ? WHERE id = ?';

    try {
        await queryAsync(query, [answers.roleId, answers.employeeId]);
        console.log('Employee role updated successfully!');
    } catch (err) {
        console.error(err);
    }

    init();
};


// promise resolve
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