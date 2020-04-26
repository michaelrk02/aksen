import Request from './Request.js';

export default class Channel {

    constructor(address) {
        this.address = address;
        this.permanentHeaders = {};
    }

    setPermanentHeader(header, value) {
        this.permanentHeaders[header] = value;
    }

    initiate(method, args, headers) {
        if (typeof(headers) !== 'undefined') {
            for (let header of this.permanentHeaders) {
                headers[header] = this.permanentHeaders[header];
            }
        }

        return new Request(this.address + method, args, headers);
    }

}

