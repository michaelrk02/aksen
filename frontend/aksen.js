import React from 'react';

import * as RPC from './aksen/rpc.js';
import * as Loading from './aksen/loading.js';
import * as Modal from './aksen/modal.js';

import Header from './aksen/Header.js';
import Footer from './aksen/Footer.js';
import Sidebar from './aksen/Sidebar.js';
import RequiredField from './aksen/RequiredField.js';

export {RPC, Loading, Modal, Header, Footer, Sidebar, RequiredField};

window.$ = React.createElement;

