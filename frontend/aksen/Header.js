import {Component} from 'react';
import {Link} from 'react-router-dom';

export default class Header extends Component {

    constructor(/* subtitle */ props) {
        super(props);
    }

    render() {
        return [
            $('header', {className: 'navbar bg-secondary shadow-2', style: {padding: '1rem 0.5rem'}}, [
                $('section', {className: 'navbar-section'}, [
                    $(Link, {to: '/', className: 'text-bold h4'}, 'AKSEN E-TICKETING')
                ]),
                $('section', {className: 'hide-sm navbar-section'}, [
                    $('div', {className: 'text-primary h6'}, this.props.subtitle)
                ])
            ])
        ];
    }

}

