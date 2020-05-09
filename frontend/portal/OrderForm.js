import {Component, createElement as $} from 'react';
import {Link} from 'react-router-dom';
import {Loading, rpc} from '../aksen.js';

import OrderFormUnlocked from './OrderFormUnlocked.js';
import OrderFormLocked from './OrderFormLocked.js';
import CheckoutModal from './CheckoutModal.js';

export default class OrderForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lockDuration: -1,
            ticketsAvailable: -1,
            ticketsMax: null,
            formData: {
                email: '',
                emailConfirmation: '',
                orderDetails: '',
                category: {
                    category_id: '',
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
    }

    componentDidMount() {
        this.determineLock();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.formData.category.category_id !== prevState.formData.category.category_id) {
            this.setState({ticketsAvailable: null});
            rpc.aksen.initiate('GetAvailableTickets', {
                category_id: this.state.formData.category.category_id
            }).then((res => {
                if (res.code == 200) {
                    this.setState({ticketsAvailable: res.value});
                } else {
                    window.alert('Gagal mendapatkan jumlah tiket tersedia: ' + res.status + '. Mohon coba lagi');

                    const formData = this.cloneData();
                    formData.category.category_id = '';
                    formData.category.name = '';
                    formData.category.price = 0;
                    formData.tickets = 0;

                    this.setState({ticketsAvailable: -1, formData: formData});
                }
            }).bind(this)).execute();
        }
    }

    render() {
        const locked = this.state.lockDuration > 0;
        const data = this.state.formData;

        return [
            $(CheckoutModal, {shown: this.state.checkout, onClose: this.onCheckoutClose, page: this, email: data.email, orderDetails: data.orderDetails, tickets: data.tickets, category: data.category}),
            $('div', {className: 'container grid-md'}, [
                $('div', {className: 'popup'}, [
                    $('h5', {className: 'text-bold text-primary'}, 'Anda memilih untuk memesan tiket'),
                    $('p', null, 'Silakan mengisi form di bawah ini untuk melakukan pemesanan. Anda dapat menggunakan alamat e-mail yang sama jika ingin memesan lebih dari satu kali (dengan syarat harus menunggu beberapa jam atau menit untuk kembali melakukan pemesanan)'),
                    (!locked ?
                        ((this.state.lockDuration === -1) ?
                            $(Loading.Text, {description: 'Menghubungi server ...'}) :
                            $(OrderFormUnlocked, {form: this})) :
                        $(OrderFormLocked, {form: this, duration: this.state.lockDuration})),
                    $('div', {className: 'columns', style: {marginTop: '2rem'}}, [
                        $('div', {className: 'column col-4 col-sm-6 col-mr-auto'}, $(Link, {to: '/order', className: 'btn btn-error btn-block', onClick: this.onReturn}, [$('i', {className: 'icon icon-arrow-left'}), ' Kembali'])),
                        $('div', {className: 'column col-4 col-sm-6 col-ml-auto'}, $('button', {className: 'btn btn-success btn-block', disabled: locked, onClick: this.onOrder}, ['Pesan Tiket ', $('i', {className: 'icon icon-check'})]))
                    ])
                ])
            ])
        ];
    }

    determineLock() {
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
        const formInputs = ['email', 'emailConfirmation', 'orderDetails', 'tickets'].map(id => document.getElementById('__' + id));
        let validationSucceeded = true;
        for (let input of formInputs) {
            if (!input.reportValidity()) {
                validationSucceeded = false;
                break;
            }
        }
        if (!validationSucceeded) {
            return;
        }

        const formData = this.state.formData;
        if (formData.email !== formData.emailConfirmation) {
            window.alert('Mohon cek e-mail anda sekali lagi');
            return;
        }
        if (formData.category.category_id === '') {
            window.alert('Silakan pilih kategori tiket terlebih dahulu');
            return;
        }
        if (formData.tickets <= 0) {
            window.alert('Silakan masukkan jumlah tiket yang akan anda beli');
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

