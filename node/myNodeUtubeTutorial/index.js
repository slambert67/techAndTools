//const add = require('./add.js');    // loads contents into index.js. .js is optional. Asking V8 to execute this code
                                    // returns value of module.exports
//require('./iife.js');

//console.log('hello from index.js');
//const sum = add(1,2);
//console.log(sum);

const PizzaShop = require('./pizza-shop');
const pizzaShop = new PizzaShop();
pizzaShop.on('order', (size,topping) => {
    console.log(`Order received! Baking a ${size} pizza with ${topping}`);
});
pizzaShop.order('large', 'mushrooms');
pizzaShop.displayOrderNumber();

