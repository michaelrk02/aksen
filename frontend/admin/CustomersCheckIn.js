import {Component, createElement as $} from 'react';
import {authCheck} from './lib/auth-checker.js';

export default class CustomersCheckIn extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        authCheck(this);
    }

    render() {
        return $('p', null, 'checking in customers');
    }

}

