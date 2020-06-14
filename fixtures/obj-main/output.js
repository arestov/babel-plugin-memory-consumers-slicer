function CustomMemGroup_line_2_column_13__funcname() {}

function CustomMemGroup_line_8_column_13__varname() {}

function CustomMemGroup_line_13_column_13__varname2() {}

function CustomMemGroup_line_19_column_15__propname1() {}

function CustomMemGroup_line_23_column_15__propname2() {}

function CustomMemGroup_line_17_column_10(arg0, arg1) {
  this.propname1 = arg0;
  this.propname2 = arg1;
}

function CustomMemGroup_line_30_column_15__methodname() {}

function funcname() {
  var data = new CustomMemGroup_line_2_column_13__funcname();
  return data;
}

var varname = function () {
  var data = new CustomMemGroup_line_8_column_13__varname();
  return data;
};

var varname2 = () => {
  var data = new CustomMemGroup_line_13_column_13__varname2();
  return data;
};

var obj = new CustomMemGroup_line_17_column_10(
  function () {
    var data = new CustomMemGroup_line_19_column_15__propname1();
    return data;
  },
  () => {
    var data = new CustomMemGroup_line_23_column_15__propname2();
    return data;
  }
);

class User {
  methodname() {
    var data = new CustomMemGroup_line_30_column_15__methodname();
    return data;
  }
}
