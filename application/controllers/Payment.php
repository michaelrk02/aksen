<?php

class Payment extends CI_Controller {

    private $amount;

    public function __construct() {
        parent::__construct();

        $this->load->helper('url');
        $this->load->model('config_model');

        $this->amount = isset($_GET['amount']) ? $_GET['amount'] : 0;
    }

    public function bank_transfer() {
        $bank_accounts = $this->config_model->get('payment.bank_accounts');
        $bank_accounts = $bank_accounts === NULL ? '' : $bank_accounts;
        $bank_accounts = explode(',', $bank_accounts);
        $accounts = [];
        foreach ($bank_accounts as $account) {
            $account = explode(':', $account);
            $accounts[] = ['name' => $account[0], 'vendor' => $account[1], 'number' => $account[2]];
        }

        $data = ['amount' => $this->amount, 'accounts' => $accounts];

        $this->load->view('payment/header');
        $this->load->view('payment/bank_transfer', $data);
        $this->load->view('payment/footer');
    }

    public function gopay() {
        show_404();
    }

    public function ovo() {
        show_404();
    }

    public function offline() {
        show_404();
    }

    public function partnership() {
        show_404();
    }

}

?>
