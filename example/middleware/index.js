/**
 * Created by apple on 2017/9/19.
 */
const redux  = require('redux')
const { createStore, applyMiddleware } = redux

var store = createStore(reducer, applyMiddleware(
    logMiddleWare
))
store.dispatch({
    type: 'add'
})

store.dispatch({
    type: 'add'
})

store.dispatch({
    type: 'add'
})






/// myMiddleWare
function logMiddleWare({ getState, dispatch }) {
    return function (dispatch) {
        return function logDispatch(action) {
            console.log('...before:', getState())
            console.log('...action:', action)
            dispatch(action)
            console.log('...after:', getState())
        }
    }
}



/// reducer
function reducer(state = {
    count: 0
}, action) {
    switch (action.type) {
        case "add": {
            return {
                ...state,
                count: state.count + 1
            }
        }
    }
}