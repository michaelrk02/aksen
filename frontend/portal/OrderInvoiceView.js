import {Component, createElement as $} from 'react';
import {Link} from 'react-router-dom';

export default class OrderInvoiceView extends Component {

    constructor(props) {
        super(props);
        this.accessInvoiceID = null;

        this.onFinishClick = this.onFinishClick.bind(this);

        if (window.accessInvoiceID === '') {
            this.props.history.replace('/order/invoice');
            return;
        }
        this.accessInvoiceID = window.accessInvoiceID;
        window.accessInvoiceID = '';
    }

    componentDidMount() {
        window.sessionStorage.setItem('aksen.access_invoice_id_history', this.accessInvoiceID);
    }

    render() {
        return $('div', {className: 'container grid-md'}, [
            $('div', {className: 'popup', style: {margin: '2rem'}}, [
                $('h5', {className: 'text-bold text-primary'}, 'Tagihan'),
                $('p', null, 'Anda sedang melihat tagihan anda dengan kode tagihan: ' + this.accessInvoiceID),
                $('div', {className: 'columns', style: {marginTop: '2rem'}}, [
                    $('div', {className: 'column col-4 col-sm-6'}, $(Link, {to: '/order/invoice', className: 'btn btn-error btn-block'}, [$('i', {className: 'icon icon-arrow-left'}), ' Kembali'])),
                    $('div', {className: 'column col-4 hide-sm'}),
                    $('div', {className: 'column col-4 col-sm-6'}, $('button', {className: 'btn btn-success btn-block', onClick: this.onFinishClick}, ['Selesai ', $('i', {className: 'icon icon-check'})])),
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

