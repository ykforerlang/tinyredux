/**
 * Created by apple on 2017/9/16.
 */
export default function applyMiddleware(store, ...args) {
    console.log(args)
    const enArr = args.map(middleware => middleware({
        getState: store.getState,
        dispatch: store.dispatch
    }))


    let of = store.dispatch
    enArr.forEach(en => {
        of = en(of)
    })

    store.dispatch = of
}
