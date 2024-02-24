const express = require ('express');
const mongoose = require ('mongoose');
const app = express();

mongoose.connect(
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

const PizzaOrder = model('PizzaOrder', pizzaOrderSchema);

app.use(express.json());

//prevents duplicate orders 

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
        const{toppings} = req.body;
        const pizzaOrder = new PizzaOrder({toppings});
        await pizzaOrder.save();
return res.status(201).json({ message:'Pizza order saved successfully'});
}catch (error){
    console.error('Error saving pizza order:',error);
    return res.status(500).json({message: 'Internal server error'});

    }
});

async function savePizzaOrder(orderData){
    try{
        const pizzaOrder = new PizzaOrder(orderData);
        await pizzaOrder.save();
        console.log('Pizza order saved successfully:',pizzaOrder);
    }catch(error){
        console.error('Error saving pizza order:', error);
    }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
});

savePizzaOrder({ toppings:['Pepperoni','Pineapple']});



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