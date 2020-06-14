function functionName() {
  // wrong define 1
  define(function () {
    var varname = function() {
      var data = {};
      return data;
    }
  })
}
