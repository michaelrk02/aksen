import {Component, createElement as $} from 'react';
import {authCheck} from './lib/auth-checker.js';
import {Icons, Loading, rpc, idr} from '../aksen.js';

import TicketProperties from './TicketProperties.js';

export default class ManageTickets extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            action: 'create',
            categoryID: '',
            properties: null
        };

        this.onUpdateClick = this.onUpdateClick.bind(this);
        this.onCreateClick = this.onCreateClick.bind(this);
        this.onPropertiesSubmit = this.onPropertiesSubmit.bind(this);
        this.onTicketDelete =this.onTicketDelete.bind(this);
    }

    fetchTickets() {
        rpc.admin.initiate('GetTicketCategories').then((res => {
            if (res.code == 200) {
                this.setState({data: res.value});
            } else {
                window.alert('Gagal mendapatkan list kategori tiket: ' + res.status + '. Mohon coba lagi');
            }
        }).bind(this)).execute();
    }

    componentDidMount() {
        authCheck(this, (res => {
            if (res.code == 200) {
                this.fetchTickets();
            }
        }).bind(this));
    }

    render() {
        return [
            $(Loading.Modal, {shown: this.state.data === null, description: 'Mendapatkan list kategori tiket ...'}),
            $('div', {className: 'columns'}, [
                $('div', {id: 'properties', className: 'column col-6 col-sm-12'}, [
                    $(TicketProperties, {action: this.state.action, data: this.state.properties, onSubmit: this.onPropertiesSubmit, onDelete: this.onTicketDelete})
                ]),
                $('div', {className: 'column col-6 col-sm-12'}, [
                    $('div', {className: 'popup'}, [
                        this.state.data !== null ?
                            $('table', {className: 'table table-hover table-scroll table-striped'}, [
                                $('thead', null, [
                                    $('tr', null, [
                                        $('th', null, 'Nama kategori'),
                                        $('th', null, 'ID kategori'),
                                        $('th', null, 'Harga'),
                                        $('th', null, 'Kapasitas'),
                                        $('th', null, 'Terkunci'),
                                        $('th', null, 'Tindakan')
                                    ])
                                ]),
                                $('tbody', null, [
                                    ...this.state.data.map((cat => {
                                        return $('tr', null, [
                                            $('td', null, cat.name),
                                            $('td', null, $('code', null, cat.category_id)),
                                            $('td', null, idr(cat.price)),
                                            $('td', null, cat.capacity),
                                            $('td', null, cat.locked == 1 ? $(Icons.Checked) : $(Icons.Unchecked)),
                                            $('td', null, [
                                                $('button', {'data-id': cat.category_id, className: 'btn btn-primary', onClick: this.onUpdateClick}, $('i', {className: 'icon icon-edit'}))
                                            ])
                                        ]);
                                    }).bind(this))
                                ])
                            ]) :
                            null,
                        $('div', {style: {marginTop: '1rem'}}, [
                            $('button', {className: 'btn btn-primary btn-block', onClick: this.onCreateClick}, ['Buat tiket ', $('i', {className: 'icon icon-plus'})])
                        ])
                    ])
                ])
            ])
        ];
    }

    onUpdateClick(e) {
        const id = e.currentTarget.getAttribute('data-id');
        const data = this.state.data.find(cat => cat.category_id === id);
        this.setState({action: 'update', properties: data});
        window.location.href = '#properties';
    }

    onCreateClick() {
        this.setState({action: 'create', properties: null});
        window.location.href = '#properties';
    }

    onPropertiesSubmit(res) {
        if (res.code == 200) {
            this.setState({action: 'create', properties: null});
            this.fetchTickets();
        }
    }

    onTicketDelete(res) {
        if (res.code == 200) {
            this.setState({action: 'create', properties: null});
            this.fetchTickets();
        }
    }

}

