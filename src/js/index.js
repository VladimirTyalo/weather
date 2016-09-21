"use strict";

import old from "./vendor/old";

old();

alert("1 3 3");

var fn = () => console.log("Hello");
fn();

function* gen(){
  yield 1;
  yield 2;
  yield 3;
}


var it = gen();
console.log(it.next());
console.log(it.next());
console.log(it.next());


