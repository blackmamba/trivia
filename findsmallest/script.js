// * Find the smallest character that is strictly larger than the search character, 
// * If no such character exists, return the smallest character in the array
    
 R = ['c', 'f', 'j', 'p', 'v']
 // if x equals:
 // 'a' => return 'c'
 // 'c' => return 'f'
 // 'k' => return 'p'
 // 'z' => return 'c' (wrap around case)

function findSmallest(arr, c ) {
    var len, index;
    if (!arr) {
        throw 'array required to proceed';
    }
    len = arr.length;
    if (len < 1 ) return;
   // if (length === 1) return arr[0];
    //
    index = arr.indexOf(c);
    
    if (c && index === -1) {
        arr.push(c);
    }         
    
    arr.sort(function(a,b){
        return a > b ? 1 : -1;
    });
    
    //[a, c, f, j, p, v];
    
    index = arr.indexOf(c);
    
    if (index !== -1 && index < len) {
        return arr[index+1];
    } else {
        //passed character is the largest
        return arr[0];
    }
    
        
}

console.log(findSmallest(R, 'z'));



//CSS Specificity

//important, id, class, element

