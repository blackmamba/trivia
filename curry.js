/*
	can run it by calling 
	node curry.js
	on the terminal
*/


function add (a, b) {
    return a + b;
  
}
Function.prototype.curry = function() {
    var slice = Array.prototype.slice, 
        args = slice.apply(arguments), 
        that = this;

  
  return function() {
      return that.apply(null, args.concat(slice.apply(arguments)));
    
  }
  
}


var add1 = add.curry(1);
console.log(add1(6));


