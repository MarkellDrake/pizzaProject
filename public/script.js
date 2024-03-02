var pizzaIng = document.getElementById("pizzaIng");
var pizzaFrame = document.getElementById("pizzaOrder");
var toppingsContainerId = document.getElementById("toppingsContainer");
var yourOrdersId = document.getElementById("yourOrdersHead");
// var yourOrdersId = document.getElementById("editOptions");
var savePizzabuttonEl = document.querySelector("#savePizza");
var newPizzabuttonEl = document.querySelector("#newPizza");
 var orderIndex = 0;
var orders;
const selectedToppings =  new Set();
var toppingsDisplayed = false;

var container = document.getElementById("toppingsContainer");
container.style.display = "none";

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

//hide your orders until save pizza has been pressed
yourOrdersId.style.display = "none";

//add a pizza button
newPizzabuttonEl.addEventListener("click", function () {

     //function to add topping to topping list 
function addToppingCheckbox(){       
    var newTopping = prompt("Enter the name of the new topping:");
    //prevent toppings  from duplicating 
    if (newTopping){
        var exists = toppingsContainer.some(function(topping){
            return topping.toLowerCase() === newTopping.toLowerCase();
        });
        if (exists){
            alert("This topping already exists. ");
            return;
        }
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = newTopping;

        var label = document.createElement("label");
        label.appendChild(document.createTextNode(newTopping));

        var editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", function (event){
            event.preventDefault();
            var updatedTopping = prompt("Enter the updated name of the topping:", checkbox.value);
            if (updatedTopping){
                checkbox.value = updatedTopping;
                label.textContent = updatedTopping;
            }
        });

        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function(){
            checkbox.parentNode.removeChild(label);
            checkbox.parentNode.removeChild(checkbox);
            editButton.parentNode.removeChild(editButton);
            deleteButton.parentNode.removeChild(deleteButton);
            br.parentNode.removeChild(br);
        });
            var br = document.createElement("br");

            
            console.log("toppings conatiner:", toppingsContainer);
            
            container.appendChild(checkbox);
            container.appendChild(label);
            container.appendChild(editButton);
            container.appendChild(deleteButton);
            container.appendChild(br);

            console.log("buttons appended to toppings container.")
            ////able to add another topping to list of toppings 
            toppingsContainer.push(newTopping);

            checkbox.addEventListener("change", function(){
                checkboxClicked(checkbox);
            });

    }
  }
  //creating  checkboxes for each topping
  function displayToppings() {
    toppingsContainer.forEach(function (topping) {
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = topping;

      var label = document.createElement("label");
      label.appendChild(document.createTextNode(topping));

      //update existing toppping 
      var editButton= document.createElement('button');
      editButton.textContent = "Edit";
      editButton.addEventListener('click', function(event){
        event.preventDefault();
        var updatedTopping = prompt('Enter the updated name of the topping:', topping);
        if(updatedTopping){
            topping = updatedTopping;
            label.textContent = updatedTopping;
        }
      });
      //delete existing topping 
      var deleteButton = document.createElement('button');
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener('click', function(){
        var index = toppingsContainer.indexOf(topping);
        if (index !== -1){
            toppingsContainer.splice(index, 1);

            checkbox.parentNode.removeChild(checkbox);
            label.parentNode.removeChild(label);
            editButton.parentNode.removeChild(editButton);
            deleteButton.parentNode.removeChild(deleteButton);
            br.parentNode.removeChild(br);
        }
      });

      var br = document.createElement("br");

      container.appendChild(checkbox);
      container.appendChild(label);
      container.appendChild(editButton);
      container.appendChild(deleteButton);
      container.appendChild(br);

      checkbox.addEventListener("change", function () {
        checkboxClicked(checkbox);
      });
    });
  }
  var addIngredientButton = document.createElement("button");
  addIngredientButton.textContent = "Add Topping"
  addIngredientButton.addEventListener("click", function(){
    addToppingCheckbox();
  });

  if (toppingsDisplayed) {
    alert("Toppings have already been displayed.");
  } else {
    pizzaFrame.style.display = "block";
    container.style.display = "block";
    displayToppings();
    toppingsDisplayed = true;
    document.body.appendChild(addIngredientButton,container);
  }
 
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


function enableToppingsCheckboxes(){
    var checkboxes = document.querySelectorAll('#toppingsContainer input[type="checkbox"]');
    checkboxes.forEach(function(checkbox){
        checkbox.disabled = false;
    });
}

