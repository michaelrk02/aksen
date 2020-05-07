import {Component, createElement as $} from 'react';
import {Link} from 'react-router-dom';

export default class Landing extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return $('div', {className: 'container grid-md'}, [
            $('div', {className: 'popup'}, [
                $('h5', {className: 'text-bold text-primary'}, 'Selamat datang di portal pemesanan tiket Ajang Kreasi dan Seni SMA Negeri 3 Surakarta!'),
                $('p', null, ['Silakan lanjut ke prosedur berikutnya dengan mengklik tombol ', $('b', null, 'Lanjut'), '. Jika terdapat masalah, silakan menghubungi panitia di nomor yang telah disediakan di bawah ini. Kami tunggu kedatangan anda di Ajang Kreasi dan Seni SMAN 3 Surakarta!']),
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'text-bold'}, 'Contact person:'),
                    $('div', null, 'Jimmy'),
                    $('div', null, 'Zein')
                ]),
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'text-bold'}, ['Instagram: ', $('a', {href: 'https://www.instagram.com/aksensmaga', target: '_blank'}, '@aksensmaga')])
                ]),
                $('div', {className: 'columns', style: {marginTop: '2rem'}}, [
                    $('div', {className: 'column col-4 col-sm-6'}),
                    $('div', {className: 'column col-4 hide-sm'}),
                    $('div', {className: 'column col-4 col-sm-6'}, $(Link, {to: '/order', className: 'btn btn-success btn-block'}, ['Lanjut ', $('i', {className: 'icon icon-arrow-right'})])),
                ])
            ])
        ]);
    }

}

