import {Component} from 'react';

export default class Window extends Component {

    constructor(/* shown */ props) {
        super(props);
        this.onCloseClick = this.onCloseClick.bind(this);
    }

    open() {
        this.props.shown = true;
    }

    close() {
        this.props.shown = false;
    }

    render() {
        if (!this.props.shown) {
            return $('div');
        }

        const size = this._getSize();
        const header = this._getHeader();
        const body = this._getBody();
        const footer = this._getFooter();

        let modalSize = (typeof(size) === 'string') ? (' modal-' + size) : '';

        return $('div', {className: 'modal' + (this.props.shown ? ' active' : '') + modalSize}, [
            $('a', {href: '#!', className: 'modal-overlay', onClick: this.onCloseClick}),
            $('div', {className: 'modal-container'}, [
                (typeof(header) === 'object') ? $('div', {className: 'modal-header'}, header) : null,
                (typeof(body) === 'object') ? $('div', {className: 'modal-body'}, body) : null,
                (typeof(footer) === 'object') ? $('div', {className: 'modal-footer'}, footer) : null,
            ])
        ]);
    }

    onCloseClick() {
        const closeClickable = this._isCloseClickable();

        if ((typeof(closeClickable) === 'boolean') && closeClickable) {
            this.close();
        }
    }

    /* virtual { */
    _isCloseClickable() {}
    _getSize() {}
    _getHeader() {}
    _getBody() {}
    _getFooter() {}
    /* } */

}

