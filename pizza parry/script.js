
var toppings = ["Pepperoni","Bacon","Jalepenos"];

var container = document.getElementById('toppings');

toppings.forEach(function(topping){
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    var label= document.createElement("label");
    label.appendChild(document.createTextNode(topping));

    var br = document.createElement("br");

    container.appendChild(checkbox);
    container.appendChild(label);
    container.appendChild(br);
})

// // Array of options
// var options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

// // Get the container element
// var container = document.getElementById('checkboxContainer');

// // Loop through the options array
// options.forEach(function(option) {
//     // Create a checkbox element
//     var checkbox = document.createElement('input');
//     checkbox.type = 'checkbox';
//     checkbox.id = option.replace(/\s/g, ''); // Assign an id without spaces
//     checkbox.name = option.replace(/\s/g, ''); // Assign a name without spaces

//     // Create a label for the checkbox
//     var label = document.createElement('label');
//     label.htmlFor = checkbox.id; // Associate the label with the checkbox
//     label.appendChild(document.createTextNode(option));

//     // Create a line break for better spacing
//     var br = document.createElement('br');

//     // Append the checkbox, label, and line break to the container
//     container.appendChild(checkbox);
//     container.appendChild(label);
//     container.appendChild(br);
// });
