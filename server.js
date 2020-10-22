// get the client
const mysql = require('mysql2');
const inquirer = require('inquirer');


// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'nextS+3p',
    database: 'employeesDB'
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');
    menu();
});


const menu = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'what would you like to do?',
            choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee's role", "exit"]
        }
    ])
        .then(userChoice => {
            switch (userChoice.action) {
                case "view all departments":
                    query = "SELECT * FROM department"
                    viewAll(query)
                    break;

                case "view all roles":
                    query = "SELECT * FROM role JOIN department ON department.department_id = role.department_id "
                    viewAll(query);
                    break;

                case "view all employees":
                    query = "SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.role_id JOIN department ON role.department_id = department.department_id ORDER BY department.name "
                    viewAll(query);
                    break;

                case "add a department":
                    addDepartment()
                    break;

                case "add a role":
                    addRole()
                    break;

                case "add an employee":
                    addEmployee()
                    break;

                case "update an employee's role":
                    updateRole()
                    break;

                case "exit":
                    connection.end()
                    break;
            }
        })

}

//view full table
const viewAll = (query) => {

    connection.query(
        query, [], (error, result) => {
            if (error) throw error;
            console.log("-----------------");
            console.table(result)
        }
    )
    menu()
}


const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'depName',
            message: 'what department would you like to add?'
        }
    ])
        .then(answer => {
            connection.query(
                "INSERT INTO department SET ? ", { name: answer.depName }, (error, result) => {

                    if (error) throw error;
                    console.log(answer.depName + " added to departments!")
                    menu()
                }
            )
        })
}

const addRole = () => {
    connection.query("SELECT department.name, department.department_id FROM department", function (err, depResult) {


        inquirer.prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'what role would you like to add?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'what is the salary?'
            },
            {
                type: 'list',
                name: 'department',
                message: 'what is the department?',
                choices: depResult.map((department) => {
                    return {
                        name: department.name,
                        value: department.department_id
                    }
                })
            }
        ])
            .then(answer => {

                const query = connection.query(
                    "INSERT INTO role SET ? ",
                    {
                        title: answer.roleName,
                        salary: answer.salary,
                        department_id: answer.department

                    },
                    (error, result) => {
                        if (error) throw error;
                        console.log(`                        
                        --------------------
                          added ${answer.roleName} to roles!
                        --------------------`)
                        menu()
                    }
                )
            })
    })
}

const addEmployee = () => {
    connection.query("SELECT role.title, role.role_id FROM role", function (err, roleResult) {

        connection.query("SELECT employee.first_name, employee.last_name, employee.id FROM employee WHERE employee.role_id=1", function (err, managerRes) {

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: "what is employee's first name?"
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "what is employee's last name?"
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "what is employee's role?",
                    choices: roleResult.map((role) => {
                        return {
                            name: role.title,
                            value: role.role_id
                        }
                    })
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "who is employee's manager?",
                    choices: managerRes.map((manager) => {
                        return {
                            name: manager.first_name + " " + manager.last_name,
                            value: manager.id
                        }
                    })
                }
            ])
                .then(answer => {

                    connection.query(
                        "INSERT INTO employee SET ? ",
                        {
                            first_name: answer.firstName,
                            last_name: answer.lastName,
                            role_id: answer.role,
                            manager_id: answer.manager
                        },
                        (error, result) => {
                            if (error) throw error;
                            console.log(`
                        -------------------------
                          added ${answer.firstName} ${answer.lastName} to employees!
                        -------------------------
                        `);

                            menu()
                        }
                    )
                })
        })
    })
}

const updateRole = () => {

    connection.query("SELECT * FROM employee", function (err, empResult) {

        connection.query("SELECT * FROM role", (err, roleResult) => {

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: "which employee would you like to update?",
                    choices: empResult.map((employee) => {
                        return {
                            name: employee.first_name + " " + employee.last_name,
                            value: employee.id
                        }
                    })
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "what is the updated role?",
                    choices: roleResult.map((role) => {
                        return {
                            name: role.title,
                            value: role.role_id
                        }
                    })
                }
            ])
                .then(answer => {

                    connection.query(
                        "UPDATE employee SET role_id = ? WHERE id = ?", [answer.role, answer.employeeId],
                        (error, result) => {
                            if (error)
                                throw error;
                            console.log(`
                    ------------
                    updated role!
                    ------------
                    `)
                            menu();
                        }
                    )

                });
        })
    })
}