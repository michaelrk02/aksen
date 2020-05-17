import {Component, createElement as $} from 'react';
import {authCheck} from './lib/auth-checker.js';

export default class CustomerService extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        authCheck(this);
    }

    render() {
        return $('p', null, 'serving customers');
    }

}

