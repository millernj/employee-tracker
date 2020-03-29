const orm = require('./config/orm');

const inquirer = require('inquirer');

async function renderMainMenu() {
  const { action } = await inquirer.prompt([{
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      {
        name: 'View cost by department',
        value: 'viewCost'
      },
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
        name: 'Add employee',
        value: 'addEmployee'
      },
      {
        name: 'Remove employee',
        value: 'removeEmployee'
      },
      {
        name: 'Update an employee\'s role',
        value: 'updateEmployeeRole'
      },
      {
        name: 'Update an employee\'s manager',
        value: 'updateEmployeeManager'
      },
      {
        name: 'View all departments',
        value: 'viewAllDepartments'
      },
      {
        name: 'Add department',
        value: 'addDepartment'
      },
      {
        name: 'Remove department',
        value: 'removeDepartment'
      },
      {
        name: 'View all roles',
        value: 'viewAllRoles'
      },
      {
        name: 'Add role',
        value: 'addRole'
      },
      {
        name: 'Remove role',
        value: 'removeRole'
      },
      {
        name: 'Exit',
        value: null
      }
    ]
  }])

  handleAction(action);
}

async function handleAction(action) {
  switch (action) {
    case 'viewCost':
      viewCost();
      break;

    case 'viewAllEmployees':
      viewAllEmployees();
      break;

    case 'viewAllEmployeesByDepartment':
      viewAllEmployeesByDepartment();
      break;

    case 'viewAllEmployeesByManager':
      viewAllEmployeesByManager();
      break;

    case 'addEmployee':
      addEmployee();
      break;

    case 'removeEmployee':
      removeEmployee();
      break;

    case 'updateEmployeeRole':
      updateEmployeeRole();
      break;
    
    case 'updateEmployeeManager':
      updateEmployeeManager();
      break;
    
    case 'viewAllDepartments':
      viewAllDepartments();
      break;

    case 'addDepartment':
      addDepartment();
      break;

    case 'removeDepartment':
      removeDepartment();
      break;

    case 'viewAllRoles':
      viewAllRoles();
      break;

      case 'addRole':
        addRole();
        break;
  
      case 'removeRole':
        removeRole();
        break;

    default:
      process.exit();
  }
}

const viewCost = async () => {
  const employees = await orm.select(
    'employees',
    [
      'name as department',
      'COUNT(employees.id) as employee_count',
      'AVG(salary) as average_salary',
      'SUM(salary) as total_cost'
    ],
    [
      'LEFT JOIN roles on employees.role_id = roles.id',
      'LEFT JOIN departments on roles.department_id = departments.id',
      'GROUP BY name'
    ]
  )

  renderTable(employees);
  renderMainMenu();
}

const viewAllEmployees = async () => {
  const employees = await orm.select(
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
  renderTable(employees);
  renderMainMenu();
}

const viewAllEmployeesByDepartment = async () => {
  const employees = await orm.select(
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
      'ORDER BY department'
    ]);
  renderTable(employees);
  renderMainMenu();
}

const viewAllEmployeesByManager = async () => {
  const employees = await orm.select(
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
  renderTable(employees);
  renderMainMenu();
}

const addEmployee = async () => {
  const employees = await orm.select('employees', ['id as value', `CONCAT(first_name, ' ', last_name) as name`]);
  const roles = await orm.select('roles', ['id as value', `title as name`]);

  const newEmployee = await inquirer.prompt([
    {
      name: 'first_name',
      message: 'What is their first name?'
    },
    {
      name: 'last_name',
      message: 'What is their last name?'
    },
    {
      name: 'role_id',
      type: 'list',
      message: 'What is their role?',
      choices: roles
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Who is their manager?',
      choices: [...employees, { name: 'They don\'t have a manager', value: null }]
    }
  ])
  const result = await orm.insert('employees', newEmployee);

  renderMainMenu();
}

const removeEmployee = async () => {
  const employees = await orm.select('employees', ['id as value', `CONCAT(first_name, ' ', last_name) as name`]);
  const { id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: 'Which employee do you want to remove?',
      choices: employees
    }
  ])
  const result = await orm.deleteById('employees', id);

  renderMainMenu();
}

const updateEmployeeRole = async () => {
  const employees = await orm.select('employees', ['id as value', `CONCAT(first_name, ' ', last_name) as name`]);
  const roles = await orm.select('roles', ['id as value', `title as name`]);
  const { id, role_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: 'Which employee do you want to update?',
      choices: employees
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Which role would you like to grant?',
      choices: roles
    },
  ])

  const result = await orm.updateById('employees', id, { role_id });

  renderMainMenu();
}

const updateEmployeeManager = async () => {
  const employees = await orm.select('employees', ['id as value', `CONCAT(first_name, ' ', last_name) as name`]);
  const { id, manager_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: 'Which employee do you want to update?',
      choices: employees
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Who\'s the selected employee\'s new manager? (Select "Remove Manager" to delete manager)',
      choices: [...employees, { name: 'Remove Manager', value: null }]
    },
  ])

  const result = await orm.updateById('employees', id, { manager_id });

  renderMainMenu();
}



const viewAllDepartments = async () => {
  const departments = await orm.select('departments');
  renderTable(departments);
  renderMainMenu();
}

const addDepartment = async () => {
  const newDepartment = await inquirer.prompt([
    {
      name: 'name',
      message: 'What name do you want to give the new department?'
    }
  ])
  const result = await orm.insert('departments', newDepartment);

  renderMainMenu();
}

const removeDepartment = async () => {
  const departments = await orm.select('departments', ['id as value', `name`]);
  const { id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: 'Which department do you want to remove?',
      choices: departments
    }
  ])
  const result = await orm.deleteById('departments', id);

  renderMainMenu();
}

const viewAllRoles = async () => {
  const roles = await orm.select(
    'roles',
    ['roles.id', 'title', 'name as department', 'salary'],
    [
      'LEFT JOIN departments on roles.department_id = departments.id',
      'ORDER BY id'
    ]
  );
  renderTable(roles);
  renderMainMenu();
}

const addRole = async () => {
  const departments = await orm.select('departments', ['id as value', `name`]);
  const newRole = await inquirer.prompt([
    {
      name: 'title',
      message: 'What name do you want to give the new role?'
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'Which department does the role belong to?',
      choices: departments
    },
    {
      type: 'number',
      name: 'salary',
      message: 'What yearly salary does this role earn?',
      validate: answer => parseFloat(answer) ? true : 'Please enter a valid number'
    }
  ])

  const result = await orm.insert('roles', newRole);

  renderMainMenu();
}

const removeRole = async () => {
  const roles = await orm.select('roles', ['id as value', `title as name`]);
  const { id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: 'Which role do you want to remove?',
      choices: roles
    }
  ])
  const result = await orm.deleteById('roles', id);

  renderMainMenu();
}


const renderTable = (table) => {
  console.log('');
  console.table(table);
}

module.exports = renderMainMenu;