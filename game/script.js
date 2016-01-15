window.onload = function() {
    var colors = ['red', 'blue', 'green', 'yellow'];
    var right = document.getElementById("right");
    var el = document.getElementById("left");
    right.addEventListener('click', function(e) {
        var tar = e.target;
        if (tar.tagName.toLowerCase() == 'div' && tar.className.indexOf('colored') > 0) {
            // var el = document.getElementById("left")
            el.style.backgroundColor = tar.className.split(' ')[2];            
        }
        


    });
    var counter = 0, handle;
    function highlight() {
        if(counter === 5) {
            clearInterval(handle);
            //call a helper function to prompt the user to click on the colors
            
        }
        
        el.style.backgroundColor = colors[Math.floor(Math.random() * 4)];
        //push these values in an array in the sequence they're generated

        //store
        counter +=1;
    }

/*
helper function
attached event delegation to the right box
as the user clicks store the colors in a new array in the sequence they're clicked
once the user clicks 5 times detach events to allow further wrong entries
now match this array with the previous stored color arrays
and compare arrays and give appropriate results
 */


    handle = window.setInterval(highlight, 1000);

}