import {createElement as $} from 'react';
import {Loading, Modal, rpc, idr} from '../aksen.js';

export default class CheckoutModal extends Modal.Window {

    constructor(/* page, email, orderDetails, tickets, category */ props) {
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
            rpc.portal.initiate('SendOrderRequest', {
                email: data.email,
                order_details: data.orderDetails,
                category_id: data.category.category_id,
                tickets: data.tickets
            }).then((res => {
                this.setState({ordering: false});
                if (res.code == 200) {
                    window.alert('Form pemesanan berhasil dikirim! Tagihan telah kami kirim menuju e-mail anda (' + data.email + ')');
                    window.sessionStorage.setItem('aksen.access_invoice_id_history', res.value);
                    this.page.props.history.push('/order/invoice/view', {ordered: true});
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
                    $('div', {className: 'col-3 col-sm-12'}, $('label', {className: 'form-label'}, 'Keterangan pemesanan:')),
                    $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, $('div', {className: 'text-bold text-italic'}, this.props.orderDetails))
                ]),
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'col-3 col-sm-12'}, $('label', {className: 'form-label'}, 'Jumlah tiket:')),
                    $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, $('div', {className: 'text-bold'}, this.props.tickets))
                ]),
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'col-3 col-sm-12'}, $('label', {className: 'form-label'}, 'Kategori tiket:')),
                    $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, $('div', {className: 'text-bold'}, this.props.category.name + ' @ IDR' + this.props.category.price))
                ]),
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'col-3 col-sm-12'}, $('label', {className: 'form-label'}, 'Total yang harus dibayar:')),
                    $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, $('div', {className: 'text-bold'}, idr(this.props.category.price * this.props.tickets) + ' + nomor pemesanan (0-999)'))
                ])
            ]),
            $('p', {style: {marginTop: '2rem'}}, ['Apabila sudah benar, silakan klik tombol ', $('b', null, 'Konfirmasi'), ' untuk langsung memesan tiket. Detail pemesanan tersebut tidak dapat diganti lagi setelah melakukan pemesanan'])
        ];
    }

    _getFooter() {
        return $('div', {className: 'columns'}, [
            $('div', {className: 'column col-4 col-sm-6 col-mr-auto'}, $('button', {className: 'btn btn-error btn-block', onClick: this.onCloseClick}, [$('i', {className: 'icon icon-cross'}), ' Tutup'])),
            $('div', {className: 'column col-4 col-sm-6 col-ml-auto'},
                this.state.ordering ?
                    $('button', {className: 'btn btn-success btn-block', disabled: true}, $(Loading.Text, {description: 'Memesan ...'})) : 
                    $('button', {className: 'btn btn-success btn-block', onClick: this.onConfirmClick}, ['Konfirmasi ', $('i', {className: 'icon icon-check'})])
            )
        ]);
    }

}

