var throttle =
    function() {
        var handle;
        return function(time, cb) {
            if (!handle) {
                handle = setTimeout(function() {
                    cb();
                    // clearTimeout(handle);
                    handle = null;
                }, time);
            }
        }
    }()


function apiCall() {
    console.log('api call');
}



throttle(200, apiCall);
throttle(200, apiCall);
throttle(200, apiCall);

setTimeout(function(){
    throttle(200, apiCall);
}, 1000);