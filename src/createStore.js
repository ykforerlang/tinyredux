export default function createStore(reducer, state = {}) {
    return new Store(reducer, state)
}

class Store {
    constructor(reducer, state) {
        this.state = state
        this.listeners = []
        this.reducer = reducer

        this.dispatch = this.dispatch.bind(this)
        this.getState = this.getState.bind(this)
        this.subscribe = this.subscribe.bind(this)
    }

    dispatch(action) {
        this.state = this.reducer(this.state, action)

        this.listeners.forEach(listener => listener())
    }

    getState() {
        return this.state
    }

    subscribe(listener) {
        this.listeners.push(listener)
    }
}


