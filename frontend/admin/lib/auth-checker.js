import {rpc} from '../../aksen.js';

function authCheck(component, callback) {
    const location = component.props.location;
    if (rpc.admin.getPermanentHeader('X-AKSEN-AdminAuthToken') === null) {
        component.props.history.replace('/auth', {redirect: component.props.location.pathname});
    } else {
        rpc.admin.initiate('AuthCheck').then((res => {
            if (res.code != 200) {
                window.alert('Gagal melakukan otentikasi: ' + res.status + '. Mohon coba lagi');
                rpc.admin.removePermanentHeader('X-AKSEN-AuthToken');
                component.props.history.replace('/auth', {redirect: location.pathname});
            }
            if (typeof(callback) === 'function') {
                callback(res);
            }
        }).bind(this)).execute();
    }
}

export {authCheck};
