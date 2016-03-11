// Your implementation here.
$$ = tQuery = function(str, context) {
    if (!(this instanceof tQuery)) {
        return new tQuery(str);
    }
    var els;
    Object.assign(this, Array.prototype);
    var els = typeof context !== 'undefined' ? context.querySelectorAll(str) : document.querySelectorAll(str)
    this.elArr = Array.prototype.slice.apply(els);
    Object.assign(this, this.elArr);
    this.oldForEach = this.elArr.forEach;
    // var that = this;

    // return elArr;
}


tQuery.prototype = {
    constructor: tQuery,
    get length() {
        return this.elArr.length;
    },
    forEach: function(cb) {
        this.oldForEach.call(this.elArr, function(el, i, arr) {
            cb.call(el, el, i, arr);
        });
        // return this.elArr;
    }



}
