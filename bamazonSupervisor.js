var mysql = require('mysql');
var inquirer = require('inquirer');
var password = require('./password.js')

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
 // // On connection
 run();
});

var run = function() {
	menu();
};

var menu = function() {
	inquirer.prompt({
		name: 'option',
		type: 'list',
		choices: ['View Product Sales by Department', 'Create New Department'],
		message: 'What would you like to do?'
	}).then(function(answer){
		switch (answer.option) {
			case 'View Product Sales by Department':
				display();
				break;
			case 'Create New Department':
				createDepartment();
				break;
		};
	});
};

// View products for sale
var itemCount = 0;
// Display formatted table from scratch because I'm an idiot
var display = function() {
	// Creates string of spaces
	var spaces = function(num) {
		var str = '';
		for (var i = 0; i < num; i++) {
			str += ' ';
		}
		return str;
	};
	// Default column width
	var col1 = 15;
	var col2 = 20;
	var col3 = 15;
	var col4 = 15;
	var col5 = 15;
	// Header names
	var header1 = 'Department ID';
	var header2 = 'Department Name';
	var header3 = 'Overhead Costs';
	var header4 = 'Product Sales';
	var header5 = 'Total Profit';
	// Retrieve data
	connection.query('SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_id, departments.department_name, departments.over_head_costs', function(err, res) {
		if (err) throw err;
		itemCount = res.length;
		for (var i = 0; i < res.length; i++) {
			// Responsive table width
			if (res[i].department_name.length > col2 + 4) col2 = res[i].department_name.length + 4;
		}
		// Print column headers
		console.log(header1 + spaces(col1 - header1.length) + header2 + spaces(col2 - header2.length) 
			+ header3 + spaces(col3 - header3.length) + header4 + spaces(col4 - header4.length) + header5);
		// Print rows
		for (var i = 0; i < res.length; i++) {
			if (!res[i].product_sales) {
				console.log(res[i].department_id + spaces(col1 - res[i].department_id.toString().length) + res[i].department_name + spaces(col2 - res[i].department_name.length) + "$" + res[i].over_head_costs + spaces(col3 - res[i].over_head_costs.toString().length - 1) + "$0" + spaces(col4 - 2) + (0 - res[i].over_head_costs));
			} else {
				console.log(res[i].department_id + spaces(col1 - res[i].department_id.toString().length) + res[i].department_name + spaces(col2 - res[i].department_name.length) + "$" + res[i].over_head_costs + spaces(col3 - res[i].over_head_costs.toString().length - 1) + "$" + res[i].product_sales + spaces(col4 - res[i].product_sales.toString().length - 1) + (res[i].product_sales - res[i].over_head_costs));
			}
		}
		// Run shopping interface
		menu();
	});
};

var createDepartment = function() {
	inquirer.prompt([
		{
			name: 'newDept',
			type: 'input',
			message: 'Enter a name for the new department:',
			validate: function(input) {
				if (input) return true;
			}
		},
		{
			name: 'overhead',
			type: 'input',
			message: 'New department overhead costs: ',
			validate: function(input) {
				if (input >= 0) return true;
			}
		}
	]).then(function(answer) {		
		var newDept = {
			'department_name': answer.newDept,
			'over_head_costs': answer.overhead
		}
		connection.query("INSERT INTO departments SET ?", [newDept],function(err, res) {
			if (err) throw err;
			console.log('Department added!');
			menu();
		})
	})
};
