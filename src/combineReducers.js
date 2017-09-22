/**
 * Created by apple on 2017/9/21.
 */
export default function combineReducers(reducers) {
    return function (state, action) {
        const keys = Object.keys(reducers)

        let hasChange = false
        const newState = {}
        keys.forEach(key => {
            const newS = reducers[key](state[key], action)
            if (newS !== state[key]) {
                newState[key] = newS
                hasChange = true
            } else {
                newState[key] = newS
            }
        })
        return hasChange ? newState: state
    }
}

export function combineReducersVariant(reducers) {
    return function (state, action) {
        const lineIndex = action.type.indexOf("_")
        const actionKey = action.type.substring(0, lineIndex)
        const newS = reducers[actionKey](state[actionKey], action)

        return state[actionKey] === newS ? state : {
            ...state,
            [actionKey]: newS
        }
    }
}
