var container = document.getElementById("toppingsContainer");
var pizzaIng = document.getElementById("pizzaIng");
var newPizzabuttonEl = document.querySelector("#newPizza");
var pizzaFrame = document.getElementById("pizzaOrder");
var toppingsContainerId = document.getElementById("toppingsContainer");
var savePizzabuttonEl = document.querySelector("#savePizza");
var orders;

//Creates checkboxes for each topping
var toppingsContainer = [
  "Pepperoni",
  "Bacon",
  "Jalepenos",
  "Sausage",
  "Pineapple",
];

//hide the pizza  screen until add pizza is pressed
pizzaFrame.style.display = "none";
//hide topping options until until add pizza was pressed
toppingsContainerId.style.display = "none";

//creating  checkboxes for each topping
// toppingsContainer.forEach(function (topping) {
//   var checkbox = document.createElement("input");
//   checkbox.type = "checkbox";
//   checkbox.value = topping;

//   var label = document.createElement("label");
//   label.appendChild(document.createTextNode(topping));

//   var br = document.createElement("br");

//   container.appendChild(checkbox);
//   container.appendChild(label);
//   container.appendChild(br);

//   checkbox.addEventListener("change", function () {
//     checkboxClicked(checkbox);
//   });
// });
// //Make label for ingredients disapear  if selected
// function checkboxClicked(checkbox) {
//   var text = document.getElementById("text");
//   var checkboxValue = checkbox.value;

//   var ul = document.getElementById("pizzaIng");
//   if (!ul) {
//     ul = document.createElement("ul");
//     ul.id = "pizzaIng";
//     text.appendChild(ul);
//   }

//   var li = document.createElement("li");
//   li.textContent = checkboxValue;

//   if (checkbox.checked) {
//     checkbox.nextSibling.style.display = "none";
//     text.style.display = "inline";

//     var li = document.createElement("li");
//     li.textContent = checkboxValue;
//     ul.appendChild(li);
//     console.log(checkboxValue);
//   } else {
//     var lis = ul.getElementsByTagName("li");
//     for (var i = 0; i < lis.length; i++) {
//       if (lis[i].textContent === checkboxValue) {
//         ul.removeChild(lis[i]);
//         break;
//       }
//     }
//     if (ul.childElementCount === 0) {
//       text.style.display = "none";
//     }
//     checkbox.nextSibling.style.display = "inline";
//   }
// }
//add a pizza button
newPizzabuttonEl.addEventListener("click", function () {
  pizzaFrame.style.display = "block";
  toppingsContainerId.style.display = "block";
  //creating  checkboxes for each topping
toppingsContainer.forEach(function (topping) {
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = topping;

  var label = document.createElement("label");
  label.appendChild(document.createTextNode(topping));

  var br = document.createElement("br");

  container.appendChild(checkbox);
  container.appendChild(label);
  container.appendChild(br);

  checkbox.addEventListener("change", function () {
    checkboxClicked(checkbox);
  });
});
//Make label for ingredients disapear  if selected
function checkboxClicked(checkbox) {
  var text = document.getElementById("text");
  var checkboxValue = checkbox.value;

  var ul = document.getElementById("pizzaIng");
  if (!ul) {
    ul = document.createElement("ul");
    ul.id = "pizzaIng";
    text.appendChild(ul);
  }

  var li = document.createElement("li");
  li.textContent = checkboxValue;

  if (checkbox.checked) {
    checkbox.nextSibling.style.display = "none";
    text.style.display = "inline";

    var li = document.createElement("li");
    li.textContent = checkboxValue;
    ul.appendChild(li);
    console.log(checkboxValue);
  } else {
    var lis = ul.getElementsByTagName("li");
    for (var i = 0; i < lis.length; i++) {
      if (lis[i].textContent === checkboxValue) {
        ul.removeChild(lis[i]);
        break;
      }
    }
    if (ul.childElementCount === 0) {
      text.style.display = "none";
    }
    checkbox.nextSibling.style.display = "inline";
  }
}
  // console.log("new pizza created"); // to make sure create pizza button works
});

//once add pizza made add toppings to pizza and make it saveable
savePizzabuttonEl.addEventListener("click", function () {
  var orders = [];
  // var orders = document.getElementById('toppingsContainer').checked;
  var checkboxes = document.querySelectorAll(
    '#toppingsContainer input[type="checkbox"]'
  );
  checkboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      orders.push(checkbox.value);
    }
  });
  localStorage.setItem("pizzaOrders", JSON.stringify(orders));

  displaySavedOrders();
});

function displaySavedOrders() {
  var getOrders = localStorage.getItem("pizzaOrders");
  var getOrdersDiv = document.getElementById("yourOrders");
  if (getOrders) {
    var ordersArray = JSON.parse(getOrders);
    if (ordersArray.length > 0){
    getOrdersDiv.innerHTML = "pizza Toppings: " + ordersArray.join(' ,');
  } else {
    getOrdersDiv.innerHTML = "No pizza orders  saved.";
  }
    }else{

        getOrdersDiv.innerHTML = "No pizza orders  saved.";  
  }
}
// the  toppings are saved but  it does not save multiple pizzas 
// after the 'add to order' button is pressed reset pizza toppings 
// for each pizza  make the toppings a list 
// JIC : might have to attach the topping container so when the new pizza shows up it comes with checkboxes 
//have 'your orders' not show up until there has been an order submitted
//make able to edit and delete
//able to make multiple pizzas
