const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const app = express();
const shoppersRoute = require('./routes/shoppers');
const shopping_itemsRoute = require('./routes/shopping_items');
const shopping_listsRoute = require('./routes/shopping_lists');

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/shoppers', shoppersRoute);
app.use('/shopping_items', shopping_itemsRoute);
app.use('/shopping_lists', shopping_listsRoute);

module.exports = app;