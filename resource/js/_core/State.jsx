'use strict';


const initialState = {
    currency: 60,
    filter: {
        column: 'name',
        value: ''
    },
    sort: {
        column: '',
        direct: 'asc'
    },
    items: [{
        id: 1,
        name: 'Продукт 1',
        count: 3,
        price: '150'
    }, {
        id: 2,
        name: 'Продукт 2',
        count: 3,
        price: '200'
    }, {
        id: 3,
        name: 'Продукт 3',
        count: 1,
        price: '50'
    }]
};

const CHANGE_ITEM = 'CHANGE_ITEM';
const CHANGE_SORT = 'CHANGE_SORT';
const CHANGE_FILTER = 'CHANGE_FILTER';

export function crud(state = initialState, action) {

    const { type } = action || {};
    
    switch(type) {
        case CHANGE_FILTER:
            return {...state, filter: action.filter, items: initialState.items.filter(item => {
                return String(item[action.filter.column]).indexOf(action.filter.value) > -1;
            })};
        case CHANGE_SORT:
            return {
                ...state,
                sort: {
                    column: action.column,
                    direct: action.direct
                }
            };
        case CHANGE_ITEM:
            return {
                ...state,
                id: action.id,
                items: state.items.map(item => item.id === action.id ? action.data : item)
            };
        default:
            return state;
    }
}

export function onChangeSort(column, direct) {
    return {type: CHANGE_SORT, column, direct};
}

export function onChangeItem(id, data) {
    return {type: CHANGE_ITEM, id, data};
}

export function onChangeFilter(filter) {
    return {type: CHANGE_FILTER, filter};
}