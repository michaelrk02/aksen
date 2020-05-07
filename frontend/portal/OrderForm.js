import {Component, createElement as $} from 'react';
import {Link} from 'react-router-dom';
import {rpc} from '../aksen.js';

import OrderFormUnlocked from './OrderFormUnlocked.js';
import OrderFormLocked from './OrderFormLocked.js';
import CheckoutModal from './CheckoutModal.js';

export default class OrderForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lockDuration: 0,
            ticketsAvailable: -1,
            ticketsMax: null,
            formData: {
                email: '',
                emailConfirmation: '',
                orderDetails: '',
                category: {
                    id: '',
                    name: '',
                    price: 0
                },
                tickets: 0
            },
            checkout: false
        };

        this.onOrder = this.onOrder.bind(this);
        this.onCheckoutClose = this.onCheckoutClose.bind(this);
        this.onReturn = this.onReturn.bind(this);

        if (window.orderInitiated === false) {
            this.props.history.replace('/order');
            return;
        }
        window.orderInitiated = false;
    }

    componentDidMount() {
        rpc.portal.initiate('GetLockDuration').then((res => {
            if (res.code == 200) {
                this.setState({lockDuration: res.value});
                if (res.value == 0) {
                    this.initMaxTickets();
                }
            } else {
                window.alert('Gagal menghubungi server: ' + res.status + '. Mohon coba lagi');
            }
        }).bind(this)).execute();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.formData.category.id !== prevState.formData.category.id) {
            this.setState({ticketsAvailable: null});
            rpc.aksen.initiate('GetAvailableTickets', {
                categoryID: this.state.formData.category.id
            }).then((res => {
                if (res.code == 200) {
                    this.setState({ticketsAvailable: res.value});
                } else {
                    window.alert('Gagal mendapatkan jumlah tiket tersedia: ' + res.status + '. Mohon coba lagi');

                    const formData = this.cloneData();
                    formData.category.id = '';
                    formData.category.name = '';
                    formData.category.price = 0;
                    formData.tickets = 0;

                    this.setState({ticketsAvailable: -1, formData: formData});
                }
            }).bind(this)).execute();
        }
    }

    render() {
        const locked = this.state.lockDuration != 0;
        const data = this.state.formData;

        return [
            $(CheckoutModal, {shown: this.state.checkout, onClose: this.onCheckoutClose, page: this, email: data.email, orderDetails: data.orderDetails, tickets: data.tickets, category: data.category}),
            $('div', {className: 'container grid-md'}, [
                $('div', {className: 'popup', style: {margin: '2rem'}}, [
                    $('h5', {className: 'text-bold text-primary'}, 'Anda memilih untuk memesan tiket'),
                    $('p', null, 'Silakan mengisi form di bawah ini untuk melakukan pemesanan. Anda dapat menggunakan alamat e-mail yang sama jika ingin memesan lebih dari satu kali (dengan syarat harus menunggu beberapa jam atau menit untuk kembali melakukan pemesanan)'),
                    (!locked ? $(OrderFormUnlocked, {form: this}) : $(OrderFormLocked, {form: this, duration: this.state.lockDuration})),
                    $('div', {className: 'columns', style: {marginTop: '2rem'}}, [
                        $('div', {className: 'column col-4 col-sm-6'}, $(Link, {to: '/order', className: 'btn btn-error btn-block', onClick: this.onReturn}, [$('i', {className: 'icon icon-arrow-left'}), ' Kembali'])),
                        $('div', {className: 'column col-4 hide-sm'}),
                        $('div', {className: 'column col-4 col-sm-6'}, $('button', {className: 'btn btn-success btn-block', disabled: locked, onClick: this.onOrder}, ['Pesan Tiket ', $('i', {className: 'icon icon-check'})])),
                    ])
                ])
            ])
        ];
    }

    initMaxTickets() {
        rpc.aksen.initiate('GetMaxTickets').then((res => {
            if (res.code == 200) {
                this.setState({ticketsMax: res.value});
            } else {
                window.alert('Gagal mendapatkan jumlah tiket maksimum yang dapat dibeli: ' + res.status + '. Mohon coba lagi');
                this.setState({ticketsMax: null});
            }
        }).bind(this)).execute();
    }

    onOrder() {
        const formData = this.state.formData;
        if (formData.email === '') {
            window.alert('E-mail tidak boleh kosong!');
            return;
        }
        if (formData.email !== formData.emailConfirmation) {
            window.alert('Mohon cek e-mail anda sekali lagi');
            return;
        }
        if (formData.tickets <= 0) {
            window.alert('Tiket yang dibeli tidak boleh 0!');
            return;
        }
        if (formData.tickets > parseInt(this.state.ticketsAvailable)) {
            window.alert('Tiket yang dibeli tidak boleh lebih dari tiket yang tersedia! (' + parseInt(this.ticketsAvailable) + ')');
            return;
        }
        if (formData.tickets > parseInt(this.state.ticketsMax)) {
            window.alert('Anda hanya dapat membeli maksimal sebanyak ' + parseInt(this.state.ticketsMax) + ' tiket');
            return;
        }
        this.setState({checkout: true});
    }

    onCheckoutClose() {
        this.setState({checkout: false});
    }

    onReturn(e) {
        if (this.state.lockDuration == 0) {
            if (!window.confirm('Apakah anda yakin? Form yang sudah anda isi akan kembali kosong jika anda kembali ke halaman sebelumnya.')) {
                e.preventDefault();
            }
        }
    }

    cloneData() {
        return Object.assign({}, this.state.formData);
    }

}

