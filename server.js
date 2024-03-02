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
      } catch (error) {
        console.error('Error fetching pizza orders:', error)
        res.status(500).json({ error: 'Internal server error' });
      }
});


app.post('/api/check-duplicate', async (req, res) => {
    try {
        const { toppings } = req.body;
        // Check if a pizza order with the same toppings already exists in the database
        const existingOrder = await PizzaOrder.findOne({ toppings});

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
        const pizzaOrder = new PizzaOrder(toppings);
        await pizzaOrder.save();
      
        console.log('Pizza order saved successfully:',pizzaOrder);
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
        const {toppings} = req.body;

        if (!orderId || !Array.isArray(toppings)){
            return res.status(400).json({message: 'Invalid request data' });
        } 

        const order = await PizzaOrder.findByIdAndUpdate(orderId,{toppings},{new: true});

        if (!order){
            return res.status(404).json({message:'Order not found'});
        }
        res. status(200).json({message:'Order updated successfully'});
        
    }catch(error){
        console.error('Error updating order:',error);
        res.status(500).json({error: 'Internal server error'});
    }
});


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
//add new toppings to toppings array 
app.post(`/api/add-topping`,async (req,res) => {
    try {
        const {newTopping } = req.body;
         const pizzaOrder = new PizzaOrder({toppings: [newTopping] });
         await pizzaOrder.save();

         const response = await fetch(`/api/get-toppings`);
         const { toppings} = await response.json();

         const allToppings = [...toppings,newTopping];

        res.status(200).json({newTopping,allToppings});
    }catch(error){
        console.error('Error adding topping:', error);
        res.status(500).json({error:'Internal server error'});
    }
});
// retrieve  toppings and update topping container
app.get(`/api/get-toppings`,async (req, res) => {
    try {
        const orders = await PizzaOrder.find();
        // Extract all unique toppings from pizzaOrder array
        const dbToppings = orders.reduce((toppings, order) => {
            order.toppings.forEach(topping => {
                if (!toppings.includes(topping)) {
                    toppings.push(topping);
                }
            });
            return toppings;
        }, []);
        const hardcodedToppings = [
            "Pepperoni",
            "Bacon",
            "Jalepenos",
            "Sausage",
            "Pineapple"

        ];
        const allToppings = [...dbToppings,...hardcodedToppings];

        res.status(200).json({ toppings: allToppings });
    } catch (error) {
        console.error('Error fetching toppings:', error);
        res.status(500).json({ error: 'Internal server error' });
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



app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
});
