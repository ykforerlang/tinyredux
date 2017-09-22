"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = combineReducers;
exports.combineReducersVariant = combineReducersVariant;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Created by apple on 2017/9/21.
 */
function combineReducers(reducers) {
    return function (state, action) {
        var keys = Object.keys(reducers);

        var hasChange = false;
        var newState = {};
        keys.forEach(function (key) {
            var newS = reducers[key](state[key], action);
            if (newS !== state[key]) {
                newState[key] = newS;
                hasChange = true;
            } else {
                newState[key] = newS;
            }
        });
        return hasChange ? newState : state;
    };
}

function combineReducersVariant(reducers) {
    return function (state, action) {
        var lineIndex = action.type.indexOf("_");
        var actionKey = action.type.substring(0, lineIndex);
        var newS = reducers[actionKey](state[actionKey], action);

        return state[actionKey] === newS ? state : _extends({}, state, _defineProperty({}, actionKey, newS));
    };
}