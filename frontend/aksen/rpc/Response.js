export default class Response {

    constructor(xhr) {
        this.xhr = xhr;
        this.code = xhr.status;
        this.status = xhr.statusText;
        this.value = xhr.response;

        if ((typeof(this.value) === 'object') && (this.value !== null)) {
            if (typeof(this.value.value) !== 'undefined') {
                this.value = this.value.value;
            }
        }
    }

}

