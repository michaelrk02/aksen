import {Component, createElement as $} from 'react';
import {authCheck} from './lib/auth-checker.js';

export default class AppSettings extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        authCheck(this);
    }

    render() {
        return $('p', null, 'viewing app settings');
    }

}

