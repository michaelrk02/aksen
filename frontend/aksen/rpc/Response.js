export default class Response {

    constructor(xhr) {
        this.xhr = xhr;
        this.code = xhr.status;
        this.status = xhr.statusText;
        this.body = xhr.response;
    }

}

