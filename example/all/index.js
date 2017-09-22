const tinyRedux = require('tiny-redux')
const { createStore, combineReducers, bindActionCreators, applyMiddleware } = tinyRedux

//// middleware
var fEnhancer = function (getState, dispatch) {
    return function (originF) {
        return function (...args) {
            console.log('this is fEnhancer before', store)
            console.log('action:', args[0])
            var r = originF(...args)
            console.log('this is fEnhancer after', store)
            return r
        }
    }
}

var hEnhancer = function (getState, dispatch) {
    return function (originF) {
        return function (...args) {
            console.log('this is hEnhancer before')
            var r = originF(...args)
            console.log('this is hEnhancer after')
            return r
        }
    }
}

var gEnhancer = function (getState, dispatch) {
    return function (originF) {
        return function (...args) {
            console.log('this is gEnhancer before')
            var r = originF(...args)
            console.log('this is gEnhancer after')
            return r
        }
    }
}


/// reducer
function clockReducer(state, action) {
    switch (action.type) {
        case 'clock_addOne': {
            return {
                ...state,
                count: state.count + 1
            }
        }
        case 'clock_cnum': {
            return {
                ...state,
                count: state.count * action.num
            }
        }
        default: {
            return state
        }
    }
}

function ykReducer(state, action) {
    switch (action.type) {
        case 'yk_older': {
            return {
                ...state,
                age: state.age + 1
            }
        }
        case 'yk_forever18': {
            return {
                ...state,
                age: 18
            }
        }
        default: {
            return state
        }
    }
}

const myReducer = combineReducers({
    clock: clockReducer,
    yk: ykReducer
})

var store = createStore(myReducer, {
    clock: {
        count: 0
    },
    yk: {
        age: 0
    }
})

applyMiddleware(store, fEnhancer, hEnhancer, gEnhancer)



const addOne = () =>({
    type: 'clock_addOne'
})

const cnum = num =>({
    type: 'clock_cnum',
    num
})

const older = () => ({
    type: 'yk_older'
})

const byebyeOlder = () => ({
    type: 'yk_forever18'
})

const crs = bindActionCreators({
    addOne,
    cnum,
    older,
    byebyeOlder
}, store.dispatch)

crs.addOne()
crs.cnum(3)
crs.addOne()

crs.older()
crs.byebyeOlder()