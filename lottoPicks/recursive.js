/**
 * @author: Priya Deo
 */

var nums = ['1', '42', '100848', '1008489', '4938532894754', '1234567', '472844278465445', '4938532894747'];

var findValidTickets = function(number, validTickets) {
  if (number < 1 || number > 59) {
    return [];
  }
  if (validTickets.length < 1) {
    return [];
  }
  stillValidTickets = [];
  for (var i = 0; i < validTickets.length; ++i) {
    ticket = validTickets[i];
    // DUUUUDDDEE this test for uniqueness.
    if ($.inArray(number, ticket) === -1) {
      ticket.unshift(number);
      stillValidTickets.push(ticket);
    }
  }
  return stillValidTickets;
}

var lottoRecursion = function(myString, num_digits) {
  // Invalid cases.
  if (myString.length < num_digits) {
    return [];
  }
  if (myString.length > 2 * num_digits) {
    return [];
  }
  valid_lotto_picks = [];
  // Base Case
  if (num_digits == 1) {
    ticket_number = parseInt(myString);
    if (ticket_number > 59 || ticket_number < 1) {
        return [];
    }
    
    tmp_array = [];
    tmp_array.push(ticket_number);
    valid_lotto_picks.push(tmp_array);
    return valid_lotto_picks;
  }
  // Take of 1 char.
  ticket_number1 = parseInt(myString[0]);
  ticketSet1 = findValidTickets(ticket_number1,
        lottoRecursion(myString.substring(1), num_digits - 1));
  
  // Take of 2 chars.
  ticket_number2 = parseInt(myString.substring(0, 2));
  ticketSet2 = findValidTickets(ticket_number2, 
        lottoRecursion(myString.substring(2), num_digits - 1));
            
  return ticketSet1.concat(ticketSet2);
}


var lottoHelper = function() {
  var lottoPicks = [];
  nums.forEach(function(item, index, array) {
    validTickets = lottoRecursion(item, 7);
    console.log("item: " + item + " valid tickets: ", validTickets);
    // Concat is not working.
    lottoPicks.concat(validTickets);
  });

  console.log('*** lottoPicks: ', lottoPicks);
  return lottoPicks.map(function(item) {
    return '<li>' + item + '</li>';
  }).join('');
}
document.getElementById('output').innerHTML = lottoHelper();
