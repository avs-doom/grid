'use strict';

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { onChangeFilter } from '../_core/State';

import Input from './ui/Input';

@connect(
    state => ({
        filter: state.filter
    }),
    dispatch => ({
        onChangeFilter: data => dispatch(onChangeFilter(data))
    })
)

export default class Filters extends Component {
    
    static get propTypes() {
        return {
            filter: PropTypes.object.isRequired,
            onChangeFilter: PropTypes.func.isRequired
        }
    }
    
    constructor(props) {
        super(props);
    }
    
    _handlerOnChange(name, event) {
        
        const value = typeof event === 'object' ? event.target.value : event;
        
        const { onChangeFilter, filter } = this.props;
        
        onChangeFilter && onChangeFilter({
            column: name === 'column' ? value : filter.column,
            value: name === 'value' ? value : filter.value
        });
    }
    
    render() {
        
        const { filter } = this.props;
        
        return (
            <section className="filter">
               <label className="filter__field">Значение 
                   <Input value={filter.value} onChange={this._handlerOnChange.bind(this, 'value')} />
               </label>
               <label className="filter__field">Столбец 
                   <select value={filter.column} className="select__field" onChange={this._handlerOnChange.bind(this, 'column')}>
                       <option value="name">Название</option>
                       <option value="count">Количество</option>
                       <option value="price">Стоимость</option>
                   </select>
               </label>
            </section>
        );
    }
}