-- Seed data for departments table
INSERT INTO departments (id, name) VALUES
(1, 'Sales'),
(2, 'Marketing'),
(3, 'Finance'),
(4, 'Human Resources');

-- Seed data for roles table
INSERT INTO roles (id, title, salary, departments_id) VALUES
(1, 'Sales Representative', 50000, 1),
(2, 'Marketing Coordinator', 45000, 2),
(3, 'Financial Analyst', 60000, 3),
(4, 'HR Specialist', 55000, 4);

-- Seed data for employees table
INSERT INTO employees (id, first_name, last_name, roles_id, manager_id) VALUES
(1, 'John', 'Doe', 1, NULL),
(2, 'Jane', 'Smith', 2, 1),
(3, 'Bob', 'Johnson', 3, 1),
(4, 'Alice', 'Williams', 4, 3);