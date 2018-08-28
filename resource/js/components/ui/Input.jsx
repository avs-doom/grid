'use strict';

import PropTypes from 'prop-types';
import React, { Component } from 'react';


export default class Input extends Component {
    
    static get propTypes() {
        return {
            value: PropTypes.any,
            placeholder: PropTypes.string,
            onChange: PropTypes.func
        }
    }
    
    static getDerivedStateFromProps(props, state) {
        
        if (!state.isFocused) {
            return {...state, value: props.value, prevValue: props.value};
        } else {
            return state.prevValue !== props.value ? {...state, value: props.value, prevValue: props.value} : state;
        }
    }
    
    constructor(props) {
        super(props);
        
        this.state = {
            isFocused: false,
            value: props.value || '',
        };
    }
    
    _handlerOnChange(event) {
        
        const value = event && event.target.value;
        
        const { value: prevValue } = this.props;
        
        this.setState({value, prevValue});
    }
    
    _handlerOnBlur() {
        
        const { onChange } = this.props;
        const { value } = this.state;
        
        this.setState({
            isFocused: false
        }, () => {
            onChange && onChange.call(this, value);
        });
    }
    
    _handlerOnFocus() {
        
        this.setState({
            isFocused: true
        });
    }
    
    render() {
        
        const { value } = this.state;
        const { placeholder } = this.props;
        
        return (
            <div className="input">
                <input 
                    className="input__field"
                    value={value} placeholder={placeholder}
                    onChange={this._handlerOnChange.bind(this)}
                    onBlur={this._handlerOnBlur.bind(this)}
                    onFocus={this._handlerOnFocus.bind(this)}
                />
            </div>
        );
    }
}