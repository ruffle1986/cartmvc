/**
 * @jsx React.DOM
 */

'use strict';

jest.dontMock('../Cart');
jest.dontMock('jquery');
jest.dontMock('lodash');

var $       = require('jquery');
var Cart    = require('../Cart');
var React   = require('react/addons');
var TestUtils = React.addons.TestUtils;
var cart;

describe('Cart', function () {

    beforeEach(function () {

        cart = <Cart />;
        TestUtils.renderIntoDocument(cart);
    });

    it('should handle the number of products properly', function () {

        cart.addItem({ id: '555', name: 'qwerty', count: 2 });
        cart.addItem({ id: '666', name: 'qwerty2', count: 3 });

        expect(cart.getTotalItemCount()).toEqual(5);

        cart.addItem({ id: '555', count: 4 });

        expect(cart.getTotalItemCount()).toEqual(9);
        expect(cart.getItem('555').count).toEqual(6);
    });

    it('should add the item', function () {

        var item = {
            id: '666',
            name: 'devil',
            count: 1
        };

        cart.addItem(item);
        expect(cart.getItem('666')).toBe(item);
    });

    it('should remove the item', function () {

        var item = {
            id: '666',
            name: 'devil',
            count: 1
        };

        cart.addItem(item);

        expect(cart.getTotalItemCount()).toEqual(1);

        cart.removeItem(item);

        expect(cart.getTotalItemCount()).toEqual(0);
    });

    it('should decrease the number of products in the cart', function () {

        var item = { id: '555', name: 'qwerty', count: 2 },
            itemReceived;

        cart.addItem(item);

        cart.removeItem(item);

        expect(cart.getTotalItemCount()).toEqual(1);

        itemReceived = cart.getItem('555');

        expect(itemReceived).toBe(item);
        expect(itemReceived.count).toEqual(1);
    });

    it('should remove item by ID', function () {

        cart.addItem({ id: '555', name: 'qwerty', count: 2 });

        cart.removeItem('555');

        expect(cart.getItem('555').count).toEqual(1);

        cart.removeItem('555');

        expect(cart.getItem('555')).toBeUndefined();
    });

    it('should calculate the sum of products\'s prices properly', function () {

        cart.addItem({ id: '555', name: '', price: 2, count: 1 });
        cart.addItem({ id: '666', name: '', price: 3, count: 2 });
        cart.addItem({ id: '777', name: '', price: 1, count: 5 });
        cart.addItem({ id: '888', name: '', price: 0, count: 6 });

        expect(cart.getTotalPrice()).toEqual(13);
    });

    it('should not open the item list if there is no item in the cart', function () {

        var totalCount = TestUtils.findRenderedDOMComponentWithClass(cart, 'cart-total-items');

        TestUtils.Simulate.click(totalCount);

        expect($(cart.getDOMNode()).hasClass('cart--items-visible')).toBe(false);

    });

    it('should open the item list if there is at least one item in the cart', function () {

        var totalCount = TestUtils.findRenderedDOMComponentWithClass(cart, 'cart-total-items');

        cart.addItem({
            id: '123',
            name: 'sample product',
            count: 1
        });

        TestUtils.Simulate.click(totalCount);

        expect($(cart.getDOMNode()).hasClass('cart--items-visible')).toBe(true);

    });

    it('should render the total price text properly', function () {

        var totalPrice;

        cart.addItem({
            id: '123',
            name: 'sample product',
            count: 5,
            price: 2
        });

        cart.addItem({
            id: '123',
            count: 1
        });

        cart.addItem({
            id: '456',
            count: 2,
            price: 1000
        });

        totalPrice = TestUtils.findRenderedDOMComponentWithClass(cart, 'cart-total-price');

        expect(totalPrice.getDOMNode().textContent).toEqual('2012 HUF');

    });

    it('should render the summary text properly', function () {

        var summary;

        cart.addItem({
            id: '123',
            name: 'sample product',
            count: 5,
            price: 2
        });

        cart.addItem({
            id: '123',
            name: 'sample product',
            count: 3,
            price: 2
        });

        cart.addItem({
            id: '456',
            name: 'sample product',
            count: 2,
            price: 5
        });

        summary = TestUtils.findRenderedDOMComponentWithClass(cart, 'cart-total-items');

        expect(summary.getDOMNode().textContent).toEqual('Number of goods in the cart: 10');

    });

    it('should add the item properly when the event is triggered on the document', function () {

        var item1 = { id: '123', name: 'qwerty', count: 5, price: 2 };
        var item2 = { id: '456', name: 'qwerty', count: 2, price: 5 };

        $(document)
            .trigger('addItemToCart', [item1])
            .trigger('addItemToCart', [item2]);

        var totalPrice  = TestUtils.findRenderedDOMComponentWithClass(cart, 'cart-total-price');
        var summary     = TestUtils.findRenderedDOMComponentWithClass(cart, 'cart-total-items');

        expect(totalPrice.getDOMNode().textContent).toEqual('20 HUF');
        expect(summary.getDOMNode().textContent).toEqual('Number of goods in the cart: 7');
        expect(cart.getTotalItemCount()).toEqual(7);
        expect(cart.getTotalPrice()).toEqual(20);
        expect(cart.getItem('123')).toBe(item1);
        expect(cart.getItem('456')).toBe(item2);

        expect();
    });

    it('should be shaking when new item is added', function () {

        cart.shake = jasmine.createSpy('shake');

        cart.addItem({ id: '123', name: 'query', price: 2, count: 1 });

        expect(cart.shake).toHaveBeenCalled();
    });
});