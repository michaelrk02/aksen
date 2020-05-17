import {Component, createElement as $} from 'react';
import {authCheck} from './lib/auth-checker.js';

export default class Logout extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        authCheck(this);
    }

    render() {
        return $('p', null, 'logging out');
    }

}

