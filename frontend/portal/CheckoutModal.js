import {createElement as $} from 'react';
import {RPC, Loading, Modal} from '../aksen.js';

export default class CheckoutModal extends Modal.Window {

    constructor(/* page, email, tickets, categoryName, categoryPrice, priceTotal */ props) {
        super(props);
        this.state = {
            ordering: false
        };
        this.page = this.props.page;

        this.onConfirmClick = this.onConfirmClick.bind(this);
    }

    onConfirmClick() {
        if (window.confirm('Apakah anda yakin?')) {
            const data = this.page.state.formData;
            window.rpc.initiate('send_order_request', {
                email: data.email,
                orderDetails: data.orderDetails,
                categoryID: data.categoryID,
                tickets: data.tickets
            }).then((res => {
                this.setState({ordering: false});
                if (res.code == 200) {
                    window.alert('Form pemesanan berhasil dikirim! Tagihan telah kami kirim menuju e-mail anda (' + data.email + ')');
                    this.page.props.history.push('/');
                } else {
                    window.alert('Terjadi kegagalan: ' + res.status + '. Mohon untuk dicoba lagi');
                }
            }).bind(this)).execute();
            this.setState({ordering: true});
        }
    }

    _getHeader() {
        return $('div', {className: 'modal-title h5'}, 'Periksa kembali detail pemesanan anda');
    }

    _getBody() {
        return [
            $('p', null, 'Silakan periksa kembali apakah data yang anda masukkan sudah benar'),
            $('div', {className: 'form-horizontal'}, [
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'col-3 col-sm-12'}, $('label', {className: 'form-label'}, 'E-mail:')),
                    $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, $('div', {className: 'text-bold'}, this.props.email))
                ]),
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'col-3 col-sm-12'}, $('label', {className: 'form-label'}, 'Jumlah tiket:')),
                    $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, $('div', {className: 'text-bold'}, this.props.tickets))
                ]),
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'col-3 col-sm-12'}, $('label', {className: 'form-label'}, 'Kategori tiket:')),
                    $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, $('div', {className: 'text-bold'}, this.props.categoryName + ' @ IDR' + this.props.categoryPrice))
                ]),
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'col-3 col-sm-12'}, $('label', {className: 'form-label'}, 'Total yang harus dibayar')),
                    $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, $('div', {className: 'text-bold'}, 'IDR' + this.props.priceTotal + ' plus kode unik (0-999)'))
                ])
            ]),
            $('p', null, ['Apabila sudah benar, silakan klik tombol ', $('b', null, 'Konfirmasi pemesanan'), ' untuk langsung memesan tiket. Detail pemesanan tersebut tidak dapat diganti lagi setelah melakukan pemesanan'])
        ];
    }

    _getFooter() {
        return $('div', {className: 'columns'}, [
            $('div', {className: 'column col-4 col-sm-6'}, $('button', {className: 'btn btn-error btn-block', onClick: this.onCloseClick}, [$('i', {className: 'icon icon-cross'}), ' Tutup'])),
            $('div', {className: 'column col-4 hide-sm'}),
            $('div', {className: 'column col-4 col-sm-6'},
                this.state.ordering ?
                $('button', {className: 'btn btn-success btn-block', disabled: true}, $(Loading.Text, {description: 'Memesan ...'})) : 
                $('button', {className: 'btn btn-success btn-block', onClick: this.onConfirmClick}, ['Konfirmasi ', $('i', {className: 'icon icon-check'})])
            )
        ]);
    }

}

