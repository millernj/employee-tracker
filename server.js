require('dotenv').config();
require('console.table');

const inquirer = require('inquirer');

const orm = require('./config/orm');

async function renderMainMenu() {
  const { action } = await inquirer.prompt([{
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      {
        name: 'View all employees',
        value: 'viewAllEmployees'
      },
      {
        name: 'View all employees by department',
        value: 'viewAllEmployeesByDepartment'
      },
      {
        name: 'View all employees by manager',
        value: 'viewAllEmployeesByManager'
      },
      {
        name: 'View all roles',
        value: 'viewAllRoles'
      },
      {
        name: 'View all departments',
        value: 'viewAllDepartments'
      },
      {
        name: 'Exit',
        value: null
      }
    ]
  }])

  let employees;
  switch (action) {
    case 'viewAllEmployees':
      employees = await orm.select(
        'employees',
      [
        'employees.id',
        'employees.first_name',
        'employees.last_name',
        'title',
        'name as department',
        `CONCAT(managers.first_name, ' ', managers.last_name) as manager`,
        'salary'
      ], 
      [
        'LEFT JOIN roles on employees.role_id = roles.id',
        'LEFT JOIN departments on roles.department_id = departments.id',
        'LEFT JOIN employees as managers on employees.manager_id = managers.id',
        'ORDER BY employees.id'
      ]);
      console.table(employees);
      renderMainMenu();
      break;

    case 'viewAllEmployeesByDepartment':
      employees = await orm.select(
        'employees',
        [
          'employees.id',
          'name as department',
          'employees.first_name',
          'employees.last_name',
          'title',
          `CONCAT(managers.first_name, ' ', managers.last_name) as manager`,
          'salary'
        ], 
        [
          'LEFT JOIN roles on employees.role_id = roles.id',
          'LEFT JOIN departments on roles.department_id = departments.id',
          'LEFT JOIN employees as managers on employees.manager_id = managers.id',
          'ORDER BY manager'
        ]);
      console.table(employees);
      renderMainMenu();
      break;

    case 'viewAllEmployeesByManager':
      employees = await orm.select(
        'employees',
        [
          'employees.id', 
          `CONCAT(managers.first_name, ' ', managers.last_name) as manager`, 
          'employees.first_name', 
          'employees.last_name', 
          'title', 
          'name as department', 
          'salary'
        ], 
        [
          'LEFT JOIN roles on employees.role_id = roles.id',
          'LEFT JOIN departments on roles.department_id = departments.id',
          'LEFT JOIN employees as managers on employees.manager_id = managers.id',
          'ORDER BY manager'
        ]);
      console.table(employees);
      renderMainMenu();
      break;

    case 'viewAllRoles':
      const roles = await orm.select(
        'roles',
        ['roles.id', 'title','name as department', 'salary'],
        [
          'LEFT JOIN departments on roles.department_id = departments.id',
          'ORDER BY id'
        ]
        );
      console.table(roles);
      renderMainMenu();
      break;
    
    case 'viewAllDepartments':
      const departments = await orm.select('departments');
      console.table(departments);
      renderMainMenu();
      break;
    
    default:
      process.exit();
  }
}

async function main() {
  await orm.connect();
  await renderMainMenu();
}

main();