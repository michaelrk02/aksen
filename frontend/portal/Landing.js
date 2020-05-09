import {Component, createElement as $} from 'react';
import {Link} from 'react-router-dom';
import {Loading, rpc} from '../aksen.js';

export default class Landing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contactPersons: null
        };
    }

    componentDidMount() {
        rpc.portal.initiate('GetContactPersons').then((res => {
            if (res.code == 200) {
                this.setState({contactPersons: res.value});
            } else {
                this.setState({contactPersons: res.status});
            }
        }).bind(this)).execute();
    }

    render() {
        let contactPersons = this.state.contactPersons;
        if (contactPersons === null) {
            contactPersons = $(Loading.Text, {description: 'Mendapatkan ...'});
        } else if (typeof(contactPersons) === 'object') {
            contactPersons = $('ul', null, contactPersons.map(cp => {
                return $('li', null, [cp.name + ' (', $('a', {target: '_blank', href: 'https://api.whatsapp.com/send?phone=' + cp.phoneNumber}, 'hubungi'), ')']);
            }));
        }

        return $('div', {className: 'container grid-md'}, [
            $('div', {className: 'popup'}, [
                $('h5', {className: 'text-bold text-primary'}, 'Selamat datang di portal pemesanan tiket Ajang Kreasi dan Seni SMA Negeri 3 Surakarta!'),
                $('p', null, ['Silakan lanjut ke prosedur berikutnya dengan mengklik tombol ', $('b', null, 'Lanjut'), '. Jika terdapat masalah, silakan menghubungi panitia di nomor yang telah disediakan di bawah ini. Kami tunggu kedatangan anda di Ajang Kreasi dan Seni SMAN 3 Surakarta!']),
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'text-bold'}, 'Contact person:'),
                    contactPersons
                ]),
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'text-bold'}, ['Instagram: ', $('a', {href: 'https://www.instagram.com/aksensmaga', target: '_blank'}, '@aksensmaga')])
                ]),
                $('div', {className: 'columns', style: {marginTop: '2rem'}}, [
                    $('div', {className: 'column col-4 col-sm-6 col-ml-auto'}, $(Link, {to: '/order', className: 'btn btn-success btn-block'}, ['Lanjut ', $('i', {className: 'icon icon-arrow-right'})]))
                ])
            ])
        ]);
    }

}

