import Response from './Response.js';

export default class Request {

    constructor(url, args = null, headers = null) {
        this.xhr = null;
        this.args = args;
        this.callback = null;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.responseType = 'json';
        if (headers != null) {
            for (let header in headers) {
                xhr.setRequestHeader(header, headers[header]);
            }
        }
        this.xhr.addEventListener('load', (() => {
            if (this.callback != null) {
                this.callback(new Response(this.xhr));
            }
        }).bind(this));
        this.xhr = xhr;
    }

    then(callback) {
        this.callback = callback;
        return this;
    }

    execute() {
        this.xhr.send(this.args);
        return this;
    }

    abort() {
        this.xhr.abort();
        return this;
    }

}

