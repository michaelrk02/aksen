import 'core-js/stable';

import {createElement as $} from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {RPC, Header, Footer, initRPC, rpc} from './aksen.js';

import Dashboard from './admin/Dashboard.js';
import Auth from './admin/Auth.js';

window.baseURL = '/';

window.addEventListener('load', () => {
    const body = document.getElementById('body');
    body.className = 'bg-gray';

    const app = document.getElementById('app');
    window.baseURL = app.getAttribute('data-baseurl');
    initRPC(app.getAttribute('data-rpc'));

    const authToken = window.sessionStorage.getItem('aksen.auth_token');
    if (authToken !== null) {
        rpc.admin.setPermanentHeader('X-AKSEN-AuthToken', authToken);
    }

    const router = $(Router, {basename: app.getAttribute('data-basename')}, [
        $('div', {className: 'app-container'}, [
            $('div', {className: 'app-content'}, [
                $(Header, {subtitle: 'Admin Pemesanan Tiket Ajang Kreasi dan Seni SMAN 3 Surakarta'}),
                $(Route, {exact: true, path: '/', component: Dashboard}),
                $(Route, {exact: true, path: '/auth', component: Auth}),
            ]),
            $(Footer)
        ]),
    ]);

    render(router, app);
});

