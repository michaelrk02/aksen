import {Component, createElement as $} from 'react';

export default class Checked extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return $('i', {className: 'icon icon-check text-success'});
    }

}

