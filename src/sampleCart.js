/**
 * @jsx React.DOM
 */
'use strict';

var React   = require('react/addons');
var Cart    = require('../src/Cart');
var Product = require('../src/Product');
var _       = require('lodash');

React.renderComponent(<Cart attentionAnimClasses="shake animated" />, document.getElementById('Cart'));

_.forEach(document.getElementsByClassName('product-wrapper'), function (node) {
    React.renderComponent(<Product description={ {
        id: _.uniqueId('product-'),
        price: 500,
        count: 2,
        name: 'The Item' } } />, node);
});