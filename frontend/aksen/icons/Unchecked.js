import {Component, createElement as $} from 'react';

export default class Unchecked extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return $('i', {className: 'icon icon-cross text-error'});
    }

}

