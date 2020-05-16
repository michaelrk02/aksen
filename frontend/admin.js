import 'core-js/stable';

import {createElement as $} from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import {RPC, Header, Footer, initRPC, rpc} from './aksen.js';

import Dashboard from './admin/Dashboard.js';
import Auth from './admin/Auth.js';

window.baseURL = '/';

function closeSidebar() {
    const sidebar = document.getElementById('__sidebar');

    sidebar.classList.remove('active');
}

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

    const sidebarItems = [
        ['Dashboard', '/'],
        ['Kelola Tiket', '/manage-tickets'],
        ['Kelola Pembayaran', '/manage-invoices'],
        ['Kelola Pelanggan', '/manage-customers'],
        ['Check-in Pengunjung', '/check-in'],
        ['Layanan Pelanggan', '/customer-service'],
        ['Pengaturan Aplikasi', '/settings'],
        ['Keluar', '/logout']
    ];

    const router = $(Router, {basename: app.getAttribute('data-basename')}, [
        $('div', {className: 'off-canvas'}, [
            $('div', {id: '__sidebar', className: 'off-canvas-sidebar shadow-2', style: {width: '300px', padding: '0.5rem'}}, [
                $('button', {className: 'btn btn-clear float-right', onClick: closeSidebar}),
                $('div', {style: {padding: '0.5rem'}}, [
                    $('h5', null, 'ADMIN'),
                    $('div', null, 'E-ticketing AKSEN SMAGA')
                ]),
                $('ul', {className: 'nav'}, sidebarItems.map(item => $('li', {className: 'nav-item'}, $(Link, {to: item[1]}, item[0]))))
            ]),
            $('a', {className: 'off-canvas-overlay', href: '#!', onClick: closeSidebar}),
            $('div', {className: 'off-canvas-content'}, [
                $('div', {className: 'app-container'}, [
                    $('div', {className: 'app-content'}, [
                        $(Header, {subtitle: 'Admin Pemesanan Tiket Ajang Kreasi dan Seni SMAN 3 Surakarta', sidebar: '__sidebar'}),
                        $(Route, {exact: true, path: '/', component: Dashboard}),
                        $(Route, {exact: true, path: '/auth', component: Auth}),
                    ]),
                    $(Footer)
                ])
            ])
        ])
    ]);

    render(router, app);
});

