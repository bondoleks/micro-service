const { myName, myHobbies, myNumb } = require('./multiple-exports');
const greeting = require('./single-export');

console.log(myName);
greeting(myName);
