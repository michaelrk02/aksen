import {Component, createElement as $} from 'react';
import {Link} from 'react-router-dom';
import {Loading, rpc, idr} from '../aksen.js';

export default class OrderInvoiceView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            invoiceDetails: null,
            ticketPrice: 0,
            activeTab: 'amount',
            activePaymentMethod: 'bank_transfer',
            expireDuration: 0
        };
        this.accessInvoiceID = null;
        this.expireTimer = null;

        this.onTabChange = this.onTabChange.bind(this);
        this.onPaymentMethodChange = this.onPaymentMethodChange.bind(this);
        this.onPayClick = this.onPayClick.bind(this);
        this.onFinishClick = this.onFinishClick.bind(this);

        if (window.sessionStorage.getItem('aksen.access_invoice_id_history') === null) {
            this.props.history.replace('/order/invoice');
            return;
        }
        this.accessInvoiceID = window.sessionStorage.getItem('aksen.access_invoice_id_history');
    }

    componentDidMount() {
        rpc.portal.initiate('GetInvoiceDetails', {
            invoice_id: this.accessInvoiceID
        }).then((res => {
            if (res.code == 200) {
                this.setState({invoiceDetails: res.value, expireDuration: res.value.expire_duration});

                this.expireTimer = window.setInterval((() => {
                    if (this.state.expireDuration > 0) {
                        this.setState({expireDuration: this.state.expireDuration - 1});
                    }
                }).bind(this), 1000);

                rpc.aksen.initiate('GetTicketPrice', {
                    category_id: res.value.category_id
                }).then((res => {
                    if (res.code == 200) {
                        this.setState({ticketPrice: res.value});
                        window.sessionStorage.setItem('aksen.payment_amount', this.getTotalPrice());
                        window.sessionStorage.setItem('aksen.payment_amount_offline', this.state.invoiceDetails.tickets * res.value);
                    } else {
                        window.alert('Gagal mendapatkan harga tiket per satuan: ' + res.status + '. Mohon coba lagi');
                    }
                }).bind(this)).execute();
            } else {
                window.alert('Gagal mendapatkan keterangan tagihan: ' + res.status + '. Mohon coba lagi');
            }
        }).bind(this)).execute();
    }

    componentWillUnmount() {
        if (this.expireTimer !== null) {
            window.clearInterval(this.expireTimer);
        }
    }

    render() {
        const details = this.state.invoiceDetails;
        let timeLeftStr = '';
        if (details !== null) {
            const hours = Math.floor(this.state.expireDuration / 3600);
            const minutes = Math.floor(this.state.expireDuration / 60) % 60;
            const seconds = this.state.expireDuration % 60;
            timeLeftStr = hours + ' jam ' + minutes + ' menit ' + seconds + ' detik';
        }

        return $('div', {className: 'container grid-md'}, [
            $('div', {className: 'popup'}, [
                $('h5', {className: 'text-bold text-primary'}, 'Tagihan'),
                (details === null ?
                    $(Loading.Text, {description: 'Menghubungi server ...'}) :
                    $('div', {className: 'panel'}, [
                        $('div', {className: 'panel-header'}, [
                            $('div', {className: 'columns m-2'}, $('div', {className: 'column col-auto col-mr-auto col-ml-auto'}, $('figure', {className: 'avatar avatar-xl'}, $('i', {className: 'icon icon-people icon-2x', style: {width: '100%', margin: '0.75rem auto'}})))),
                            $('div', {className: 'columns m-2'}, $('div', {className: 'column col-auto col-mr-auto col-ml-auto'}, details.email))
                        ]),
                        $('div', {className: 'panel-nav'}, [
                            $('ul', {className: 'tab tab-block'}, [['amount', 'Nominal'], ['details', 'Keterangan'], ['payment', 'Pembayaran']].map((item => {
                                return $('li', {className: 'tab-item' + (this.state.activeTab === item[0] ? ' active' : '')}, $('a', {href: '#!', 'data-tab': item[0], onClick: this.onTabChange}, item[1]));
                            }).bind(this)))
                        ]),
                        $('div', {className: 'panel-body p-2'}, (() => {
                            const details = this.state.invoiceDetails;
                            const paymentMethods = [
                                ['bank_transfer', 'Transfer antar-bank'],
                                ['gopay', 'Transfer ke rekening GO-PAY'],
                                ['ovo', 'Transfer ke rekening OVO'],
                                ['offline', 'Pembayaran offline secara cash'],
                                ['partnership', 'Pembayaran offline via pihak ketiga'],
                            ];

                            switch (this.state.activeTab) {
                            case 'amount': return $('div', {className: 'm-2'}, [
                                $('div', {className: 'form-group'}, [
                                    $('div', {className: 'text-bold'}, 'Jumlah tiket'),
                                    $('div', null, details.tickets)
                                ]),
                                $('div', {className: 'form-group'}, [
                                    $('div', {className: 'text-bold'}, 'Harga satu tiket'),
                                    $('div', null, idr(this.state.ticketPrice))
                                ]),
                                $('div', {className: 'form-group'}, [
                                    $('div', {className: 'text-bold'}, 'Subtotal harga'),
                                    $('div', null, idr(details.tickets * this.state.ticketPrice))
                                ]),
                                $('div', {className: 'form-group'}, [
                                    $('div', {className: 'text-bold'}, 'Nomor pemesanan'),
                                    $('div', null, idr(details.order_id))
                                ]),
                                $('div', {className: 'form-group'}, [
                                    $('div', {className: 'text-bold'}, 'TOTAL'),
                                    $('div', null, idr(this.getTotalPrice()))
                                ])
                            ]);
                            case 'details': return $('div', {className: 'm-2'}, [
                                $('div', {className: 'form-group'}, [
                                    $('div', {className: 'text-bold'}, 'E-mail'),
                                    $('div', null, details.email)
                                ]),
                                $('div', {className: 'form-group'}, [
                                    $('div', {className: 'text-bold'}, 'Keterangan pemesanan'),
                                    $('div', null, details.order_details)
                                ]),
                                $('div', {className: 'form-group'}, [
                                    $('div', {className: 'text-bold'}, 'Waktu memesan'),
                                    $('div', null, details.order_time)
                                ]),
                                $('div', {className: 'form-group'}, [
                                    $('div', {className: 'text-bold'}, 'Waktu kadaluarsa tagihan'),
                                    $('div', null, details.expire_time)
                                ])
                            ]);
                            case 'payment': return $('div', {className: 'm-2'}, [
                                $('p', null, ['Silakan pilih salah satu metode pembayaran di bawah kemudian klik tombol ', $('b', null, 'Lanjut')], '. Nomor pemesanan ', $('b', null, 'wajib'), ' ditambahkan sebagai nominal jika ingin melakukan transaksi secara tidak tunai.'),
                                paymentMethods.map((item => {
                                    const active = this.state.activePaymentMethod;
                                    return $('label', {className: 'form-radio'}, [
                                        $('input', {type: 'radio', name: '__activePaymentMethod', value: item[0], checked: (active === item[0]), onChange: this.onPaymentMethodChange}),
                                        $('i', {className: 'form-icon'}),
                                        ' ',
                                        $('span', {className: (active === item[0] ? 'text-bold' : '')}, item[1])
                                    ]);
                                }).bind(this))
                            ]);
                            }
                        }).bind(this)()),
                        $('div', {className: 'panel-footer'}, [
                            (this.state.expireDuration <= 0 ?
                                $('div', {className: 'form-group bg-error p-2'}, $('p', null, 'Tagihan anda telah kadaluarsa. Jika anda belum membayar, silakan untuk membuat pemesanan lagi dengan mengisi data yang sama kemudian membayar pemesanan tersebut')) :
                                $('div', {className: 'form-group bg-gray p-2'}, [
                                    $('p', null, 'Waktu tersisa untuk membayar sebelum tagihan mengalami kadaluarsa:'),
                                    $('h3', {className: 'text-center'}, timeLeftStr)
                                ])),
                            $('div', null, this.state.activeTab === 'payment' ?
                                $('a', {className: 'btn btn-primary btn-block', target: '_blank', href: window.baseURL + 'index.php/payment/' + this.state.activePaymentMethod}, ['Lanjut ', $('i', {className: 'icon icon-arrow-right'})]) :
                                $('button', {className: 'btn btn-primary btn-block', onClick: this.onPayClick}, 'Bayar sekarang')
                            )
                        ])
                    ])),
                $('div', {className: 'columns', style: {marginTop: '2rem'}}, [
                    $('div', {className: 'column col-4 col-sm-6 col-mr-auto'}, $(Link, {to: '/order/invoice', className: 'btn btn-error btn-block'}, [$('i', {className: 'icon icon-arrow-left'}), ' Kembali'])),
                    $('div', {className: 'column col-4 col-sm-6 col-ml-auto'}, $('button', {className: 'btn btn-success btn-block', onClick: this.onFinishClick}, ['Selesai ', $('i', {className: 'icon icon-check'})]))
                ])
            ])
        ]);
    }

    onTabChange(e) {
        e.preventDefault();
        this.setState({activeTab: e.target.getAttribute('data-tab')});
    }

    onPaymentMethodChange(e) {
        this.setState({activePaymentMethod: e.target.value});
    }

    onPayClick() {
        this.setState({activeTab: 'payment'});
    }

    onFinishClick() {
        if (window.confirm('Apakah anda yakin ingin keluar?')) {
            if (window.confirm('Hapus riwayat akses anda juga? Jika iya, anda diharuskan untuk menginput kode tagihan lagi (riwayat akses akan terhapus secara otomatis jika anda keluar dari browser)')) {
                window.sessionStorage.removeItem('aksen.access_invoice_id_history');
                window.alert('Riwayat akses telah dihapus');
            }
            this.props.history.push('/');
        }
    }

    getTotalPrice() {
        const details = this.state.invoiceDetails;
        if (details !== null) {
            return parseInt(details.tickets * this.state.ticketPrice) + parseInt(details.order_id);
        }

        return 0;
    }

}

