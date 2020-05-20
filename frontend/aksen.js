import * as RPC from './aksen/rpc.js';
import * as Loading from './aksen/loading.js';
import * as Modal from './aksen/modal.js';
import * as Icons from './aksen/icons.js';

import Header from './aksen/Header.js';
import Footer from './aksen/Footer.js';
import RequiredField from './aksen/RequiredField.js';

const rpc = {
    aksen: null,
    portal: null,
    admin: null
};

function initRPC(rpcURL) {
    rpc.aksen = new RPC.Channel(rpcURL + 'aksen/');
    rpc.portal = new RPC.Channel(rpcURL + 'portal/');
    rpc.admin = new RPC.Channel(rpcURL + 'admin/');
}

const idCurrencyFormat = new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'});

function idr(number) {
    return idCurrencyFormat.format(parseInt(number));
}

export {RPC, Loading, Modal, Icons, Header, Footer, RequiredField, initRPC, rpc, idr};

