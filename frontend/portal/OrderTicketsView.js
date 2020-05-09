import {Component, createElement as $} from 'react';
import {Link} from 'react-router-dom';

export default class OrderTicketsView extends Component {

    constructor(props) {
        super(props);
        this.accessInvoiceID = null;

        this.onFinishClick = this.onFinishClick.bind(this);

        if (window.sessionStorage.getItem('aksen.access_invoice_id_history') === null) {
            this.props.history.replace('/order/tickets');
            return;
        }
        this.accessInvoiceID = window.sessionStorage.getItem('aksen.access_invoice_id_history');
    }

    render() {
        return $('div', {className: 'container grid-md'}, [
            $('div', {className: 'popup'}, [
                $('h5', {className: 'text-bold text-primary'}, 'E-tiket'),
                $('p', null, 'Anda sedang melihat e-tiket anda dengan kode tagihan: ' + this.accessInvoiceID),
                $('div', {className: 'columns', style: {marginTop: '2rem'}}, [
                    $('div', {className: 'column col-4 col-sm-6 col-mr-auto'}, $(Link, {to: '/order/tickets', className: 'btn btn-error btn-block'}, [$('i', {className: 'icon icon-arrow-left'}), ' Kembali'])),
                    $('div', {className: 'column col-4 col-sm-6 col-ml-auto'}, $('button', {className: 'btn btn-success btn-block', onClick: this.onFinishClick}, ['Selesai ', $('i', {className: 'icon icon-check'})]))
                ])
            ])
        ]);
    }

    onFinishClick() {
        if (window.confirm('Hapus riwayat akses anda juga? Jika iya, anda diharuskan untuk menginput kode tagihan lagi (riwayat akses akan terhapus secara otomatis jika anda keluar dari browser)')) {
            window.sessionStorage.removeItem('aksen.access_invoice_id_history');
            window.alert('Riwayat akses telah dihapus');
        }
        this.props.history.push('/');
    }

}

