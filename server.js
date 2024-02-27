const express = require ('express');
const path = require('path');
const mongoose = require ('mongoose');
const app = express();
const PORT = process.env.PORT || 3000 ;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/script.js', (req,res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname,'script.js'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/bundle.js', (req,res) => {
    res.type( 'application/javascript');
});


// app.listen(PORT,() =>{
//     console.log(`server is running on port ${PORT}`);
// });

mongoose
.connect(
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Pizza-Parry',
)
.then(()=>{
    console.log('MongoDB connected succssfully');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// module.exports = mongoose.connection;

// pizza: toppings
const { Schema, model } = require('mongoose');

const pizzaOrderSchema = new Schema({
    toppings:[String],
});
const PizzaOrder =mongoose.model('PizzaOrder', pizzaOrderSchema);

app.use(express.json());

//prevents duplicate orders 

app.post('/api/pizza-orders',async (req, res)=> {
    try{
        const { toppings } = req.body;
        const newOrder = await PizzaOrder.create({ toppings });
        res.status(201).json(newOrder);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
});

app.get('/api/pizza-orders',async (req,res) =>{
    try{
        const orders= await PizzaOrder.find();
        res.json(orders);
        // res.status(201).json(newOrder);
      } catch (error) {
        console.error('Error fetching pizza orders:', error)
        res.status(500).json({ error: 'Internal server error' });
      }
});


app.post('/api/check-duplicate', async (req, res) => {
    try {
        const { toppings } = req.body;
        // Check if a pizza order with the same toppings already exists in the database
        const existingOrder = await PizzaOrder.findOne({ toppings });
        if (existingOrder) {
            return res.status(409).json({ message: 'Duplicate pizza order found' });
        } else {
            return res.status(200).json({ message: 'No duplicate pizza order found' });
        }
    } catch (error) {
        console.error('Error checking for duplicate pizza order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
//saves pizza orders 
app.post('/api/pizza-order',async (req, res) => {
    try{
        const { toppings } = req.body;
        await savePizzaOrder({toppings});
        
        return res.status(201).json({ message:'Pizza order saved successfully'});
}catch (error){
    console.error('Error saving pizza order:',error);
    return res.status(500).json({message: 'Internal server error'});

    }
});
app.delete('/api/pizza-orders/:orderId',async (req,res) =>{
    try{
        const orderId = req.params.orderId;
        if(!orderId){
            return res.status(400).json({message: 'OrderID is required'});
        }
        const deletedOrder = await PizzaOrder.findByIdAndDelete(orderId);
        if (!deletedOrder){
            return res.status(404).json({message:'Pizza order not found'});
        }
        return res.status(200).json ({messgae:'Pizza order deleted successfully'});
    }catch(error){
        console.error('Error deleting pizza order:',error);
        return res.status(500).json({message:'Internal server error'});
    }
});
app.post('/api/update-order/:orderId', async(req, res) => {
    try{
        const {orderId} = req.params;
        const {topping,isChecked} = req.body;

        const order = await PizzaOrder.findById(orderId);
        if (!order){
            return res.status(404).json({message: 'Order not found' });
        } 
        if (isChecked) {
            order.toppings.push(topping);
        }else{
            const index = order.toppings. indexOf(topping);
            if(index != -1){
                order.toppings.splice(index, 1);
            }
        }
        await order.save();

        res. status(200).json({message:'Order updated successfully'});
        }catch(error){
            console.error('Error updating order:',error);
            res.status(500).json({error: 'Internal server error'});
        }
});
// async function displaySavedOrders() {
  
//     try {
//       const orders = await PizzaOrder.find();
//       var getOrdersDiv = document.getElementById("yourOrders");
//       getOrdersDiv.innerHTML = "";
  
//       orders.forEach(function (order, index) {
//         var listItem = document.createElement("li");
//         listItem.textContent =
//           "Pizza # " + (index + 1) + ": " + order.toppings.join(" , ");
  
//         var toppingsContainerDiv = document.createElement("div");
//         toppingsContainerDiv.innerHTML = "Toppings: ";
//         toppingsContainerDiv.setAttribute("class", "toppings-container-Div");
  
//         order.toppings.forEach(function (topping) {
//           var checkbox = document.createElement("input");
//           checkbox.type = "checkbox";
//           checkbox.value = topping;
//           checkbox.checked = true;
//           var label = document.createElement("label");
//           label.appendChild(document.createTextNode(topping));
  
//           toppingsContainerDiv.appendChild(checkbox);
//           toppingsContainerDiv.appendChild(label);
//         });
//         var deleteButton = document.createElement("button");
//         deleteButton.textContent = "Delete pizza";
//         deleteButton.addEventListener("click", function(){
//           deletepizzaOrder(order._id);
//         });
  
//         listItem.appendChild(deleteButton);
//         listItem.appendChild(toppingsContainerDiv);
//         getOrdersDiv.appendChild(listItem);
//       });
//     } catch (error) {
//       console.error("Error fetching pizza orders:", error);
//     }
//   }
  
//   async function deletePizzaOrder(orderId){
//     try{
//       const response = await fetch(`/api/pizza-orders/${orderId}`,{
//         method: "DELETE",
//       });
//       if(!response.ok){
//         throw new Error("Network response was not ok");
//       }
//       const data = await response.json();
//       console.log("Pizza order deleted successfully:", data);
//       displaySavedOrders();
//     } catch(error){
//       console.error("Error deleting pizza order:", error);
//       alert("Error deleting pizza order. Please try again.");
//     }
//   }

async function savePizzaOrder(orderData){
    try{
        const pizzaOrder = new PizzaOrder(orderData);
        await pizzaOrder.save();
        console.log('Pizza order saved successfully:',pizzaOrder);
    }catch(error){
        console.error('Error saving pizza order:', error);
    }
}
app.post('/api/add-topping/:orderId',async (req,res) => {
    try{
        const { orderId } = req.params;
        const { newTopping } = req.body;

        const pizzaOrder = await PizzaOrder.findById(orderId);

        if(!pizzaOrder){
            return res.status(404).json({message: 'Pizza order not found'});
        }
        pizzaOrder.toppings.push(newTopping);

        await pizzaOrder.save();

        return res.status(200).json({message: 'Topping added successfully',pizzaOrder});

    }catch (error){
        console.error('Error adding topping to pizza order:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
});
app.post('/api/remove-topping/:orderId',async (req, res) =>{
    try{
        const { orderId } = req.params;
        const { toppingToRemove } = req.body;

        const pizzaOrder = await PizzaOrder.findById(orderId);

        if(!pizzaOrder){
            return res.status(404).json({message: 'Pizza order not found'});
        }
        pizzaOrder.toppings.pull(toppingToRemove);

        await pizzaOrder.save();

        return res.status(200).json({message:'Topping removed successfully',pizzaOrder});
    }catch(error) {
        console.error('Error removing topping from pizza order:',error);
        return res.status(500).json({messgae: 'Internal server error'});
    }
});

// const PORT = process.env.PORT || 3000;

app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
});

//savePizzaOrder({ toppings:['Pepperoni','Pineapple']});



// const Port = process.env.Port || 3000;
// app.listen(Port,() =>{
//     console.log('Server is running on port ${PORT}');
// });
//objects will be pizza orders 
//post/create routes will be used to retrieve orders once saved and add new toppings
//get/read routes will be used to display orders and display toppings
//update routes will be used to update  the order based on changes in toppings and change in toppings themselves
//delete routes will be used to delete  pizzas  and toppings 
// the back end will use all CRUD methods in this project 
//virtuals that could be added could be to display which toppings was created besides the hard coded ones... maybe not