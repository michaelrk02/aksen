import {rpc} from '../../aksen.js';

function authCheck(component, callback) {
    const location = component.props.location;
    if (rpc.admin.getPermanentHeader('X-AKSEN-AuthToken') === null) {
        component.props.history.replace('/auth', {redirect: component.props.location.pathname});
    } else {
        rpc.admin.initiate('Authenticate').then((res => {
            if (res.code == 200) {
                const redirect = (typeof(location.state) === 'object' && typeof(location.state.redirect) === 'string' && location.state.redirect !== location.pathname) ? location.state.redirect : '/';
                if (location.pathname === '/auth') {
                    window.alert('Selamat datang, admin!');
                    component.props.history.replace(redirect);
                }
            } else {
                if (res.code == 401) {
                    if (location.pathname === '/auth') {
                        window.alert('Kata sandi yang anda masukkan tidak valid');
                    } else {
                        window.alert('Anda tidak diijinkan untuk mengakses laman ini. Silakan login terlebih dahulu');
                    }
                } else {
                    window.alert('Gagal melakukan otentikasi: ' + res.status + '. Mohon coba lagi');
                }
                rpc.admin.removePermanentHeader('X-AKSEN-AuthToken');
                if (location.pathname !== 'auth') {
                    component.props.history.replace('/auth', {redirect: location.pathname});
                }
            }
            if (typeof(callback) === 'function') {
                callback(res);
            }
        }).bind(this)).execute();
    }
}

export {authCheck};
