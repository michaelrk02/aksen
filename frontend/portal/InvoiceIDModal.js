import {createElement as $} from 'react';
import {Modal} from '../aksen.js';

export default class InvoiceIDModal extends Modal.Window {

    constructor(props) {
        super(props);
    }

    _getHeader() {
        return [
            $('button', {className: 'btn btn-clear float-right', onClick: this.onCloseClick}),
            $('div', {className: 'modal-title h5'}, 'Kode tagihan anda')
        ];
    }

    _getBody() {
        return [
            $('p', null, 'Berikut adalah kode tagihan anda. Anda dapat menyalin kode berikut dan menyimpan ke memo rahasia anda jika anda tidak segera mendapatkan notifikasi e-mail tagihan dari kami.'),
            $('div', {className: 'form-group'}, [
                $('div', {className: 'input-group'}, [
                    $('span', {className: 'input-group-addon'}, $('i', {className: 'icon icon-link'})),
                    $('input', {id: '__invoiceID', type: 'text', className: 'form-input', readOnly: true, value: window.sessionStorage.getItem('aksen.access_invoice_id_history')}),
                ])
            ]),
            $('p', {className: 'text-bold'}, 'Kode tagihan tersebut tidak untuk dibagikan kepada siapapun yang tidak berhak! Hindari berbagai modus penipuan')
        ];
    }

    _getFooter() {
        return $('button', {className: 'btn btn-success btn-block', onClick: this.onCloseClick}, ['OK ', $('i', {className: 'icon icon-check'})]);
    }    

}
