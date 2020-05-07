import {Component, createElement as $} from 'react';
import {Link} from 'react-router-dom';
import {Loading} from '../aksen.js';

export default class Order extends Component {

    constructor(props) {
        super(props);
        this.state = {
            choiceID: 'form'
        };

        this.onChoiceChange = this.onChoiceChange.bind(this);
    }

    render() {
        return $('div', {className: 'container grid-md'}, [
            $('div', {className: 'popup', style: {margin: '2rem'}}, [
                $('h5', {className: 'text-bold text-primary'}, 'Silakan pilih tindakan berikutnya'),
                $('p', null, 'Apakah anda ingin memesan tiket, mengakses tagihan, atau mengakses e-tiket yang telah anda beli?'),
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'text-bold'}, 'Pilih salah satu:'),
                    $('label', {className: 'form-radio'}, [$('input', {type: 'radio', name: '__choiceID', value: 'form', checked: (this.state.choiceID === 'form'), onChange: this.onChoiceChange}), $('i', {className: 'form-icon'}), ' Saya ingin memesan tiket']),
                    $('label', {className: 'form-radio'}, [$('input', {type: 'radio', name: '__choiceID', value: 'invoice', checked: (this.state.choiceID === 'invoice'), onChange: this.onChoiceChange}), $('i', {className: 'form-icon'}), ' Saya ingin mengakses tagihan saya']),
                    $('label', {className: 'form-radio'}, [$('input', {type: 'radio', name: '__choiceID', value: 'tickets', checked: (this.state.choiceID === 'tickets'), onChange: this.onChoiceChange}), $('i', {className: 'form-icon'}), ' Saya ingin mengakses e-tiket yang telah saya dapatkan']),
                ]),
                $('div', {className: 'columns', style: {marginTop: '2rem'}}, [
                    $('div', {className: 'column col-4 col-sm-6'}, $(Link, {to: '/', className: 'btn btn-error btn-block'}, [$('i', {className: 'icon icon-arrow-left'}), ' Kembali'])),
                    $('div', {className: 'column col-4 hide-sm'}),
                    $('div', {className: 'column col-4 col-sm-6'}, $(Link, {to: '/order/form', className: 'btn btn-success btn-block', disabled: this.state.orderInitiating}, ['Lanjut ', $('i', {className: 'icon icon-arrow-right'})])),
                ])
            ])
        ]);
    }

    onChoiceChange(e) {
        this.setState({choiceID: e.target.value});
    }

}

