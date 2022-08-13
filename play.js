const promise = new Promise((resolve, reject) => {
	try {
		setTimeout(() => {
			console.log("Timeout triggers resolve");
			reject("done");
		}, 2000);
	} catch (error) {}
});

const secondPromise = promise
	.then(
		(result) => {
			console.log("1st chained Than after Resolved");
		},
		(error) => {
			console.log("Catched on second argument of then");
		}
	).then( ()=> { console.log('Hello')});

// promise.catch(() => {
// 	console.log("Catched");
// });

// console.log("----------------");
// console.log("secondPromise");
// console.log(secondPromise);
// console.log("----------------");

promise
	.then(
		(result) => {
			console.log("First promise .then() is executed now. Result is ");
			console.log(result);
		},
		(error) => {
			console.log("First promise .then() is executed now. Error is ");
			console.log(error);
		}
	)
	.catch();
