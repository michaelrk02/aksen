import {Component, createElement as $} from 'react';
import {Link} from 'react-router-dom';
import {Loading, rpc} from '../aksen.js';
import {authCheck} from './lib/auth-checker.js';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        authCheck(this);
    }

    render() {
        return 'viewing dashboard page';
    }

}

