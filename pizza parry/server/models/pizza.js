const mongoose = require('mongoose');

mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Pizza-Parry',
{
    useNewUrlParser: true,
  useUnifiedTopology: true,
}
);
module.exports = mongoose.connection;

// pizza: id, toppings
const { Schema, model } = require('mongoose');

const pizzaOrderSchema = new Schema({
    toppings:[String],
});

const pizzaOrder = model('PizzaOrder', pizzaOrderSchema);

const savePizzaOrder = async (orderData) => {
    try{
        const pizzaOrder = new PizzaOrder(orderData);
        await pizzaOrder.save();
        console.log('Pizza order saved successfully:',pizzaOrder);
    }catch(error){
        console.error('Error saving pizza order:', error);
    }
};

savePizzaOrder({ toppings:['Pepperoni','Pineapple']});
