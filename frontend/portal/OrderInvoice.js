import {Component, createElement as $} from 'react';
import {Link} from 'react-router-dom';

export default class OrderInvoice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            invoiceID: '',
            invoiceIDFromHistory: false
        };

        this.onInvoiceIDChange = this.onInvoiceIDChange.bind(this);
        this.onInvoiceIDNew = this.onInvoiceIDNew.bind(this);
        this.onViewClick = this.onViewClick.bind(this);
    }

    componentDidMount() {
        const invoiceID = window.sessionStorage.getItem('aksen.access_invoice_id_history');
        if (invoiceID !== null) {
            this.setState({invoiceID: invoiceID, invoiceIDFromHistory: true});
        }
    }

    render() {
        return $('div', {className: 'container grid-md'}, [
            $('div', {className: 'popup'}, [
                $('h5', {className: 'text-bold text-primary'}, 'Anda memilih untuk mengakses tagihan anda'),
                $('p', null, 'Silakan masukkan kode tagihan yang telah kami kirim melalui e-mail pada kotak di bawah'),
                $('div', {className: 'form-horizontal'}, [
                    $('div', {className: 'form-group'}, [
                        $('div', {className: 'col-3 col-sm-12'}, $('label', {className: 'form-label'}, 'Kode tagihan:')),
                        $('div', {className: 'col-9 col-sm-12 columns', style: {margin: 'auto 0px'}}, [
                            $('div', {className: 'column col-' + (this.state.invoiceIDFromHistory ? 9 : 12) + ' col-sm-12 input-group'}, [
                                $('span', {className: 'input-group-addon'}, $('i', {className: 'icon icon-copy'})),
                                $('input', {type: 'password', className: 'form-input', placeholder: 'Tempelkan di sini', readOnly: this.state.invoiceIDFromHistory, value: this.state.invoiceID, onChange: this.onInvoiceIDChange})
                            ]),
                            this.state.invoiceIDFromHistory ?
                                $('div', {className: 'column col-3 col-sm-12'}, $('button', {className: 'btn btn-primary', onClick: this.onInvoiceIDNew}, ['Input baru ', $('i', {className: 'icon icon-edit'})])) :
                                null
                        ])
                    ])
                ]),
                $('div', {className: 'columns', style: {marginTop: '2rem'}}, [
                    $('div', {className: 'column col-4 col-sm-6 col-mr-auto'}, $(Link, {to: '/order', className: 'btn btn-error btn-block'}, [$('i', {className: 'icon icon-arrow-left'}), ' Kembali'])),
                    $('div', {className: 'column col-4 col-sm-6 col-ml-auto'}, $('button', {className: 'btn btn-success btn-block', onClick: this.onViewClick}, ['Lihat tagihan ', $('i', {className: 'icon icon-arrow-right'})]))
                ])
            ])
        ]);
    }

    onInvoiceIDNew() {
        this.setState({invoiceID: '', invoiceIDFromHistory: false});
    }

    onInvoiceIDChange(e) {
        this.setState({invoiceID: e.target.value});
    }

    onViewClick() {
        if (this.state.invoiceID === '') {
            window.alert('Kode tagihan tidak boleh kosong!');
            return;
        }
        window.sessionStorage.setItem('aksen.access_invoice_id_history', this.state.invoiceID);
        this.props.history.push('/order/invoice/view');
    }

}

