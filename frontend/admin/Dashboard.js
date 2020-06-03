import {Component, createElement as $} from 'react';
import Chart from 'chart.js';
import {Loading, rpc, idr} from '../aksen.js';
import {authCheck} from './lib/auth-checker.js';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            info: null
        };
    }

    componentDidMount() {
        authCheck(this, (res => {
            if (res.code == 200) {
                rpc.admin.initiate('GetDashboardInfo').then((res => {
                    if (res.code == 200) {
                        this.setState({info: res.value});
                        this.initializeChart();
                    } else {
                        window.alert('Gagal mendapatkan informasi: ' + res.status + '. Mohon coba lagi');
                    }
                }).bind(this)).execute();
            }
        }).bind(this));
    }

    render() {
        const info = this.state.info;
        const items = [];
        if (info !== null) {
            items.push(['Tagihan aktif', info.invoices_active]);
            items.push(['Tagihan kadaluarsa', info.invoices_expired]);
            items.push(['Total permintaan pemesanan', parseInt(info.invoices_active) + parseInt(info.invoices_expired)]);
            items.push(['Tagihan tertahan', info.invoices_kept]);
            items.push(['Pelanggan aktif', info.customers]);
            items.push(['Tiket terjual', info.tickets_sold_total]);
        }

        return [
            $(Loading.Modal, {shown: info === null, description: 'Mendapatkan informasi ...'}),
            info === null ?
                null :
                $('div', null, [
                    $('div', {className: 'columns'}, [
                        ...items.map(item => {
                            return $('div', {className: 'column col-3 col-sm-6', style: {padding: '0.25rem'}}, [
                                $('div', {className: 'popup-small', style: {height: '100%'}}, [
                                    $('div', {className: 'columns'}, [
                                        $('div', {className: 'column col-3 col-md-12 h3 text-primary'}, item[1]),
                                        $('div', {className: 'column col-9 col-md-12'}, item[0])
                                    ])
                                ])
                            ]);
                        })
                    ]),
                    $('div', {className: 'popup'}, [
                        $('h5', null, 'Statistik Penjualan Tiket'),
                        $('div', {className: 'columns'}, [
                            $('div', {className: 'column col-6 col-sm-12 form-group', style: {overflow: 'auto'}}, [
                                $('canvas', {id: '__sales', width: 160 * info.categories.length, height: 480})
                            ]),
                            $('div', {className: 'column col-6 col-sm-12 form-group', style: {overflow: 'auto'}}, [
                                $('table', {className: 'table table-striped table-scroll'}, [
                                    $('thead', null, [
                                        $('tr', null, [
                                            $('th', null, '#'),
                                            $('th', null, 'Kategori'),
                                            $('th', null, 'Harga'),
                                            $('th', null, 'Kapasitas'),
                                            $('th', null, 'Terjual'),
                                            $('th', null, 'Tersisa'),
                                            $('th', null, 'Pemasukan'),
                                            $('th', null, 'Persentase')
                                        ])
                                    ]),
                                    $('tbody', null, [
                                        ...info.categories.map((cat, i) => {
                                            return $('tr', null, [
                                                $('td', null, i + 1),
                                                $('td', null, cat.name),
                                                $('td', null, idr(cat.price)),
                                                $('td', null, cat.capacity),
                                                $('td', null, this.state.info.tickets_sold[cat.category_id] + ' dari ' + cat.capacity),
                                                $('td', null, this.state.info.tickets_available[cat.category_id]),
                                                $('td', null, idr(this.state.info.tickets_revenue[cat.category_id])),
                                                $('td', null, this.state.info.percentages[cat.category_id] + '%')
                                            ]);
                                        }),
                                        $('tr', null, [
                                            $('th', {colSpan: 3}, 'TOTAL'),
                                            $('th', null, this.state.info.capacity_total),
                                            $('th', null, this.state.info.tickets_sold_total),
                                            $('th', null, this.state.info.tickets_available_total),
                                            $('th', null, this.state.info.tickets_revenue_total),
                                            $('th', null, this.state.info.percentages_total + '%')
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ])
                ])
        ];
    }

    initializeChart() {
        const info = this.state.info;
        const randColor = () => {
            const red = Math.floor(Math.random() * 224);
            const green = Math.floor(Math.random() * 224);
            const blue = Math.floor(Math.random() * 224);
            return [red, green, blue];
        };
        const parseColor = (color, alpha) => {
            return 'rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', ' + alpha + ')';
        };

        const soldColor = randColor();
        const targetColor = randColor();

        const ctx = document.getElementById('__sales').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: info.categories.map(cat => cat.name),
                datasets: [
                    {
                        label: 'Target',
                        data: info.categories.map(cat => cat.capacity),
                        backgroundColor: parseColor(targetColor, 0.5),
                        borderColor: parseColor(targetColor, 1.0),
                        borderWidth: 1
                    },
                    {
                        label: 'Tiket terjual',
                        data: info.categories.map(cat => info.tickets_sold[cat.category_id]),
                        backgroundColor: parseColor(soldColor, 0.5),
                        borderColor: parseColor(soldColor, 1.0),
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: false,
                scales: {
                    yAxes: [{
                        ticks: {beginAtZero: true}
                    }]
                }
            }
        });
    }

}

