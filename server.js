//Dependencies
const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "employeeTracker_db",
  },
  console.log(`Connected to employeeTracker_db.`)
);

const roleArray = ["Sales", "Engineering", "Finance", "Legal"];
const titleArray = [
  "Software Engineer",
  "Accountant",
  "Lawyer",
  "Salesperson",
  "Sales Lead",
];

function mainPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do? ",
        name: "choice",
        choices: [
          "View departments",
          "View roles",
          "View employees",
          "Add department",
          "Add role",
          "Add employee",
          "Update an employee role",
        ],
      },
    ])
    .then(async function ({ choice }) {
      switch (choice) {
        case "View departments":
          db.query(
            "SELECT id, name AS Department FROM departments;",
            function (err, results) {
              console.table(results);
            }
          );
          await cleanUp();
          mainPrompt();
          break;
        case "View roles":
          db.query("SELECT title, salary FROM roles;", function (err, results) {
            console.table(results);
          });
          await cleanUp();
          mainPrompt();
          break;
        case "View employees":
          db.query(
            "SELECT first_name, last_name, title, salary FROM employees JOIN roles ON employees.role_id = roles.id;",
            function (err, results) {
              console.table(results);
            }
          );
          await cleanUp();
          mainPrompt();
          break;
        case "Add department":
          addDepartment();
          break;
        case "Add role":
          addRole();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployee();
          break;
      }
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department?",
        name: "name",
      },
    ])
    .then(async function ({ name }) {
      roleArray.push(name);
      db.query(`INSERT INTO departments (name) VALUES ("${name}")`,
        function (err, results) {
          return;
        }
      );
      await cleanUp();
      mainPrompt();
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the title of the role?",
        name: "title",
      },
      {
        type: "input",
        message: "What is the salary of the role?",
        name: "salary",
      },
      {
        type: "list",
        message: "Which department does the role belong to? ",
        name: "department_id",
        choices: roleArray,
      },
    ])
    .then(async function ({ title, salary, department_id }) {
      titleArray.push(title);
      for (let i = 0; i <= roleArray.length; i++) {
        if (department_id == roleArray[i]) {
          department_id = roleArray.indexOf(roleArray[i]) + 1;
        }
      }
      db.query(
        `INSERT INTO roles (title, salary, department_id) VALUES ("${title}", ${salary}, ${department_id});`,
      );
      await cleanUp();
      mainPrompt();
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "first_name",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "last_name",
      },
      {
        type: "list",
        message: "What is the employee's role?",
        name: "role_id",
        choices: titleArray,
      },
    ])
    .then(async function ({ first_name, last_name, role_id }) {
      for (let i = 0; i <= titleArray.length; i++) {
        if (role_id == titleArray[i]) {
          role_id = titleArray.indexOf(titleArray[i]) + 1;
        }
      }
      db.query(
        `INSERT INTO employees (first_name, last_name, role_id) VALUES ("${first_name}", "${last_name}", ${role_id});`
      );
      await cleanUp();
      mainPrompt();
    });
}

function updateEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Which employee's role would you like to update?",
        name: "last_name",
      },
      {
        type: "list",
        message: "Which role do you want to assign the selected employee? ",
        name: "role_id",
        choices: titleArray,
      },
    ])
    .then(async function ({ last_name, role_id }) {
      for (let i = 0; i <= titleArray.length; i++) {
        if (role_id == titleArray[i]) {
          role_id = titleArray.indexOf(titleArray[i]) + 1;
          if (role_id > titleArray.length) {
            role_id = role_id - 1;
          }
        }
      }
      db.query(
        `UPDATE employees SET role_id = ${role_id} WHERE last_name = "${last_name}";`
      );
      await cleanUp();
      mainPrompt();
    });
}

function cleanUp() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 1000);
  });
}

// start the server.
app.listen(PORT, () => {
  console.log(`Listening`);
});

mainPrompt();