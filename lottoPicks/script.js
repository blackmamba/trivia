var nums = ['1', '42', '100848', '4938532894754', '1234567', '472844278465445', '4938532894747'];


function lottoHelper() {
    var lottoPicks = [];
    nums.forEach(function(item, index, array) {
        if (item.length < 7) return false;
        if (item.length === 7) {
            lottoPicks.push(item.split('').join(' '));
        } 

        var numArr = item.split('');
        var len = numArr.length, num;
        var ticket = [];
        for (var i = 0; i < len; i++) {
            num = parseInt(numArr[i]);
            if (num <= 5 && i < (numArr.length - 1)) {
                num *= 10;
                num += parseInt(numArr[i + 1]);
                i += 1;
                // continue;
            } 
            //unique numbers
            if (ticket.indexOf(num) == -1) {
              ticket.push(num);
            }
            if (ticket.length > 7) break;

        }

        if (ticket.length === 7) {
            lottoPicks.push(ticket.join(' '));
        }



    });

    console.log('*** lottoPicks: ', lottoPicks);
    return lottoPicks;
}
lottoHelper();
