import 'core-js/stable';

import {createElement as $} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {RPC, Header, Footer, initRPC} from './aksen.js';

import Landing from './portal/Landing.js';
import Order from './portal/Order.js';
import OrderForm from './portal/OrderForm.js';
import OrderInvoice from './portal/OrderInvoice.js';
import OrderInvoiceView from './portal/OrderInvoiceView.js';
import OrderTickets from './portal/OrderTickets.js';
import OrderTicketsView from './portal/OrderTicketsView.js';

window.baseURL = '/';

window.addEventListener('load', () => {
    const body = document.getElementById('body');
    body.className = 'bg-gray';

    const app = document.getElementById('app');
    window.baseURL = app.getAttribute('data-baseurl');
    initRPC(app.getAttribute('data-rpc'));

    const router = $(Router, {basename: app.getAttribute('data-basename')}, [
        $('div', {className: 'app-container'}, [
            $('div', {className: 'app-content'}, [
                $(Header, {subtitle: 'Portal Pemesanan Tiket Ajang Kreasi dan Seni SMAN 3 Surakarta'}),
                $(Route, {exact: true, path: '/', component: Landing}),
                $(Route, {exact: true, path: '/order', component: Order}),
                $(Route, {exact: true, path: '/order/form', component: OrderForm}),
                $(Route, {exact: true, path: '/order/invoice', component: OrderInvoice}),
                $(Route, {exact: true, path: '/order/invoice/view', component: OrderInvoiceView}),
                $(Route, {exact: true, path: '/order/tickets', component: OrderTickets}),
                $(Route, {exact: true, path: '/order/tickets/view', component: OrderTicketsView})
            ]),
            $(Footer)
        ]),
    ]);

    ReactDOM.render(router, app);
});

