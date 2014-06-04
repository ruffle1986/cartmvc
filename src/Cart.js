/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react/addons');
var _           = require('lodash');
var $           = require('jquery');
var CartItem    = require('./CartItem');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

module.exports = React.createClass({

    _$rootElement: null,

    getInitialState: function () {
        return {
            items: [],
            itemsListIsVisible: false
        };
    },

    _getDocument: function () {
        return document;
    },

    componentDidMount: function () {

        this._$rootElement = $(this.getDOMNode());

        $(this._getDocument()).on('addItemToCart', function (e, item) {
            this.addItem(item);
        }.bind(this));
    },

    getItem: function (id) {
        return _.find(this.state.items, function (item) {
            return item.id === id;
        });
    },

    addItem: function (item) {
        var items = this.state.items;
        var itemInCart;

        if ((itemInCart = this.getItem(item.id))) {
            itemInCart.count += item.count;
        } else {
            items.push(item);
        }

        this.setState({ items: items });

        if (!this.isItemListVisisble()) {

            this.shake();
        }
    },

    removeItem: function (item) {
        var index,
            items = this.state.items;

        if (typeof item === 'string') {
            item = this.getItem(item);
        }

        if ((index = _.indexOf(items, item)) !== -1) {

            if (item.count < 2) {
                items.splice(index, 1);
            } else {
                item.count--;
            }
        }

        this.setState({ items: items });

        if (!this.isItemListVisisble()) {

            this.shake();
        }
    },

    getTotalItemCount: function () {
        var items = this.state.items;

        if (!items || !items.length) {
            return 0;
        }

        if (items && items.length === 1) {
            return +items[0].count;
        }

        return _.reduce(items, function (previous, current) {
            return ((typeof previous === 'object' ? +previous.count : previous) + +current.count);
        });
    },

    getTotalPrice: function () {
        var items = this.state.items;

        if (!items || !items.length) {
            return 0;
        }

        if (items && items.length === 1) {
            return +items[0].count * +items[0].price;
        }

        return _.reduce(items, function (previous, current) {

            var reduced = 0;

            if (typeof previous === 'object') {
                reduced += (+previous.count * +previous.price);
            } else {
                reduced = previous;
            }

            return reduced + (+current.count * +current.price);
        });
    },

    shake: (function () {
        var timeOutID;

        return function shake() {
            var animClasses;
            var $root = this._$rootElement;
            var stop = function () {
                $root.removeClass(animClasses);
                timeOutID = null;
            };

            if (!(animClasses = this.props.attentionAnimClasses)) {
                return;
            }

            if (timeOutID) {
                window.clearTimeout(timeOutID);
                $root.removeClass(animClasses);
                timeOutID = null;
            }

            $root.addClass(animClasses);
            timeOutID = window.setTimeout(stop, 1000);

        };
    }()),

    hasItems: function () {
        return this.state.items.length > 0;
    },

    isItemListVisisble: function () {
        return this.state.itemsListIsVisible;
    },

    _OnTotalItemsClick: function () {

        if (this.hasItems()) {

            this.setState({ itemsListIsVisible: !this.state.itemsListIsVisible });
        }
    },

    _OnDrop: function (e) {

        var productInfo;

        e.preventDefault();

        try {

            productInfo = JSON.parse(e.dataTransfer.getData('productInfo'));

            this.addItem(productInfo);

        } catch (err) {}
    },

    preventDefault: function (e) {
        e.preventDefault();
    },

    render: function () {

        var items = _.map(this.state.items, function (item) {

            return (

                <CartItem
                    _OnRemove={ this.removeItem.bind(this, item) }
                    key={ item.id }
                    item={ item }></CartItem>
            );

        }, this);

        return (

            <div className={ 'cart' + ( this.state.itemsListIsVisible ? ' cart--items-visible' : '' ) }
                    onDragOver={ this.preventDefault }
                    onDrop={ this._OnDrop }>

                <div className="cart-summary">
                    <div className="cart-total-items" onClick={ this._OnTotalItemsClick }>Number of goods in the cart: { this.getTotalItemCount() }</div>
                    <div className="cart-total-price">{ this.getTotalPrice() } HUF</div>
                </div>

                <ul className="cart-items">
                    { items }
                </ul>
            </div>
        );
    }
});