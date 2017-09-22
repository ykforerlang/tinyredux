"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = applyMiddleware;
/**
 * Created by apple on 2017/9/16.
 */
function applyMiddleware(store) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    console.log(args);
    var enArr = args.map(function (middleware) {
        return middleware({
            getState: store.getState,
            dispatch: store.dispatch
        });
    });

    var of = store.dispatch;
    enArr.forEach(function (en) {
        of = en(of);
    });

    store.dispatch = of;
}