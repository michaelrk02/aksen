import {Component} from 'react';

export default class RequiredField extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return $('span', {className: 'text-error'}, ' *');
    }

}

