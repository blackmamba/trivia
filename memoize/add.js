/*write a function to add two numbers and momoize*/
var add = function() {
    var memo = [];
    return function(a, b) {
        if (memo[a] && memo[a][b] !== 'undefined') {
            console.log('memoized result');
            return memo[a][b];
        } else {
            console.log('first calculation result');
            if (!memo[a]) {
                memo[a] = [];
            }
            return memo[a][b] = a + b;
        }

    }
}();


add(1, 2);
add(1, 2)
