import {Component, createElement as $} from 'react';
import {Link} from 'react-router-dom';

export default class Header extends Component {

    constructor(/* subtitle */ props) {
        super(props);

        this.onSidebarShow = this.onSidebarShow.bind(this);
    }

    render() {
        return [
            $('header', {className: 'navbar bg-secondary shadow-2', style: {padding: '1rem 0.5rem'}}, [
                $('section', {className: 'navbar-section'}, [
                    typeof(this.props.sidebar) !== 'undefined' ? $('button', {className: 'btn btn-primary btn-action', style: {marginRight: '0.5rem'}, onClick: this.onSidebarShow}, $('i', {className: 'icon icon-menu'})) : null,
                    $(Link, {to: '/', className: 'text-bold h4'}, 'AKSEN E-TICKETING')
                ]),
                $('section', {className: 'hide-sm navbar-section'}, [
                    $('div', {className: 'text-primary h6'}, this.props.subtitle)
                ])
            ])
        ];
    }

    onSidebarShow() {
        const sidebar = document.getElementById(this.props.sidebar);

        sidebar.classList.add('active');
    }

}

