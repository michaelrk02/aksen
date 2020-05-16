import Request from './Request.js';

export default class Channel {

    constructor(address) {
        this.address = address;
        this.permanentHeaders = {};
    }

    getPermanentHeader(header) {
        return typeof(this.permanentHeaders[header]) !== 'undefined' ? this.permanentHeaders[header] : null;
    }

    setPermanentHeader(header, value) {
        this.permanentHeaders[header] = value;
    }

    removePermanentHeader(header) {
        if (typeof(this.permanentHeaders[header]) !== 'undefined') {
            delete this.permanentHeaders[header];
        }
    }

    initiate(method, args, additionalHeaders) {
        const headers = {};
        Object.assign(headers, this.permanentHeaders);
        if (typeof(additionalHeaders) !== 'undefined') {
            Object.assign(headers, additionalHeaders);
        }

        return new Request(this.address + method, args, headers);
    }

}

