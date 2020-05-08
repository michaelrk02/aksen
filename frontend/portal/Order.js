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
        const choices = [
            {id: 'form', text: 'Saya ingin memesan tiket'},
            {id: 'invoice', text: 'Saya ingin melihat tagihan saya'},
            {id: 'tickets', text: 'Saya ingin melihat e-tiket yang telah saya dapatkan'}
        ];

        return $('div', {className: 'container grid-md'}, [
            $('div', {className: 'popup'}, [
                $('h5', {className: 'text-bold text-primary'}, 'Silakan pilih tindakan berikutnya'),
                $('p', null, 'Apakah anda ingin memesan tiket, mengakses tagihan, atau mengakses e-tiket yang telah anda beli?'),
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'text-bold'}, 'Pilih salah satu:'),
                    ...choices.map((item => {
                        return $('label', {className: 'form-radio'}, [
                            $('input', {type: 'radio', name: '__choiceID', value: item.id, checked: (this.state.choiceID === item.id), onChange: this.onChoiceChange}),
                            $('i', {className: 'form-icon'}),
                            ' ',
                            $('span', {className: (this.state.choiceID === item.id ? 'text-bold' : '')}, item.text)
                        ]);
                    }).bind(this))
                ]),
                $('div', {className: 'columns', style: {marginTop: '2rem'}}, [
                    $('div', {className: 'column col-4 col-sm-6'}, $(Link, {to: '/', className: 'btn btn-error btn-block'}, [$('i', {className: 'icon icon-arrow-left'}), ' Kembali'])),
                    $('div', {className: 'column col-4 hide-sm'}),
                    $('div', {className: 'column col-4 col-sm-6'}, $(Link, {to: '/order/' + this.state.choiceID, className: 'btn btn-success btn-block', disabled: this.state.orderInitiating}, ['Lanjut ', $('i', {className: 'icon icon-arrow-right'})])),
                ])
            ])
        ]);
    }

    onChoiceChange(e) {
        this.setState({choiceID: e.target.value});
    }

}

