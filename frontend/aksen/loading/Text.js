import {Component, createElement as $} from 'react';

export default class Text extends Component {

    constructor(/* description */ props) {
        super(props);
    }

    render() {
        return $('div', null, [
            $('span', null, this.props.description),
            $('span', {className: 'loading', style: {marginLeft: '0.75rem'}})
        ]);
    }

}

