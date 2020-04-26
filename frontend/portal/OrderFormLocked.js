import {Component} from 'react';
import {Link} from 'react-router-dom';

export default class OrderFormLocked extends Component {

    constructor(/* form, duration */ props) {
        super(props);
    }

    render() {
        return $('div', null, 'Form locked');
    }

}

