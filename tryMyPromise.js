const MyPromise = require("./MyPromise.js");

const promise = new MyPromise( (resolve, reject)=> {
    setTimeout(()=>{
        console.log('Timeout is here')
        resolve('My Promise is  fulfiled');
    }, 2000);

});

