/**
 * Mulesoft interview Question for a Senior frontend engineer
 * Two hour coding exercise.
 * 
 * Write a roboarm which a number 'n' and generates 0 .. n-1 elements, and also accepts a string of commands seperated by '\n' character
 * The commands are of the following two form:
 * move(a, b) 
 * quit
 * move a -> b moves 'data' element 'a' on top of 'data' element 'b' (not the data element as position/index a on top of index b)
 * if there are any existing elements top of a while you're moving a, all the existing data elements have to be moved back to its original index position
 *
 * If a, and be are aleady on the same index position, ignore the move operation
 * If a and b are equal ignore the move operation
 */

var num = 8;
var input = "move 7 onto 1 \nmove 5 onto 1 \nmove 1 onto 6 \nmove 4 onto 3 \nmove 1 onto 4 \nmove 3 onto 1 \nmove 5 onto 2 \nmove 4 onto 5 \nquit";


var RoboArm = function (num, input) {
  this.map = {};
  this.num = num;
  this.curPos = {};
//  debugger;
  for (var i =0; i < num; i++) {

    this.map [i] = [i];
    this.curPos[i] = i;
  }
  
  this.inputmap = input.split('\n');
  var len = this.inputmap.length;
   
  for (var i = 0; i < len; i++) {
    if (this.inputmap[i] === 'quit') {
      break;
    }
    var ex =  this.inputmap[i].split(' ');
    var a = +ex[1]; b = +ex[3];
    this.move(+a, +b);
    // this.printMap();
  }
}

RoboArm.prototype = {
  move : function (a, b) {
  //error checking
    if (a==b) { 
      return; 
    } else if  (this.onSameBlock(a,b)) {
      return;
    }
  
    //get position of a 
    
    if(this.clearBlock(a) /*&& this.clearBlock(b)*/) {
      var posa = this.curPos[a];
      var posb = this.curPos[b];
      this.map[posb].push(a);
      this.curPos[a] = posb;
    }
    
    
/*    if (this.map[posa].length === 1  ) {
      //array contains exactly one element, simple case
      //find position of b and move a to it
      var posb = this.curPos[b];
      this.map[posb].push(a);
      
      //remove a from the old place
      this.map[posa] = [];
      this.curPos[a] = posb;
    } else {
      //case where 
      
    }*/
  
  },
  clearBlock: function(a) {
    //get current position of a
    var posa = this.curPos[a];
    var arr = this.map[posa];
    var len = arr.length;
    if (len === 1) {
      //position is already cleared;
      arr.pop();
      return true;
    } else if (len > 1) {
      var ind = arr.indexOf(a);
      if (ind < len -1) {
        //not the last element
       
        var item;
        for (var i = len-1 ; i > ind; i--) {
          //run a loop from the last element to one index gerater than the index of block to be cleared
          //also update the position in the curPos map
          item = arr.pop();
          this.map[item].push(item);
          this.curPos[item] = item;
        }//end of for
        //shortened the array
        
      }
      //for the case where the index is last data element and once we clear all the elements above the desired
      //data element we just have to pop our desired element and return 
      arr.pop();
      return true;
    }
    
  },
  onSameBlock: function(a,b) {

    return this.curPos[a] === this.curPos[b];
  },
  
  updatePosition: function(a, block) {
    //a = data, block = position;
    this.curPos[a] = block; 
    
  },
  
  printMap: function() {
    var map = this.map;
    var arr;
    for( var i =0; i < this.num; i++ ) {
      console.log(map[i].toString());
    }
  }
  
}//end of prototype  

roboarm = new RoboArm(num, input);
roboarm.printMap();