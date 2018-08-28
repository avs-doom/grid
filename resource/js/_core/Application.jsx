'use strict';

import React, { Component } from 'react';

import Grid from '../components/Grid';
import Chart from '../components/Chart';


export default class Application extends Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        
        return (
            <div className="wrapper">
                <Grid />
                <Chart />
            </div>
        );
    }
}