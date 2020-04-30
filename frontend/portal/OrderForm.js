import {Component} from 'react';
import {Link} from 'react-router-dom';
import * as Aksen from '../aksen.js';

import OrderFormUnlocked from './OrderFormUnlocked.js';
import OrderFormLocked from './OrderFormLocked.js';
import CheckoutModal from './CheckoutModal.js';

export default class OrderForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ticketsAvailable: null,
            formData: {
                email: '',
                emailConfirmation: '',
                orderDetails: '',
                categoryID: '',
                tickets: 0
            },
            checkout: false
        };

        this.onOrder = this.onOrder.bind(this);
        this.onCheckoutClose = this.onCheckoutClose.bind(this);
        this.onReturn = this.onReturn.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.formData.categoryID !== prevState.formData.categoryID) {
            this.setState({ticketsAvailable: null});
            window.setTimeout((() => {
                this.setState({ticketsAvailable: 5});
            }).bind(this), 3000);
        }
    }

    render() {
        const locked = false;
        const lockDuration = 86400;
        const data = this.state.formData;

        return [
            $(CheckoutModal, {shown: this.state.checkout, onClose: this.onCheckoutClose, page: this, email: data.email, tickets: data.tickets, categoryName: 'CNAME(' + data.categoryID + ')', categoryPrice: 'CPRICE(' + data.categoryPrice + ')', priceTotal: data.tickets + ' * CPRICE'}),
            $('div', {className: 'container grid-md'}, [
                $('div', {className: 'popup', style: {margin: '2rem'}}, [
                    $('h5', {className: 'text-bold text-primary'}, 'Anda memilih untuk memesan tiket'),
                    (!locked ? $(OrderFormUnlocked, {form: this}) : $(OrderFormLocked, {form: this, duration: lockDuration})),
                    $('div', {className: 'columns', style: {marginTop: '2rem'}}, [
                        $('div', {className: 'column col-4 col-sm-6'}, $(Link, {to: '/order', className: 'btn btn-error btn-block', onClick: this.onReturn}, [$('i', {className: 'icon icon-arrow-left'}), ' Kembali'])),
                        $('div', {className: 'column col-4 hide-sm'}),
                        $('div', {className: 'column col-4 col-sm-6'}, $('button', {className: 'btn btn-success btn-block', onClick: this.onOrder}, ['Pesan Tiket ', $('i', {className: 'icon icon-check'})])),
                    ])
                ])
            ])
        ];
    }

    onOrder() {
        const formData = this.state.formData;
        if (formData.email !== formData.emailConfirmation) {
            window.alert('Mohon cek e-mail anda sekali lagi');
            return;
        }
        if (formData.tickets <= 0) {
            window.alert('Tiket yang dibeli tidak boleh 0!');
            return;
        }
        if (formData.tickets > parseInt(this.ticketsAvailable)) {
            window.alert('Tiket yang dibeli tidak boleh lebih dari tiket yang tersedia! (' + parseInt(this.ticketsAvailable) + ')');
            return;
        }
        this.setState({checkout: true});
    }

    onCheckoutClose() {
        this.setState({checkout: false});
    }

    onReturn(e) {
        if (!window.confirm('Apakah anda yakin? Form yang sudah anda isi akan kembali kosong jika anda kembali ke halaman sebelumnya.')) {
            e.preventDefault();
        }
    }

    cloneData() {
        return Object.assign({}, this.state.formData);
    }

}

