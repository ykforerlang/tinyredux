## 从0实现一个tinyredux
讲真，[redux](https://github.com/reactjs/redux)已经很小了，去掉注释代码也就300行吧， 大家可以去读一下， 注释写的也是非常详细了。
现在，让我们从无到有！！

### so tiny !
redux 是这样的一个流程：触发一个action --> redux做一些逻辑，返回state --> 触发监听程序。 这不就是图形界面的事件机制吗（在web 上就是addEventListener）！
所以一个 最小的redux：
```jsx harmony
class Store {
    constructor(reducer, state = {}) {
        this.state = state
        this.listeners = []
        this.reducer = reducer
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
```
我们的这个 Store 和 redux的store提供了想的api：
1. dispatch 触发一个action
2. getState 返回当前状态
3. subscribe 增加一个监听器

让我们用这个最小的例子实现一个 计数器[在线地址](https://jsfiddle.net/yankang/mpzz40gv/)
```jsx harmony
function reducer(state, action) {
   switch (action.type) {
       case 'addOne': {
           return {
               ...state,
               count: state.count + 1
           }
       }
       default: {
           return state
       }
   }
}

const store = new Store(reducer, {count: 0})

store.subscribe(() => {
    console.log('subscribe test:', store.getState())
})

store.dispatch({type: 'addOne'})
store.dispatch({type: 'addOne'})
```
### 另一个灵魂 middleware
redux的[中文文档](http://cn.redux.js.org/) 上关于[middleware](http://cn.redux.js.org/docs/advanced/Middleware.html)的部分， 已经讲的很好了。现在我们从另一个角度来看这个问题，
首先，middleware 是redux在dispatch前后，提供的扩展机制。 比如日志功能， 需要在dispath一个action之前记录一下状态，然后reducer处理完逻辑之后， 再次记录一下。 这不就是 **面向切面编程**吗！
时髦的**AOP**！ 用java的话不管是 静态代理还是动态代理, 写起来都挺复杂的。 但是js实现 很简单： 
```jsx harmony
function enhancer(originF) {
  return function(...args) {
    console.log('before')
    var result = originF(...args)
    console.log('after')
    return result
  }
}
```
enhancer 方法接受一个方法A， 返回一个增强的方法B。 对B我们可以再次  增强，所以这里是可以链式调用的: 
```jsx harmony
var fEnhancer = function (originF) {
    return function (...args) {
        console.log('this is fEnhancer before')
        var r = originF(...args)
        console.log('this is fEnhancer after')
        return r
    }
}

var hEnhancer = function (originF) {
    return function (...args) {
        console.log('this is hEnhancer before')
        var r = originF(...args)
        console.log('this is hEnhancer after')
        return r
    }
}

var gEnhancer = function (originF) {
    return function (...args) {
        console.log('this is gEnhancer before')
        var r = originF(...args)
        console.log('this is gEnhancer after')
        return r
    }
}

function justPrint() {
    console.log('justPrint...')
}

fEnhancer(hEnhancer(gEnhancer(justPrint)))()
```
这个例子输出[在线地址]()： 

```jsx harmony
this is fEnhancer before
this is hEnhancer before
this is gEnhancer before
justPrint...
this is gEnhancer after
this is hEnhancer after
this is fEnhancer after
```

对于 fEnhancer(hEnhancer(gEnhancer(justPrint))) 等效的写法如下：
```jsx harmony
var enhancerArray = [gEnhancer, hEnhancer, fEnhancer]
function enhancerFun(originF) {
    let of = originF
    enhancerArray.forEach(enhancer => {
        of = enhancer(of)
    })
    return of
}
```
更加流弊的写法， 也就是redux的实现(巧妙的使用了数组的reduce方法)： 
```jsx harmony
var enhancerArray = [gEnhancer, hEnhancer, fEnhancer]
function enhancerFun2(originF) {
    return enhancerArray.reduce((a, b) => (...args) => a(b(...args)))(originF)
}
```

回到 redux， 需要我们增强的是dispatch， 所以只需要 enhancerFun(store.dispatch)。 这里有两个问题： 
第一个问题 由于我们的dispatch里面使用了 this， 而这个增强的调用：  var r = originF()  这里就丢掉了this。解决方法如下： 
```jsx harmony
class Store {
    constructor(reducer, state) {
        this.state = state
        this.listeners = []
        this.reducer = reducer

        this.dispatch = this.dispatch.bind(this)
        this.getState = this.getState.bind(this)
        this.subscribe = this.subscribe.bind(this)
    }
    ...
}
```
这样在任何地方调用 store的方法， 都没有问题了

第二个问题：在gEnhancer 里面我们想要调用 store.getState() 来记录 调用dispatch 前后的状态怎么办？ （我们不可能每次去import store吧， 因为在写enhancer的时候，
可能压根就不知道 store在哪里呢。 ） 方法如下：
```jsx harmony
var fEnhancer = function ({ getState, dispatch }) {
    return function (originF) {
        return function (...args) {
            console.log('this is fEnhancer before', getState())
            var r = originF(...args)
            console.log('this is fEnhancer after', getState())
            return r
        }
    }
}
```
通过闭包的形式， 我们让 fEnhancer 内部的逻辑 可以直接使用 getState。

那middleware是什么呢？ 这里的fEnhancer就是标准的一个 redux middleware, 是的，redux-logger可以不用了， 让我们用fEnhancer吧。 对应的 applyMiddleware： 
```jsx harmony
function applyMiddleware(store, ...args) {
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
```
现在， 给我们开头的reducer 增强一下吧！！ [在线地址](https://jsfiddle.net/yankang/awruyq59/)

### 辅助函数
到这里， tineyredux其实已经结束了。 但是redux为了方便开发者 提供了两个辅助函数： combineReducers 和 bindActionCreators。
bindActionCreators 就是在 原本调用 actionCreator的时候，默认帮你dispatch一下： actionCreator() ==》 store.dispatch(actionCreator())。 
也可以理解为 '增强':
```jsx harmony
function bindActionCreator(creator, dispatch) {
    return function (...args) {
        dispatch(creator(args)) // <---- 也可以理解为 '增强'
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
```

combineReducers 是为了解决另外的痛点， 比如如下的store 和reducer： 
```jsx harmony
{
    clock: {
        count: 0
    },
    yk: {
        age: 0
    }
    ...
}

function reducer(state, action) {
    switch (action.type) {
        case 'clock_add':...
        case 'clock_cnum'...
        case 'yk_older': ...
        case 'yk_forever18': ...
        default: {
            return state
        }
    }
}
```
大部分情况， 我们发现我们的应用，clock数据部分，对应clock自己的逻辑， yk数据部分的修改逻辑也只会关心自己（通常这都是2个页面的数据了）。
所以这里的一个 **"大switch"** 是可以切分的。
```jsx harmony
function clockReducer(state, action) {
    switch (action.type) {
        case 'clock_addOne': ...
        case 'clock_cnum': ...
        default: {
            return state
        }
    }
}

function ykReducer(state, action) {
    switch (action.type) {
        case 'yk_older': ...
        case 'yk_forever18': ...
        default: {
            return state
        }
    }
}

function reducer(state, action) {
  return {
      clock: clockReducer(state, action),
      yk: ykReducer(state, action),
  }
}
```
combineReducers 就是对小的reducer进行合并的：
```jsx harmony
function combineReducers(reducers) {
    return function (state, action) {
        const keys = Object.keys(reducers)

        const newState = {}
        keys.forEach(key => {
            newState[key] = reducers[key](state[key], action)
        })
        return newState
    }
}
```

题外话： 这里的 combineReducers  如果小reducer特别多， 会有一些性能问题： 因为对于每一个 action，都是走了所有的reducer。 如果我们场景特殊，
是我们刚才说的 一块数据的逻辑 只对于一个reducer， 可以使用下面的变种(只会执行一个reducer， 需要保证action前缀和store中key一致)： 
```jsx harmony
function combineReducersVariant(reducers) {
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
```

这里有一个完整的保护 middleware， bindActionCreators， combineReducers 所有特性的[完整的例子](https://jsfiddle.net/yankang/8Lc84n76/)

[代码托管在git]()




