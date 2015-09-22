// implementation goes below here
var Event = function () {
    this.eventMap = {};
  
}

Event.prototype.on = function(event, cb) {
    this.eventMap[event] = (typeof this.eventMap[event] === 'undefined') ? [] : this.eventMap[event];  
    this.eventMap[event].push(cb);
}

Event.prototype.trigger = function(event, key, val) {
  var len = this.eventMap[event] && this.eventMap[event].length;
  if (len <= 0) return;
  var cbArray = this.eventMap[event];
  for (var i = 0; i < len; i++ ) {
      cbArray[i].apply(null, [key, val]);
  }
}


//inheriting from Event
var Model = function() {
    Event.apply(this);
    this.attr = {};
  
} 

Model.prototype = Object.create(Event.prototype);

Model.prototype.set = function(key, val) {
  try {
    
    this.attr[key] = val;
    this.trigger('change', key, val)
    this.trigger('change:' + key, key, val )
    return true;
  } catch (e) {
    console.log(e);
  }
}

Model.prototype.get = function(key) {
  if (!key) throw 'key required';
  return this.attr[key]
}

Model.prototype.has = function(key) {
//   return typeof this.attr[key] !== 'undefined'
  return  this.attr.hasOwnProperty(key);
        
} 

Model.prototype.unset = function(key) {
//   return typeof this.attr[key] !== 'undefined'
  delete this.attr[key];
        
} 




// make this work:
var person = new Model();

person.on('change', function(attr, value){
  console.log('Changed!', attr, value);
});

person.on('change:name', function(attr, value){
  console.log('Changed name!', value);
});

person.set('name', 'Hitesh');
person.set('eyeColor', 'blue');
person.set('car', undefined);

// should return 'Hitesh blue'
console.log(person.get('name'), person.get('eyeColor'));

// should return 'true false true'
console.log(person.has('name'), person.has('fur'), person.has('car'));

person.unset('eyeColor');

// should return '??? false'
console.log(person.get('eyeColor'), person.has('eyeColor'));