/**
 * Created by apple on 2017/9/21.
 */
function bindActionCreator(creator, dispatch) {
    return function (...args) {
        dispatch(creator(args))
    }
}

export default function bindActionCreators(creators, dispatch) {
    const keys = Object.keys(creators)
    const result = {}
    keys.forEach(key => {
        result[key] = bindActionCreator(creators[key], dispatch)
    })
    return result
}