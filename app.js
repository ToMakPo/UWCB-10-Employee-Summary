const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
// const Employee = require("./lib/Employee");

const employees = []
let maxID = 0

async function init() {
    // Write code to use inquirer to gather information about the development team members,
    // and to create objects for each team member (using the correct classes as blueprints!)
    await addEmployeeToList('manager')
    await addAnotherEmployee()

    // After the user has input all employees desired, call the `render` function (required
    // above) and pass in an array containing all employee objects; the `render` function will
    // generate and return a block of HTML including templated divs for each employee!
    const html = render(employees)
    
    // After you have your html, you're now ready to create an HTML file using the HTML
    // returned from the `render` function. Now write it to a file named `team.html` in the
    // `output` folder. You can use the variable `outputPath` above target this location.
    // Hint: you may need to check if the `output` folder exists and create it if it
    // does not.
    fs.writeFileSync(outputPath, html)
}; init()

async function addEmployeeToList(role) {
    const validateEmail = email => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const {msg, obj} = {
        manager: {msg:'Office Number', obj:Manager},
        engineer: {msg:'GitHub', obj:Engineer},
        intern: {msg:'School', obj:Intern}
    }[role]

    console.log(`- Please provide information for the ${role.toUpperCase()}:`);
    const {name, email, extra} = await inquirer.prompt([{
        name: 'name',
        type: 'input',
        message: 'Name: ',
        prefix: '',
        validate: input => input != '' || 'You must provide a name.',
        filter: input => input.trim()
    }, {
        name: 'email',
        type: 'input',
        message: 'Email: ',
        prefix: '',
        validate: input => input == '' || validateEmail(input) || 'You must provide a valid email.',
        filter: input => input.trim().toLowerCase()
    }, {
        name: 'extra',
        type: 'input',
        message: msg + ': ',
        prefix: '',
        filter: input => input.trim()
    }])

    employees.push(new obj(name, ++maxID, email, extra))
}

async function addAnotherEmployee() {
    const {addAnother} = await inquirer.prompt([{
        name: 'addAnother',
        type: 'confirm',
        message: 'Would you like to add another employee?',
        prefix: '-'
    }])

    if (addAnother) {
        const {role} = await inquirer.prompt([{
            name: 'role',
            type: 'list',
            message: 'What is the role of the new employee?',
            prefix: '-',
            choices: ['engineer', 'intern', new inquirer.Separator(), 'cancel']
        }])

        if (role != 'cancel') {
            await addEmployeeToList(role)
            await addAnotherEmployee()
        }
    }
}
