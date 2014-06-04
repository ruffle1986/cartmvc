/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

module.exports = React.createClass({

    _OnClick: function () {

        this.props._OnRemove();
    },

    render: function () {

        var item = this.props.item;

        return (

            <li className="cart-item" onClick={ this._OnClick }>{ item.name } ({ item.count || 1 })</li>
        );
    }
});