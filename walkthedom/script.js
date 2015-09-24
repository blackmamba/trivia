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
