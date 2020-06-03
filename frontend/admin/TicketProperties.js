import {Component, createElement as $} from 'react';
import {Loading, rpc} from '../aksen.js';

export default class TicketProperties extends Component {

    constructor(/* action, data, onSubmit, onDelete */ props) {
        super(props);
        this.state = {
            data: props.action === 'create' ? this.emptyData() : props.data,
            submitting: false
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onPriceChange = this.onPriceChange.bind(this);
        this.onCapacityChange = this.onCapacityChange.bind(this);
        this.onLockedChange = this.onLockedChange.bind(this);
    }

    emptyData() {
        return {
            category_id: '(otomatis)',
            name: '',
            price: 0,
            capacity: 0,
            locked: false
        };
    }

    updateData(field, value) {
        const data = Object.assign({}, this.state.data);
        data[field] = value;
        this.setState({data: data});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.data !== prevProps.data) {
            if (this.props.data !== null) {
                this.setState({data: this.props.data});
            } else {
                this.setState({data: this.emptyData()});
            }
        }
    }

    render() {
        const data = this.state.data;

        return $('div', {className: 'popup'}, [
            $('h5', null, (this.props.action === 'create' ? 'Membuat' : 'Memperbarui') + ' Tiket'),
            $('div', {className: 'form-horizontal'}, [
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'col-3 col-sm-12'}, 'ID kategori:'),
                    $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, [
                        $('input', {type: 'text', className: 'form-input', style: {fontFamily: 'monospace'}, readOnly: true, value: data.category_id})
                    ])
                ]),
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'col-3 col-sm-12'}, 'Nama kategori:'),
                    $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, [
                        $('input', {type: 'text', className: 'form-input', value: data.name, onChange: this.onNameChange})
                    ])
                ]),
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'col-3 col-sm-12'}, 'Harga:'),
                    $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, [
                        $('input', {type: 'number', min: 0, className: 'form-input', value: data.price, onChange: this.onPriceChange})
                    ])
                ]),
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'col-3 col-sm-12'}, 'Kapasitas:'),
                    $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, [
                        $('input', {type: 'number', min: 0, className: 'form-input', value: data.capacity, onChange: this.onCapacityChange})
                    ])
                ]),
                $('div', {className: 'form-group'}, [
                    $('div', {className: 'col-3 col-sm-12'}, 'Terkunci:'),
                    $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, [
                        $('label', {className: 'form-checkbox'}, [
                            $('input', {type: 'checkbox', checked: data.locked == 1, onChange: this.onLockedChange}),
                            $('i', {className: 'form-icon'})
                        ])
                    ])
                ])
            ]),
            $('div', {style: {marginTop: '1rem'}}, [
                $('button', {className: 'btn btn-success btn-block', disabled: this.state.submitting, onClick: this.onSubmit}, this.state.submitting ? $(Loading.Text, {description: 'Menigirim ...'}) : 'Kirim'),
                this.props.action === 'update' ?
                    $('button', {className: 'btn btn-error btn-block', onClick: this.onDelete}, ['Hapus ', $('i', {className: 'icon icon-delete'})]) :
                    null
            ])
        ]);
    }

    onSubmit() {
        if (window.confirm('Apakah anda yakin?')) {
            this.setState({submitting: true});
            if (this.props.action === 'create') {
                rpc.admin.initiate('CreateTicket', this.state.data).then((res => {
                    if (res.code == 200) {
                        window.alert('Berhasil membuat tiket: ' + this.state.data.name);
                    } else {
                        window.alert('Gagal membuat tiket: ' + res.status + '. Mohon coba lagi');
                    }
                    this.setState({submitting: false});

                    if (typeof(this.props.onSubmit) === 'function') {
                        this.props.onSubmit(res);
                    }
                }).bind(this)).execute();
            } else if (this.props.action === 'update') {
                rpc.admin.initiate('UpdateTicket', this.state.data).then((res => {
                    if (res.code == 200) {
                        window.alert('Berhasil memperbarui tiket: ' + this.state.data.name);
                    } else {
                        window.alert('Gagal memperbarui tiket: ' + res.status + '. Mohon coba lagi');
                    }
                    this.setState({submitting: false});

                    if (typeof(this.props.onSubmit) === 'function') {
                        this.props.onSubmit(res);
                    }
                }).bind(this)).execute();
            }
        }
    }

    onDelete() {
        rpc.admin.initiate('DeleteTicketAttempt', {
            category_id: this.state.data.category_id
        }).then((res => {
            if (res.code == 200) {
                if (window.confirm('Apakah anda yakin akan menghapus tiket ' + this.state.data.name + '?')) {
                    rpc.admin.initiate('DeleteTicket', {
                        category_id: this.state.data.category_id
                    }).then((res => {
                        if (res.code == 200) {
                            window.alert('Tiket ' + this.state.data.name + ' berhasil dihapus');
                        } else {
                            window.alert('Gagal menghapus tiket: ' + res.status + '. Mohon coba lagi');
                        }

                        if (typeof(this.props.onDelete) === 'function') {
                            this.props.onDelete(res);
                        }
                    }).bind(this)).execute();
                }
            } else {
                window.alert('Tidak dapat menghapus tiket: ' + res.status);
            }
        }).bind(this)).execute();
    }

    onNameChange(e) {
        this.updateData('name', e.target.value);
    }

    onPriceChange(e) {
        this.updateData('price', parseInt(e.target.value));
    }

    onCapacityChange(e) {
        this.updateData('capacity', parseInt(e.target.value));
    }

    onLockedChange(e) {
        this.updateData('locked', e.target.checked);
    }

}

