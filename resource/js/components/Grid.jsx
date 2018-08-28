'use strict';

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { onChangeSort, onChangeItem } from '../_core/State';

import Input from './ui/Input';

@connect(
    state => ({
        currency: state.currency,
        items: state.items,
        sort: state.sort
    }),
    dispatch => ({
        onChangeSort: (column, direct) => dispatch(onChangeSort(column, direct)),
        onChangeItem: (id, data) => dispatch(onChangeItem(id, data))
    })
)

export default class Grid extends Component {
    
    static get propTypes() {
        return {
            currency: PropTypes.number.isRequired,
            sort: PropTypes.object.isRequired,
            items: PropTypes.array.isRequired,
            onChangeSort: PropTypes.func.isRequired,
            onChangeItem: PropTypes.func.isRequired
        }
    }
    
    constructor(props) {
        super(props);
        
        this.state = {
            isShowCurrency: false
        };
    }
    
    _getFullPrice() {
        
        const { items, currency } = this.props;
        const { isShowCurrency } = this.state;
        
        let price = 0;
        
        items.forEach(item => price = price + Number(item.price));
        
        return this._getCurrencyPrice(price);
    }
    
    _getCurrencyPrice(price) {
        
        const { currency } = this.props;
        const { isShowCurrency } = this.state;
        
        const numberPrice = Number.isInteger(price) ? price : Number(price);
        
        return isShowCurrency ? this._getRoundPrice(numberPrice / currency): this._getRoundPrice(numberPrice);
    }
    
    _getRoundPrice(price) {
        
        return Math.round(price * 100) / 100;
    }
    
    _handlerSortClick(key, event) {
        event && event.preventDefault();
        
        const { onChangeSort, sort } = this.props;
        const { column, direct } = sort || {};
        
        const newDirect = column !== key ? 'asc': direct === 'asc' ? 'desc' : 'asc';
        
        onChangeSort && onChangeSort(key, newDirect);
    }
    
    _handlerChengeCurrency() {
        
        const { isShowCurrency } = this.state;
        
        this.setState({isShowCurrency: !isShowCurrency});
    }
    
    _handlerChangeItem(item, name, value) {
        
        const { isShowCurrency } = this.state;
        
        if (Number.isNaN(Number(value)) || !Number(value) || Number(value) < 0) {
            return;
        }
        
        const { onChangeItem, currency } = this.props;
        
        onChangeItem && onChangeItem(item.id, {...item, [name]: isShowCurrency ? (value * currency) : value});
    }
    
    _renderItemTemplate(item, index) {
        
        const { name, count, price } = item || {};
        const { isShowCurrency } = this.state;
        const { currency } = this.props;
        
        return (
            <tr className="table__body-row" key={index}>
                <td className="table__body-cell" title={name}>{name}</td>
                <td className="table__body-cell">
                    <Input
                        value={count}
                        placeholder="Введите кол-во"
                        onChange={this._handlerChangeItem.bind(this, item, 'count')}
                    />
                </td>
                <td className="table__body-cell">
                    <Input
                        value={this._getCurrencyPrice(price)}
                        placeholder="Введите стоимость в рублях"
                        onChange={this._handlerChangeItem.bind(this, item, 'price')}
                    />
                </td>
            </tr>
        );
    }
    
    _renderHeaderTemplate() {
        
        const { sort } = this.props;
        const { isShowCurrency } = this.state;
        
        const aliases = {
            name: 'Название',
            count: 'Кол-во',
            price: `Стоимость (${isShowCurrency ? '$' : '₽'})`
        };
        
        return Object.keys(aliases).map((key, index) => {
            
            let className = ['table__header-cell'];
            
            key === sort.column && className.push(`table__header-cell--${sort.direct}`);
            
            return (
                <td className={className.join(' ')} key={index}>
                    <a href="#" className="link" onClick={this._handlerSortClick.bind(this, key)}>{aliases[key]}</a>
                </td>
            );
        });
    }
    
    _renderBodyTemplate() {
        
        const { sort, items } = this.props;
        const { column, direct } = sort || {};
        
        const sortItems = items.sort((a, b) => {
            
            if ( ! (column in a) || ! (column in b)) {
                return -1;
            }

            let nameA = ! Number(a[column]) && a[column] ? a[column].toUpperCase() : Number(a[column]);
            let nameB = ! Number(b[column]) && b[column] ? b[column].toUpperCase() : Number(b[column]);

            if (direct === 'asc') {
                return nameA < nameB ? -1 : nameA === nameB ? 0 : 1;
            } else {
                return nameA > nameB ? -1 : nameA === nameB ? 0 : 1;
            }
        });
        
        return sortItems.map(this._renderItemTemplate.bind(this));
    }
    
    render() {
        
        const { items, currency } = this.props;
        const { isShowCurrency } = this.state;
        
        return (
            <section className="grid">
                
                <div className="currency">
                    <span>Курс валюты: <b>{currency}</b></span>
                    <label className="checkbox">
                        <input 
                            type="checkbox"
                            className="checkbox__input"
                            value={isShowCurrency}
                            onChange={this._handlerChengeCurrency.bind(this)}
                        /> отображать в валюте
                    </label>
                </div>
                
                <table className="table">
                    <colgroup>
                        <col width="100px" />
                        <col width="200px" />
                        <col width="200px" />
                    </colgroup>
                    <thead className="table__header">
                        <tr className="table__header-row">
                            {this._renderHeaderTemplate()}
                        </tr>
                    </thead>
                    <tfoot className="table__footer">
                        <tr className="table__footer-row">
                            <td className="table__footer-cell" colSpan="2" style={{textAlign: 'right'}}><b>ИТОГО:</b></td>
                            <td>{this._getFullPrice()}</td>
                        </tr>
                    </tfoot>
                    <tbody className="table__body">
                        {this._renderBodyTemplate()}
                    </tbody>
                </table>
            </section>
        );
    }
}