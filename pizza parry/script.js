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

function disableToppingsCheckboxes(){
    var checkboxes =document.querySelectorAll('#toppingsContainer input[type="checkbox]');
    checkboxes.forEach(function(checkbox,){
        if(i !== index){
            checkbox.disabled = true;
        }
        
    });
}
function enableToppingsCheckboxes(){
    var checkboxes = document.querySelectorAll('#toppingsContainer input[type="checkbox"]');
    checkboxes.forEach(function(checkbox){
        checkbox.disabled = false;
    });
}

//once add pizza made add toppings to pizza and make it saveable
savePizzabuttonEl.addEventListener("click", function () {
    pizzaIng.innerHTML ='';
  //display your orders line
  yourOrdersId.style.display = "block";

  enableToppingsCheckboxes();

  var orders = [];
  // var orders = document.getElementById('toppingsContainer').checked;
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
  // does not allow duplicate pizzas to be made 
  var exsistingOrders = JSON.parse(localStorage.getItem('pizzaOrders')) || [];
  var orderExists = exsistingOrders.some(function(exsistingOrders){
    return JSON.stringify(exsistingOrders) === JSON.stringify(orders);
  });
  if(orderExists){
    alert("This pizza order already exists.");
  }else{
    exsistingOrders.push(orders);
    localStorage.setItem("pizzaOrders", JSON.stringify(exsistingOrders));
  }
  

  displaySavedOrders();
});
 //to add toppings to order 
function addTopping(orderIndex) {
    var newTopping = prompt("Enter the topping to add:");
    if (newTopping) {
      var orders = JSON.parse(localStorage.getItem("pizzaOrders")) || [];
      orders[orderIndex].push(newTopping);
      localStorage.setItem("pizzaOrders", JSON.stringify(orders));
      displaySavedOrders();
    }
  }
  //to remove toppings from order 
  function removeTopping(orderIndex){
    var toppingToRemove = prompt("Enter the topping to remove:")
    if(toppingToRemove){
     var orders =JSON.parse(localStorage.getItem('pizzaOrders')) || [];
        var order = orders[orderIndex];
        var index = order.indexOf(toppingToRemove);
        if(index !== -1){
            order.splice(index,1)
            localStorage.setItem("pizzaOrders",JSON.stringify(orders));
            displaySavedOrders();
        }else{
            alert("Topping not found in the order. ");
        }
    }
  }
// save and display multiple pizzas

function displaySavedOrders() {
  var getOrders = JSON.parse(localStorage.getItem("pizzaOrders")) || [];
  var getOrdersDiv = document.getElementById("yourOrders");
  if (getOrders.length > 0) {

    getOrdersDiv.innerHTML = '';
    getOrders.forEach(function(order,index){
        var listItem =document.createElement('li');
        listItem.textContent = "Pizza # " + (index + 1) + ": " + order.join(", ");
      
          //display checkboxes for toppings 
  var toppingsContainerDiv =document.createElement('div');
  toppingsContainerDiv.innerHTML = "Toppings: ";
  toppingsContainerDiv.setAttribute("class", "toppings-container-Div");
  
    //create checkbox for removing or adding toppings
  toppingsContainer.forEach(function(topping){
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = topping;
    checkbox.checked = order.includes(topping);
    var label = document.createElement('label');
    label.appendChild(document.createTextNode(topping));

    checkbox.addEventListener('change',function(event){
        updateOrder(index,topping,event.target.checked);
    });

    toppingsContainerDiv.appendChild(checkbox);
    toppingsContainerDiv.appendChild(label);

  })

    //Delete pizza from list of orders
    var deleteButton = document.createElement('button');
  deleteButton.textContent = "Delete pizza";
  deleteButton.addEventListener('click', function(){
    getOrders.splice (index, 1);
    localStorage.setItem("pizzaOrders", JSON.stringify(getOrders));
        deleteButton.parentNode.removeChild(deleteButton);
        displaySavedOrders();
  });

  listItem.appendChild(deleteButton);
  listItem.appendChild(toppingsContainerDiv);

  getOrdersDiv.appendChild(listItem);
});

  }else{
    getOrdersDiv.innerHTML = "No pizza orders saved.";
  }
}
function enableToppingsCheckboxes(){
    var checkboxes = document.querySelectorAll('#toppingsContainer input[type="checkbox"]');
    checkboxes.forEach(function(checkbox){
        checkbox.disabled=false;
    });
}
displaySavedOrders();
enableToppingsCheckboxes();


function updateOrder(orderIndex, topping, isChecked){
    var orders =JSON.parse(localStorage.getItem('pizzaOrders')) || [];
    var order = orders[orderIndex];
    if(isChecked) {
        //add topping yo order if checked
       if(!order.includes(topping)){
        order.push(topping);
       }
    }else{
    //remove topping from order if unchecked 
    var index = order.indexOf(topping);
    if(index !== -1){
        order.splice(index,1);
    }
    }
    localStorage.setItem('pizzaOrders',JSON.stringify(orders));
    displaySavedOrders();
}














