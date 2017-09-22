"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = bindActionCreators;
/**
 * Created by apple on 2017/9/21.
 */
function bindActionCreator(creator, dispatch) {
    return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        dispatch(creator(args));
    };
}

function bindActionCreators(creators, dispatch) {
    var keys = Object.keys(creators);
    var result = {};
    keys.forEach(function (key) {
        result[key] = bindActionCreator(creators[key], dispatch);
    });
    return result;
}