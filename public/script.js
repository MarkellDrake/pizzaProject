var pizzaIng = document.getElementById("pizzaIng");
var pizzaFrame = document.getElementById("pizzaOrder");
// var toppingsContainerId = document.getElementById("toppingsContainer");
var yourOrdersId = document.getElementById("yourOrdersHead");
var savePizzabuttonEl = document.querySelector("#savePizza");
var newPizzabuttonEl = document.querySelector("#newPizza");
var orders;
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
 
  //creating  checkboxes for each topping
  function displayToppings() {
    container.innerHTML = "";

    toppingsContainer.forEach(function (topping) {
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = topping;

      var label = document.createElement("label");
      label.appendChild(document.createTextNode(topping));

      //update existing toppping
      var editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", function (event) {
        event.preventDefault();
        var updatedTopping = prompt(
          "Enter the updated name of the topping:",
          topping
        );
        if (updatedTopping) {
          topping = updatedTopping;
          label.textContent = updatedTopping;
        }
      });
      //delete existing topping
      var deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function () {
        var index = toppingsContainer.indexOf(topping);
        if (index !== -1) {
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
    checkbox.addEventListener("change", function () {
      addTopping(orderId, checkbox);
    });
    checkbox.addEventListener("change", function () {
      removeTopping(orderIndex, checkbox);
    });
  }
  // var addIngredientButton = document.createElement("button");
  // addIngredientButton.textContent = "Add Topping"
  // addIngredientButton.addEventListener("click", function(){
  //   addToppingCheckbox();
  // });

  // if (toppingsDisplayed) {
  //   alert("Toppings have already been displayed.");
  // } else {
  //   pizzaFrame.style.display = "block";
  //   container.style.display = "block";
  //   displayToppings();
  //   toppingsDisplayed = true;
  //   document.body.appendChild(addIngredientButton,container);
  // }

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

// function disableToppingsCheckboxes(){
//     var checkboxes =document.querySelectorAll('#toppingsContainer input[type="checkbox]');
//     checkboxes.forEach(function(checkbox,){
//         if(i !== index){
//             checkbox.disabled = true;
//         }

//     });
// }
function enableToppingsCheckboxes() {
  var checkboxes = document.querySelectorAll(
    '#toppingsContainer input[type="checkbox"]'
  );
  checkboxes.forEach(function (checkbox) {
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
  checkboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      orders.push(checkbox.value);
      checkbox.checked = false; // after the 'add to order' button is pressed reset pizza toppings
      checkbox.nextSibling.style.display = "inline";
    }
  });
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
    .then((saveResponse) => {
      if (!saveResponse.ok) {
        throw new Error("Failed to save pizza order");
      }
      return saveResponse.json();
    })
    .then((data) => {
      console.log("Pizza order saved successfully:", data);
      displaySavedOrders();
    })
    .catch((error) => {
     console.error("Error saving pizza order:",error);
        alert("Error saving pizza order. Please try again.");
    });
});
async function displaySavedOrders(){
  try{ 
    const response = await fetch(`/api/pizza-orders`);
    if(!response.ok) {
      throw new Error('Failed to fetch saved orders');
    }
    const orders = await response.json();
    const yourOrders = document.getElementById('yourOrders');
    yourOrders.innerHTML = '';
    orders.forEach((order,index) => {
      const listItem = document.createElement('li');
      listItem.textContent = "Pizza # " + (index + 1) + ": " + order.toppings.join(" , ");

      //create delete button 
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', async () =>{
        try{
          await deletePizzaOrder(order._id);
        }catch(error){
          console.error( ' Error deleting pizza order:', error);
          alert('Error deleting pizza order. Please try again.');
        }
      });
      listItem.appendChild(deleteButton);
      yourOrders.appendChild(listItem);
    });
  } catch (error){
    console.error('Error fetching saved orders:', error);
  }
}
async function deletePizzaOrder(orderId){
  try{
    const response = await fetch(`/api/pizza-orders/${orderId}`,{
      method: "DELETE",
    });
    if(!response.ok){
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("Pizza order deleted successfully:", data);
    displaySavedOrders();
  } catch(error){
    console.error("Error deleting pizza order:", error);
    throw new Error("Error deleting pizza order. Please try again.");
  }
}
async function updateOrder(orderId, topping, isChecked) {
  try{
    const respons = await fetch (`/api/update-order/${orderId}`,{
      method:"POST",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({topping,isChecked}),
    });
    if (!response.ok){
      throw new Error("Failed to update order");
    }
    const data = await response.json();
    console.log("Order updated successfully:",data);
  } catch(error) {
    console.error("Error updating order:",error);
    alert("Error updating order. Please try again.");
  }
  }
  var orders = JSON.parse(localStorage.getItem("pizzaOrders")) || [];
  var order = orders[orderIndex];
  if (isChecked) {
    //add topping to order if checked
    if (!order.includes(topping)) {
      order.push(topping);
    }
  } else {
    //remove topping from order if unchecked
    var index = order.indexOf(topping);
    if (index !== -1) {
      order.splice(index, 1);
    }
  }
  localStorage.setItem("pizzaOrders", JSON.stringify(orders));
  // displaySavedOrders();
//   // does not allow duplicate pizzas to be made
//   var exsistingOrders = JSON.parse(localStorage.getItem('pizzaOrders')) || [];
//   var orderExists = exsistingOrders.some(function(exsistingOrders){
//     return JSON.stringify(exsistingOrders) === JSON.stringify(orders);
//   });
//   if(orderExists){
//     alert("This pizza order already exists.");
//   }else{
//     exsistingOrders.push(orders);
//     localStorage.setItem("pizzaOrders", JSON.stringify(exsistingOrders));
//   }

//   displaySavedOrders();
// });
//to add toppings to order
function addTopping(orderId) {
  var newTopping = prompt("Enter the topping to add:");
  if (newTopping) {
    var orders = JSON.parse(localStorage.getItem("pizzaOrders")) || [];
    orders[orderIndex].push(newTopping);
    localStorage.setItem("pizzaOrders", JSON.stringify(orders));
    // displaySavedOrders();

    fetch(`/api/add-topping/${orderId}`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newTopping }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Topping added successfully:", data);
      })
      .catch((error) => {
        console.error("Error adding topping:", error);
        alert("Error adding topping.Please try again.");
      });

     

    var orders = JSON.parse(localStorage.getItem("pizzaOrders")) || [];
    orders[orderIndex].push(newTopping);
    localStorage.setItem("pizzaOrders", JSON.stringify(orders));
    // displaySavedOrders();
  }
  checkbox.addEventListener("change", function () {
    updateOrder(orderId, checkbox.value, checkbox.checked);
  });
}
//to remove toppings from order
function removeTopping(orderIndex) {
  var orderId = "";
  var toppingToRemove = prompt("Enter the topping to remove:");
  if (toppingToRemove) {
    fetch(`/api/remove-topping/${orderId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toppingToRemove }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Topping removed sucessfully:", data);
        displaySavedOrders();
      })
      .catch((error) => {
        console.error("Error removing topping:", error);
        alert("Error removing topping. Please try again.");
      });

     
    //    var orders =JSON.parse(localStorage.getItem('pizzaOrders')) || [];
    //       var order = orders[orderIndex];
    //       var index = order.indexOf(toppingToRemove);
    //       if(index !== -1){
    //           order.splice(index,1)
    //           localStorage.setItem("pizzaOrders",JSON.stringify(orders));
    //           displaySavedOrders();
    //       }else{
    //           alert("Topping not found in the order. ");
    //       }
  }
  checkbox.addEventListener("change", function () {
    updateOrder(orderId, checkbox.value, checkbox.checked);
  });
}
// save and display multiple pizzas

//  async function displaySavedOrders() {
//   const PizzaOrder = mongoose.model("PizzaOrder", pizzaOrderSchema);
//   try {
//     const orders = await PizzaOrder.find();
//     var getOrdersDiv = document.getElementById("yourOrders");
//     getOrdersDiv.innerHTML = "";

//     orders.forEach(function (order, index) {
//       var listItem = document.createElement("li");
//       listItem.textContent =
//         "Pizza # " + (index + 1) + ": " + order.toppings.join(" , ");

//       var toppingsContainerDiv = document.createElement("div");
//       toppingsContainerDiv.innerHTML = "Toppings: ";
//       toppingsContainerDiv.setAttribute("class", "toppings-container-Div");

//       order.toppings.forEach(function (topping) {
//         var checkbox = document.createElement("input");
//         checkbox.type = "checkbox";
//         checkbox.value = topping;
//         checkbox.checked = true;
//         var label = document.createElement("label");
//         label.appendChild(document.createTextNode(topping));

//         toppingsContainerDiv.appendChild(checkbox);
//         toppingsContainerDiv.appendChild(label);
//       });
//       var deleteButton = document.createElement("button");
//       deleteButton.textContent = "Delete pizza";
//       deleteButton.addEventListener("click", function(){
//         deletepizzaOrder(order._id);
//       });

//       listItem.appendChild(deleteButton);
//       listItem.appendChild(toppingsContainerDiv);
//       getOrdersDiv.appendChild(listItem);
//     });
//   } catch (error) {
//     console.error("Error fetching pizza orders:", error);
//   }
// }

// async function deletePizzaOrder(orderId){
//   try{
//     const response = await fetch(`/api/pizza-orders/${orderId}`,{
//       method: "DELETE",
//     });
//     if(!response.ok){
//       throw new Error("Network response was not ok");
//     }
//     const data = await response.json();
//     console.log("Pizza order deleted successfully:", data);
//     displaySavedOrders();
//   } catch(error){
//     console.error("Error deleting pizza order:", error);
//     alert("Error deleting pizza order. Please try again.");
//   }
// }

//     //Delete pizza from list of orders
//     var deleteButton = document.createElement('button');
//   deleteButton.textContent = "Delete pizza";
//   deleteButton.addEventListener('click', function(){
//     getOrders.splice (index, 1);
//     localStorage.setItem("pizzaOrders", JSON.stringify(getOrders));
//         deleteButton.parentNode.removeChild(deleteButton);
//         displaySavedOrders();
//   });

//   listItem.appendChild(deleteButton);
//   listItem.appendChild(toppingsContainerDiv);

//   getOrdersDiv.appendChild(listItem);
// });

//   }else{
//     getOrdersDiv.innerHTML = "No pizza orders saved.";
//   }
// }
// function enableToppingsCheckboxes() {
//   var checkboxes = document.querySelectorAll(
//     '#toppingsContainer input[type="checkbox"]'
//   );
//   checkboxes.forEach(function (checkbox) {
//     checkbox.disabled = false;
//   });
// }
// displaySavedOrders();
enableToppingsCheckboxes();

