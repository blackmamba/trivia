<html>
<head>
  <meta charset="utf-8">
  <title>Mocha Spec Runner</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mocha/2.2.5/mocha.min.css">
</head>
<body>
  <div id="mocha"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mocha/2.2.5/mocha.min.js"></script>
  <script>mocha.setup('bdd');</script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/chai/3.2.0/chai.min.js"></script>
  <script>
    var assert = chai.assert;
    var expect = chai.expect;
    var should = chai.should();
  </script>
  <!-- bower:js -->
  <!-- endbower -->
  <!-- include source files here... -->
  <!-- include spec files here... -->
  <script src="spec/testfile.js"></script>

  <script src="cow.js"></script>
  <script>mocha.setup('bdd')</script>
  <script src="cow_test.js"></script>
  <script>mocha.run();</script>
  
</body>
</html>
