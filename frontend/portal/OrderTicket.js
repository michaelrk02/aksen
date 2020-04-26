import {Component} from 'react';
import {Link} from 'react-router-dom';
import * as Aksen from '../aksen.js';

export default class OrderTicket extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return $('div', {className: 'container grid-md'}, [
            $('div', {className: 'popup', style: {margin: '2rem'}}, [
                $('h5', {className: 'text-bold text-primary'}, 'Anda memilih untuk mengakses e-tiket anda'),
                $('p', null, 'Silakan masukkan kode invoice yang telah kami kirim melalui e-mail pada kotak di bawah'),
                $('div', {className: 'columns', style: {marginTop: '2rem'}}, [
                    $('div', {className: 'column col-4 col-sm-6'}, $(Link, {to: '/order', className: 'btn btn-error btn-block'}, [$('i', {className: 'icon icon-arrow-left'}), ' Kembali'])),
                    $('div', {className: 'column col-4 hide-sm'}),
                    $('div', {className: 'column col-4 col-sm-6'}, $('button', {className: 'btn btn-success btn-block'}, ['Lihat e-tiket ', $('i', {className: 'icon icon-check'})])),
                ])
            ])
        ]);
    }

}

