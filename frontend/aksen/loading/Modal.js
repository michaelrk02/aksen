import Window from '../modal/Window.js';

export default class Modal extends Window {

    constructor(/* shown, description */ props) {
        super(props)
    }

    _isCloseClickable() {
        return false;
    }

    _getHeader() {
        return [
            $('div', {className: 'modal-title h5'}, 'LOADING')
        ];
    }

    _getBody() {
        return [
            $('div', {style: {margin: '0.75rem'}}, [
                $('p', null, this.props.description)
            ]),
            $('div', {style: {margin: '0.75rem'}}, [
                $('div', {className: 'loading loading-lg'})
            ])
        ];
    }

}