//once add pizza made add toppings to pizza and make it saveable
savePizzabuttonEl.addEventListener("click", function () {
  pizzaIng.innerHTML = "";
  //display your orders line
  yourOrdersId.style.display = "block";
  enableToppingsCheckboxes();

  var orders = [];
  var checkboxes = document.querySelectorAll(
    '#toppingsContainer input[type="checkbox"]'
  );
  var anyToppingSelected = false;
  checkboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      anyToppingSelected = true;
      orders.push(checkbox.value);
      checkbox.checked = false; // after the 'add to order' button is pressed reset pizza toppings
      checkbox.nextSibling.style.display = "inline";
    }
  });

  if (!anyToppingSelected) {
    alert("Please select at least one topping to save the order.");
    return;
  }

  fetch(`/api/check-duplicate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ toppings: orders }),
  })
    .then((response) => {
      if (response.status === 409) {
        throw new Error("Duplicate pizza order found");
      }
      return response.json();
    })
    .then(() => {
      return fetch(`/api/pizza-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toppings: orders }),
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Pizza order saved successfully:", data);

      displaySavedOrders();
    })
    .catch((error) => {
      if (error.message === "Duplicate pizza order found") {
        alert("This pizza order already exists.");
      } else {
        console.error("Error saving pizza order:", error);
        alert("Error saving pizza order. Please try again.");
      }
    });
});


async function displaySavedOrders() {
  try {
    const response = await fetch(`/api/pizza-orders`);
    if (!response.ok) {
      throw new Error("Failed to fetch saved orders");
    }
    const orders = await response.json();
    const yourOrders = document.getElementById("yourOrders");
    yourOrders.innerHTML = "";

    orders.forEach((order, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = "Pizza # " + (index + 1) + ": " + order.toppings.join(" , ");

      var deleteButton = document.createElement('button');
   deleteButton.textContent = "Delete";
   deleteButton.addEventListener('click', async() => {
    try {
      await deletePizzaOrder(order._id);

      yourOrders.removeChild(listItem);
  } catch (error) {
    console.error("Error fetching saved orders:", error);
    alert("Error deleting pizza order. Please try again.");
  }
});

var editButton = document.createElement('button');
editButton.textContent = "Edit";
editButton.addEventListener('click', () => {
  // Function to handle editing the order
  editOrder(order);
});


    listItem.appendChild(deleteButton);
    listItem.appendChild(editButton);

    yourOrders.appendChild(listItem);
    });
  }catch(error){
    console.error("Error fetching saved orders:", error);
  }
}
function editOrder(order){
  const yourOrders = document.getElementById("yourOrders");
  yourOrders.innerHTML = "";

  const form = document.createElement('form');

  toppingsContainer.forEach(topping => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = topping;
    checkbox.checked = order.toppings.includes(topping); // Check if the topping is already selected for this order
    checkbox.id = topping;

    const label = document.createElement('label');
    label.htmlFor = topping;
    label.textContent = topping;

    form.appendChild(checkbox);
    form.appendChild(label);
    form.appendChild(document.createElement('br'));
});
const saveButton = document.createElement('button');
  saveButton.textContent = 'Save Changes';
  saveButton.addEventListener('click', async () => {
    // Get the list of selected toppings
    const selectedToppings = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

    try{
      const response = await fetch(`/api/update-order/${order._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ toppings: selectedToppings })
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      // Refresh the displayed orders
      displaySavedOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order. Please try again.');
    }
  });
    yourOrders.appendChild(form);
    yourOrders.appendChild(saveButton);
    }

   //Delete pizza from list of orders
   
  //    getOrders.splice (index, 1);
  //        deleteButton.parentNode.removeChild(deleteButton);
  //        displaySavedOrders();
  //  });
async function deletePizzaOrder(orderId) {
  try {
    const response = await fetch(`/api/pizza-orders/${orderId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("Pizza order deleted successfully:", data);
    return data;
  } catch (error) {
    console.error("Error deleting pizza order:", error);
    throw new Error("Error deleting pizza order. Please try again.");
  }
}
async function isEditedOrderUnique(orderId, editedOrder) {
  try {
    const response = await fetch(`/api/pizza-orders`);
    if (!response.ok) {
      throw new Error("Failed to fetch saved orders");
    }
    const existingOrders = await response.json();

    const filteredOrders = existingOrders.filter((order) => order._id !== orderId);

    for (const order of filteredOrders) {
      if (arraysEqual(editedOrder.toppings, order.toppings)) {
        alert('this pissa already exists');
        return false; // Duplicate order found
      }
    }
    return true; // No duplicate order found
  } catch (error) {
    console.error("Error checking for unique edited order:", error);
    throw new Error("Error checking for unique edited order. Please try again.");
  }
}
