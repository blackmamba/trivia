var arr = [[1,2,3], [4,5,6], [7,8,9]];

len = 3;


for (var i=0; i < (2*len)-1; i++) {
	for (var j=0; j<= i; j++) {
		
	if (i-j < len && j < len) 
		console.log(" row: %d, col: %d, val: %d      ", i-j,j, arr [i-j][j]); 

}
console.log("\n");
}


