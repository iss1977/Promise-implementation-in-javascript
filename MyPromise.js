const STATE = {
	FULFILLED: "fulfilled",
	REJECTED: "rejected",
	PENDING: "pending",
}

class MyPromise {
	#thenCbs = [] // will store all resolved (then) callbacks.
	#catchCbs = [] // will store all rejected (catch) callbacks.
	#state = STATE.PENDING // pending, fulfilled, rejected
	#value // will hold the success or fail value of the promise

	#onSuccessBind = this.#onSuccess.bind(this) // When a function is used as a callback, "this" is lost
	#onFailBind = this.#onFail.bind(this)

	constructor(cb) {
		console.log(this)
		// try {
		// 	cb(this.#onSuccess, this.#onFail)
		// } catch (error) {
		// 	this.#onFail(error)
		// }

		//Using cb(this.#onSuccess, this.#onFail) will cause the lost of this on running #onSuccess
		cb(this.#onSuccessBind, this.#onFailBind)
	}

	#runCallbacks() {
		if (this.#state === STATE.FULFILLED) {
			this.#thenCbs.forEach((cb) => {
				cb(this.#value)
			})
			this.#thenCbs = [] // executed callbacks will never execute again. "then()" methods will be executed also when promise is already fulfilled
		}
		if (this.#state === STATE.REJECTED) {
			this.#catchCbs.forEach((cb) => {
				cb(this.#value)
			})
			this.#catchCbs = []
		}
	}

	#onSuccess(value) {
		console.log(this ?? "There is no this")

		if (this.#state !== STATE.PENDING) return

		if (value instanceof MyPromise) {
			value.then(this.#onSuccessBind, this.#onFailBind)
			return //why```??? WebDev : to wait for the promise to finish before we continue.
		}

		this.#value = value
		this.#state = STATE.FULFILLED
		this.#runCallbacks()
	}

	#onFail(value) {
		queueMicrotask(() => {
			if (this.#state !== STATE.PENDING) return

			if (value instanceof MyPromise) {
				value.then(this.#onSuccessBind, this.#onFailBind)
				return
			}

			this.#value = value
			this.#state = STATE.REJECTED
			this.#runCallbacks()
		})
	}

	then(thenCb, catchCb) {
		return new MyPromise((resolve, reject) => {
			this.#thenCbs.push((result) => {
				if (thenCb == null) {
					resolve(result)
					return
				}

				try {
					let resolveArg = thenCb(result)
					resolve(resolveArg)
				} catch (error) {
					reject(error)
				}
			})

			this.#catchCbs.push((result) => {
				if (catchCb == null) {
					reject(result)
					return
				}

				try {
					resolve(catchCb(result))
				} catch (error) {
					reject(error)
				}
			})

			this.#runCallbacks()
		})
	}

	catch(cb) {
		return this.then(null, cb)
	}

	finally() {}
}

module.exports = MyPromise
