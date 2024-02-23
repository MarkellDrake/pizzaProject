const express = require('express');

const mongoose = require('mongoose');
    mongoose.connect(

    )

const app = express();
const port = 3001;


//objects will be pizza orders 
//post/create routes will be used to retrieve orders once saved and add new toppings
//get/read routes will be used to display orders and display toppings
//update routes will be used to update  the order based on changes in toppings and change in toppings themselves
//delete routes will be used to delete  pizzas  and toppings 
// the back end will use all CRUD methods in this project 
//virtuals that could be added could be to display which toppings was created besides the hard coded ones... maybe not