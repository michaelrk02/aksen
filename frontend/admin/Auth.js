import {Component, createElement as $} from 'react';
import {Loading, rpc} from '../aksen.js';
import {authCheck} from './lib/auth-checker.js';

export default class Auth extends Component {

    constructor(props) {
        super(props);
        this.state = {
            verifying: false
        };

        this.onAuthenticate = this.onAuthenticate.bind(this);
    }

    componentDidMount() {
        if (window.sessionStorage.getItem('aksen.admin_auth') !== null) {
            this.props.history.replace('/');
        }
    }

    render() {
        const location = this.props.location;
        const redirect = (typeof(location.state) === 'object' && typeof(location.state.redirect) === 'string' && location.state.redirect !== '/auth') ? location.state.redirect : '/';

        return $('div', {className: 'container grid-md'}, [
            $('div', {className: 'popup'}, [
                $('h5', {className: 'text-bold text-primary'}, 'Silakan login terlebih dahulu'),
                $('p', null, ['Masukkan kata sandi untuk mengakses ', $('b', null, redirect)]),
                $('div', {className: 'form-horizontal'}, [
                    $('div', {className: 'form-group'}, [
                        $('div', {className: 'col-3 col-sm-12'}, $('label', {className: 'form-label'}, 'Kata sandi:')),
                        $('div', {className: 'col-9 col-sm-12', style: {margin: 'auto 0px'}}, [
                            $('div', {className: 'input-group'}, [
                                $('span', {className: 'input-group-addon'}, $('i', {className: 'icon icon-people'})),
                                $('input', {id: '__password', type: 'password', className: 'form-input', placeholder: 'Masukkan kata sandi'})
                            ])
                        ])
                    ])
                ]),
                $('div', {className: 'columns', style: {marginTop: '2rem'}}, [
                    $('div', {className: 'column col-12'},
                        $('button', {className: 'btn btn-success btn-block', onClick: this.onAuthenticate, disabled: this.state.verifying},
                            this.state.verifying ?
                                $(Loading.Text, {description: 'Mem-verifikasi ...'}) :
                                ['Masuk ', $('i', {className: 'icon icon-arrow-right'})]
                        )
                    )
                ])
            ])
        ]);
    }

    onAuthenticate() {
        const element = document.getElementById('__password');
        const password = element.value;
        element.value = '';

        if (password === '') {
            window.alert('Harap mengisi kata sandi');
        } else {
            this.setState({verifying: true});
            rpc.admin.setPermanentHeader('X-AKSEN-AuthToken', window.btoa(password));
            authCheck(this, (res => {
                if (res.code == 200) {
                    window.sessionStorage.setItem('aksen.auth_token', window.btoa(password));
                }
                this.setState({verifying: false});
            }).bind(this));
        }
    }

}

