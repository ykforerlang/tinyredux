/**
 * Created by apple on 2017/9/19.
 */
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

function sum(a, b) {
    return a + b
}



var enhancerArray = [fEnhancer, hEnhancer, gEnhancer]


function enhancerFun(originF) {
    let of = originF
    enhancerArray.forEach(enhancer => {
        of = enhancer(of)
    })
    return of
}

function enhancerFun2(originF) {
    return enhancerArray
        .reverse()
        .reduce((a, b) => (...args) => a(b(...args)))(originF)
}

function enhancerFun3(originF) {
    enhancerArray.reducer(function (a, b) {
        return function (...args) {
            return a(b(args))
        }
    })
}


console.log('......')
console.log('sum', gEnhancer(hEnhancer(fEnhancer(sum)))(1, 2))

console.log('....')
console.log('sum', enhancerFun(sum)(1, 2))

console.log('....')
console.log('sum', enhancerFun2(sum)(1, 2))
