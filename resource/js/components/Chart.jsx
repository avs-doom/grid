'use strict';

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

@connect(
    state => ({
        items: state.items
    })
)

export default class Chart extends Component {
    
    static get propTypes() {
        return {
            items: PropTypes.array
        }
    }
    
    constructor(props) {
        super(props);
        
        this.state = {
            colors: ["#fde23e","#f16e23", "#57d9ff"],
            width: 100, 
            height: 100
        };
    }
    
    componentDidMount() {
        
        const { chart } = this;
        
        chart.width = 100;
        chart.height = 100;
        
        this._renderCanvas();
    }
    
    componentDidUpdate() {
        
        this._renderCanvas();
    }
    
    _renderCanvas() {
        
        const { chart } = this;
        const { items } = this.props;
        const { colors } = this.state;
        
        const ctx = chart.getContext("2d");
        
        const totalValue = this._getTotalValue();
        
        let startAngle = 0;
        
        items.forEach((item, index) => {
            
            const sliceAngle = 2 * Math.PI * (item.count * item.price) / totalValue;
            
            this._drawPieSlice(
                ctx,
                chart.width/2,
                chart.height/2,
                Math.min(chart.width/2, chart.height/2),
                startAngle,
                startAngle + sliceAngle,
                colors[index]
            );
            
            startAngle += sliceAngle;
        });
    }
    
    _getTotalValue() {
        
        const { items } = this.props;
        
        let totalValue = 0;
        
        items.forEach(item => {
            totalValue += item.count * item.price;
        });
        
        return totalValue;
    }
    
    _drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, color ) {
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(centerX,centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
    }
    
    _renderItemsNameTemplate(item, index) {
        
        const { name, count, price } = item || {};
        const { colors } = this.state;
        
        const totalValue = this._getTotalValue();
        
        const procent = Math.round((price * count) / (totalValue / 100));
        
        return <div key={index} style={{color: colors[index]}}>{name} - {procent}%</div>;
    }
    
    render() {
        
        const { items } = this.props;
        
        return (
            <div className="chart">
                <canvas ref={ref => this.chart = ref} />
                <div className="chart__labels" style={{display: 'inline-block'}}>
                    {items.map(this._renderItemsNameTemplate.bind(this))}
                </div>
            </div>
        );
    }
}