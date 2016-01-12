// function Event() {
//     this.events = {};
// }

// Event.prototype.on = function(eventName, cb) {
//     this.events[eventName] = this.events[eventName] || [];
//     if (typeof cb === 'function') {
//         this.events[eventName].push(cb)
//     }

// }

// Event.prototype.trigger = function(eventName, key, value) {
//     if (this.events[eventName]) {

//     }

// }


function Animal() {
    this.name = '';
    this.species = '';
    this.eat = '';
}

Animal.prototype.setName = function(name) {

    this.name = name;
    console.log("name set to: ", name);
}

Animal.prototype.getName = function() {

    console.log("name is: ", this.name);
}

Animal.prototype.setEat = function(eat) {
    this.eat = eat;
    console.log('eat set to:', eat);
}

Animal.prototype.setSpecies = function(species) {
    this.species = species;
}

//Cat Class
//
function Cat(config) {
    if (!this instanceof Cat) {
        console.log("Call this class with a new keyword");
        return;
    }

    Animal.call(this);
    config = config || {};
    this.name = config.name || 'Cutie';
    this.furColor = '';
}

Cat.prototype = Object.create(Animal.prototype);

Cat.prototype.constructor = Cat;

Cat.prototype.flag = true;

Cat.prototype.eating = function() {
    console.log('Nom Nom Nom');
}

Cat.prototype.purring = function() {
    console.log('purrrr');
}

var cat = new Cat();
cat.setName('hitu');
cat.getName();
//test cases
// console.log("furColor", cat.hasOwnProperty('furColor'));
// console.log("eat", cat.hasOwnProperty('eat'));
// console.log("purring", cat.hasOwnProperty('purring'));
// console.log("flag", cat.hasOwnProperty('flag'));

