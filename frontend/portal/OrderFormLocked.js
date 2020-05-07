import {Component, createElement as $} from 'react';
import {Link} from 'react-router-dom';

export default class OrderFormLocked extends Component {

    constructor(/* form, duration */ props) {
        super(props);
        this.state = {
            timeLeft: this.props.duration
        };
        this.page = this.props.form;

        this.countdown = null;
    }

    componentDidMount() {
        this.countdown = window.setInterval((() => {
            if (this.state.timeLeft > 0) {
                this.setState({timeLeft: this.state.timeLeft - 1});
            } else {
                window.clearInterval(this.countdown);
                this.page.determineLock();
            }
        }).bind(this), 1000);
    }

    render() {
        const hours = Math.floor(this.state.timeLeft / 3600);
        const minutes = Math.floor(this.state.timeLeft / 60) % 60;
        const seconds = Math.floor(this.state.timeLeft) % 60;

        return $('div', {className: 'empty'}, [
            $('div', {className: 'empty-icon'}, $('i', {className: 'icon icon-stop icon-4x'})),
            $('p', {className: 'empty-title h5'}, 'Form terkunci sementara'),
            $('p', {className: 'empty-subtitle'}, 'Anda telah melakukan pemesanan beberapa waktu yang lalu. Silakan tunggu beberapa waktu lagi untuk dapat memesan. Anda diperbolehkan memesan lagi dalam:'),
            $('div', {className: 'empty-action'}, $('h5', {className: 'label'}, hours + ' jam ' + minutes + ' menit ' + seconds + ' detik'))
        ]);
    }

}

