import 'core-js/stable';

import './stylesheet.scss';

import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Header, Footer} from './aksen.js';

import Landing from './portal/Landing.js';
import Order from './portal/Order.js';
import OrderForm from './portal/OrderForm.js';
import OrderInvoice from './portal/OrderInvoice.js';
import OrderTicket from './portal/OrderTicket.js';

window.addEventListener('load', () => {
    const body = document.getElementById('body');
    body.className = 'bg-gray';

    const app = document.getElementById('app');
    const router = $(Router, {basename: app.getAttribute('data-url')}, [
        $('div', {className: 'app-container'}, [
            $('div', {className: 'app-content'}, [
                $(Header, {subtitle: 'Portal Pemesanan Tiket Ajang Kreasi dan Seni SMAN 3 Surakarta'}),
                $(Route, {exact: true, path: '/', component: Landing}),
                $(Route, {exact: true, path: '/order', component: Order}),
                $(Route, {exact: true, path: '/order/form', component: OrderForm}),
                $(Route, {exact: true, path: '/order/invoice', component: OrderInvoice}),
                $(Route, {exact: true, path: '/order/ticket', component: OrderTicket})
            ]),
            $(Footer)
        ]),
    ]);

    ReactDOM.render(router, app);
});

