var redux = require('redux');
var reducer = require('./reducers/main.js');
var main = require('common/bases/main');
var containerSelector = require('./selectors/container');

/*
 * step1: 搭建环境
 * > redux middlewares
 * > 
 * 
 */


/*
 * step2: init store
 */
var store = redux.createStore(reducer, {
    name: 'long',
    courseList: []
});

/*
 * step3: 注入 store & components
 * 
 */
main.setStore(store);
main.setComponents({
    index: {
        id: 'container',
        sel: containerSelector
    }
});
