 function biggest() {
    var slice = Array.prototype.slice;
    var args = slice.apply(arguments);
    var greatest;
    if (args.length ===1) return args[0];
    args.forEach(function(element, index, arr){
    	if (!greatest) {
            greatest = +element;
        } else {
         	if (greatest < +element) {
             	greatest = +element;   
            }    
        }    
            
    });
    return greatest;
    
}





/*
    O         O
   / \       / \
  O   O     O   O
     /|\       /|\
    O O O     O O O

Assume two trees with root rootA and rootB, rootB tree being a clone of rootA tree.  Write a function which take a node in rootA and finds a clone node in other tree.
*/


var rootA;
var rootB;
function findClone(Node) { /* ... */ 
    var foundNode;
	walkTheDom(rootB, function(r ){
     	return isEqual(r, Node);   
    }    
}

function walkTheDom(root, cb) {
 	if (!root) {
    	return;
    }
    var r = root;   
	if (cb (r)) {
        foundNode = r;
    	return;
    }    
    r = r.firstChild;
    
    while (r) {
     	walkTheDom(r);
        r = r.nextSibling;
    }    
	    
}    


function isEqual (node1, node2) {
 	//returns true if two nodes are equal else returns false

}    
    
findClone(node);    
