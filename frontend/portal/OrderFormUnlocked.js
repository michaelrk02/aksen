import {Component} from 'react';
import {Link} from 'react-router-dom';

import {RequiredField, Loading} from '../aksen.js';

export default class OrderFormUnlocked extends Component {

    constructor(/* form */ props) {
        super(props);
        this.form = this.props.form;

        this.onEmailChange = this.onEmailChange.bind(this);
        this.onEmailConfirmationChange = this.onEmailConfirmationChange.bind(this);
        this.onOrderDetailsChange = this.onOrderDetailsChange.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.onTicketsChange = this.onTicketsChange.bind(this);
        this.onTicketAdd = this.onTicketAdd.bind(this);
        this.onTicketRemove = this.onTicketRemove.bind(this);
        this.onResetTickets = this.onResetTickets.bind(this);
    }

    render() {
        const categories = [{id: 'A0', name: 'Presale 1', price: 50000}, {id: 'A1', name: 'Presale 2', price: 75000}, {id: 'A3', name: 'Presale 3', price: 100000}];
        const formState = this.form.state;
        const formData = formState.formData;

        let ticketsAvailable = formState.ticketsAvailable;
        if (ticketsAvailable === null) {
            ticketsAvailable = $(Loading.Text);
        } else {
            ticketsAvailable = $('b', null, ticketsAvailable);
        }

        return $('div', {className: 'form-horizontal'}, [
            $('p', null, 'Silakan mengisi form di bawah ini untuk melakukan pemesanan. Anda dapat menggunakan alamat e-mail yang sama jika ingin memesan lebih dari satu kali (dengan syarat harus menunggu beberapa jam atau menit untuk kembali melakukan pemesanan)'),
            $('div', {className: 'form-group'}, [
                $('div', {className: 'col-3 col-sm-12'}, $('label', {className: 'form-label'}, ['E-mail:', $(RequiredField)])),
                $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, $('div', {className: 'input-group'}, [
                    $('span', {className: 'input-group-addon'}, '@'),
                    $('input', {type: 'email', className: 'form-input', placeholder: 'E-mail', value: formData.email, onChange: this.onEmailChange})
                ])),
            ]),
            $('div', {className: 'form-group'}, [
                $('div', {className: 'col-3 col-sm-12'}, $('label', {className: 'form-label'}, ['Ulangi e-mail:', $(RequiredField)])),
                $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, $('div', {className: 'input-group'}, [
                    $('span', {className: 'input-group-addon'}, '@'),
                    $('input', {type: 'email', className: 'form-input', placeholder: 'Ulangi e-mail', value: formData.emailConfirmation, onChange: this.onEmailConfirmationChange})
                ])),
            ]),
            $('div', {className: 'form-group'}, [
                $('div', {className: 'col-3 col-sm-12'}, $('label', {className: 'form-label'}, 'Keterangan pemesanan:')),
                $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, $('div', {className: 'input-group'}, [
                    $('span', {className: 'input-group-addon'}, $('i', {className: 'icon icon-edit'})),
                    $('input', {type: 'text', className: 'form-input', placeholder: 'Keterangan pemesanan (opsional)', value: formData.orderDetails, onChange: this.onOrderDetailsChange})
                ])),
            ]),
            $('div', {className: 'form-group'}, [
                $('div', {className: 'col-3 col-sm-12'}, $('label', {className: 'form-label'}, ['Pilih kategori tiket: ', $(RequiredField)])),
                $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, categories.map(category => {
                    return $('div', null, $('label', {className: 'form-radio'}, [
                        $('input', {type: 'radio', name: '__categoryID', value: category.id, checked: (formData.categoryID === category.id), onChange: this.onCategoryChange}),
                        $('i', {className: 'form-icon'}),
                        ' ' + category.name + ' @ IDR' + category.price
                    ]));
                }))
            ]),
            $('div', {className: 'form-group'}, [
                $('div', {className: 'col-3 col-sm-12'}, $('label', {className: 'form-label'}, 'Tiket tersedia: ')),
                $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, ticketsAvailable),
            ]),
            $('div', {className: 'form-group'}, [
                $('div', {className: 'col-3 col-sm-12'}, $('label', {className: 'form-label'}, ['Jumlah tiket:', $(RequiredField)])),
                $('div', {className: 'col-9 col-sm-12 columns', style: {margin: 'auto 0px'}}, [
                    $('div', {className: 'column col-4 col-sm-9 input-group'}, [
                        $('button', {className: 'input-group-btn btn btn-primary', onClick: this.onTicketRemove}, $('i', {className: 'icon icon-minus'})),
                        $('input', {type: 'number', className: 'form-input', value: formData.tickets, onChange: this.onTicketsChange}),
                        $('button', {className: 'input-group-btn btn btn-primary', onClick: this.onTicketAdd}, $('i', {className: 'icon icon-plus'}))
                    ]),
                    $('div', {className: 'column col-6 col-sm-3'}, $('button', {className: 'btn btn-primary', onClick: this.onResetTickets}, $('i', {className: 'icon icon-refresh'})))
                ])
            ])
        ]);
    }

    onEmailChange(e) {
        const formData = this.form.cloneData();
        formData.email = e.target.value;

        this.form.setState({formData: formData});
    }

    onEmailConfirmationChange(e) {
        const formData = this.form.cloneData();
        formData.emailConfirmation = e.target.value;

        this.form.setState({formData: formData});
    }

    onOrderDetailsChange(e) {
        const formData = this.form.cloneData();
        formData.orderDetails = e.target.value;

        this.form.setState({formData: formData});
    }

    onCategoryChange(e) {
        const formData = this.form.cloneData();
        formData.categoryID = e.target.value;
        formData.tickets = 0;

        this.form.setState({formData: formData});
    }

    onTicketsChange(e) {
        const formData = this.form.cloneData();
        formData.tickets = parseInt(e.target.value);

        this.form.setState({formData: formData});
    }

    onTicketAdd() {
        const formData = this.form.cloneData();
        if (formData.tickets < parseInt(this.form.state.ticketsAvailable)) {
            formData.tickets++;

            this.form.setState({formData: formData});
        }
    }

    onTicketRemove() {
        const formData = this.form.cloneData();
        if (formData.tickets > 0) {
            formData.tickets--;

            this.form.setState({formData: formData});
        }
    }

    onResetTickets() {
        const formData = this.form.cloneData();
        formData.tickets = 0;

        this.form.setState({formData: formData});
    }

}

