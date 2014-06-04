/**
 * @jsx React.DOM
 */

'use strict';

var React       = require('react/addons');
var $           = require('jquery');

module.exports = React.createClass({

    _OnDragStart: function (e) {

        e.dataTransfer.setData('productInfo', JSON.stringify(this.props.description));
    },

    _OnClick: function () {

        $(document).trigger('addItemToCart', [this.props.description]);
    },

    render: function () {

        return (

            <div className='product' draggable='true'
                onDragStart={ this._OnDragStart }>
                <strong>Test product</strong>
                <br/>
                <p>Here comes some description.</p>
                <button onClick={ this._OnClick } className='add-to-cart'>Add to cart</button>
            </div>
        );
    }

});