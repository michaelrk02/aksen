import {Component, createElement as $} from 'react';

export default class Footer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return $('footer', {className: 'bg-dark'}, [
            $('div', {className: 'text-center', style: {padding: '0.5rem'}}, [
                $('span', {dangerouslySetInnerHTML: {__html: 'Copyright &copy; 2020-present, Michael R. Krisnadhi'}})
            ])
        ]);
    }

}

