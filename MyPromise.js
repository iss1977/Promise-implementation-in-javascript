const STATE = {
	FULFILLED: "fulfilled",
	REJECTED: "rejected",
	PENDING: "pending",
};

class MyPromise {
	#thenCallbackArr = []; // will store all resolved (then) callbacks.
	#catchCallbackArr = []; // will store all rejected (catch) callbacks.
	#state = STATE.PENDING; // pending, fulfilled, rejected
	#value; // will hold the success or fail value of the promise

	constructor(cb) {
		try {
			cb(this.#onSuccess, this.#onFailure);
		} catch (error) {
			this.#onFailure(error);
		}
	}

	#runCallbacks() {
		if (this.#state === STATE.FULFILLED) {
			this.#thenCallbackArr.forEach((callback) => {
				callback(this.#value);
			});
			this.#thenCallbackArr = []; // once executed callbacks will never execute again. "then()" methods will be executed also when promise is already fulfilled
		}
		if (this.#state === STATE.REJECTED) {
			this.#catchCallbackArr.forEach((callback) => {
				callback(this.#value);
			});
			this.#catchCallbackArr = []; // once executed callbacks will never execute again. "catch()" methods will be executed also when promise is already rejected
		}
	}

	#onSuccess(value) {
		if (this.#state !== STATE.PENDING) return;
		this.#value = value;
		this.state = STATE.FULFILLED;
		this.#runCallbacks();
	}

	#onFailure(value) {
		if (this.#state !== STATE.PENDING) return;
		this.#value = value;
		this.state = STATE.REJECTED;
		this.#runCallbacks();
	}

	then(thenCb, catchCb) {
		if (thenCb != null) this.#thenCallbackArr.push(thenCb);
        if (catchCb != null ) this.#catchCallbackArr.push(catchCb);
		this.#runCallbacks();
	}

	catch(cb) {
        this.then(null,cb)
    }

	finally() {

    }
}

module.exports = MyPromise;
