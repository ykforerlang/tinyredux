"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createStore;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createStore(reducer) {
    var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new Store(reducer, state);
}

var Store = function () {
    function Store(reducer, state) {
        _classCallCheck(this, Store);

        this.state = state;
        this.listeners = [];
        this.reducer = reducer;

        this.dispatch = this.dispatch.bind(this);
        this.getState = this.getState.bind(this);
        this.subscribe = this.subscribe.bind(this);
    }

    _createClass(Store, [{
        key: "dispatch",
        value: function dispatch(action) {
            this.state = this.reducer(this.state, action);

            this.listeners.forEach(function (listener) {
                return listener();
            });
        }
    }, {
        key: "getState",
        value: function getState() {
            return this.state;
        }
    }, {
        key: "subscribe",
        value: function subscribe(listener) {
            this.listeners.push(listener);
        }
    }]);

    return Store;
}();