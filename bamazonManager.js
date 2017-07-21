var mysql = require('mysql');
var inquirer = require('inquirer');
var password = require('./password.js')

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: password,
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
		choices: ['View Products for Sale', 'View Low Inventory', 
				'Add to Inventory', 'Add New Product'],
		message: 'What would you like to do?'
	}).then(function(answer){
		switch (answer.option) {
			case 'View Products for Sale':
				display();
				break;
			case 'View Low Inventory':
				lowInventory();
				break;
			case 'Add to Inventory':
				addInventory();
				break;
			case 'Add New Product':
				addProduct();
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
	var col1 = 10;
	var col2 = 10;
	var col3 = 15;
	var col4 = 12;
	var col5 = 12;
	// Header names
	var header1 = 'Item ID';
	var header2 = 'Product';
	var header3 = 'Department';
	var header4 = 'Price';
	var header5 = 'Stock';
	// Retrieve data
	connection.query('SELECT * FROM products', function(err, res) {
		if (err) throw err;
		itemCount = res.length;
		for (var i = 0; i < res.length; i++) {
			// Responsive table width
			if (res[i].product_name.length > col2 + 4) col2 = res[i].product_name.length + 4;
			if (res[i].department_name.length > col3 + 4) col3 = res[i].department_name.length + 4;
		}
		// Print column headers
		console.log(header1 + spaces(col1 - header1.length) + header2 + spaces(col2 - header2.length) 
			+ header3 + spaces(col3 - header3.length) + header4 + spaces(col4 - header4.length) + header5);
		// Print rows
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].item_id + spaces(col1 - res[i].item_id.toString().length) + res[i].product_name + spaces(col2 - res[i].product_name.length) + res[i].department_name + spaces(col3 - res[i].department_name.length) + "$" + res[i].price + spaces(col4 - res[i].price.toString().length - 1) + res[i].stock_quantity)
		}
		// Run shopping interface
		menu();
	});
};


// View low inventory
var lowInventory = function() {
	var list = [];
	connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].product_name + ": " + res[i].stock_quantity + " left.");
		}
		menu();
	});
};


var addInventory = function() {
	connection.query("SELECT * FROM products", function(err,res) {
		itemCount = res.length;
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].item_id, res[i].product_name)
		}
		inquirer.prompt([
			{
				name: 'item',
				type: 'input',
				message: 'Enter the ID of the product you wish to restock:',
				validate: function(id) {
					if (id > 0 && id <= itemCount && id % 1 === 0) return true;
				}
			},
			{
				name: 'quantity',
				type: 'input',
				message: 'How many do you wish to restock? ["Q" to exit]',
				validate: function(q) {
					if (q > 0 && q % 1 === 0 || q === "Q") return true;
				}
			}
		]).then(function(answer) {
			if (answer.item === "Q" || answer.quantity === "Q") {
				connection.end();
				return
			}
			connection.query("SELECT * FROM products WHERE item_id = ?", [answer.item], function(err,res) {
				if (err) throw err;
				var newStock = res[0].stock_quantity + answer.quantity;
				connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [newStock, answer.item], function(err) {
					if (err) throw err;
					console.log('Product restocked! New stock quantity: ' + newStock);
					menu();
				});
			});
		});
	});
};

var addProduct = function() {
	inquirer.prompt([
		{
			name: 'newName',
			type: 'input',
			message: 'What product would you like to add?',
			validate: function(name) {
				if (name) return true;
			}
		},
		{
			name: 'newDept',
			type: 'input',
			message: 'Which department does the product belong to?',
			validate: function(dept) {
				if (dept) return true;
			}
		},
		{
			name: 'newPrice',
			type: 'input',
			message: 'Set retail price: ',
			validate: function(q) {
				if (q > 0) return true;
			}
		},
		{
			name: 'newQuantity',
			type: 'input',
			message: 'Initial stock quantity: ["Q" to exit]',
			validate: function(q) {
				if (q > 0 && q % 1 === 0 || q === "Q") return true;
			}
		}
	]).then(function(answer) {
		if (answer.newQuantity === "Q") {
			connection.end();
			return
		}
		var post = {product_name: answer.newName, department_name: answer.newDept, price: answer.newPrice, stock_quantity: answer.newQuantity};
		var query = connection.query('INSERT INTO products SET ?', post, function (err, res) {
			if (err) throw err;
			console.log("Product added! " + answer.newName + " is now available.");
			menu();
		});
	});
};


// var shop = function() {
// 	inquirer.prompt([
// 		{
// 			name: 'item',
// 			type: 'input',
// 			message: 'Enter the ID of the product you wish to purchase:',
// 			validate: function(id) {
// 				if (id > 0 && id <= itemCount && id % 1 === 0) return true;
// 			}
// 		},
// 		{
// 			name: 'quantity',
// 			type: 'input',
// 			message: 'How many do you wish to purchase? ["Q" to exit]',
// 			validate: function(q) {
// 				if (q > 0 && q % 1 === 0 || q === "Q") return true;
// 			}
// 		}
// 	]).then(function(answer) {
// 		if (answer.item === "Q" || answer.quantity === "Q") {
// 			connection.end();
// 			return
// 		}
// 		connection.query("SELECT * FROM products WHERE item_id = ?", [answer.item], function(err,res) {
// 			if (err) throw err;
// 			var newStock = res[0].stock_quantity - answer.quantity;
// 			if (res[0].stock_quantity >= answer.quantity) {
// 				connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [newStock, answer.item], function(err) {
// 					if (err) throw err;
// 				});
// 				var total = answer.quantity * res[0].price;
// 				console.log('Item purchased! Your order total was $' + total);
// 				shop();
// 			} else {
// 				console.log('Sorry, we do not have that many in stock.');
// 				shop();
// 			}
// 		});
// 	});
// };
