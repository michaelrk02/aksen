<?php

class Portal extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->library('rpc');

        $this->rpc->init();
    }

    public function GetLockDuration() {
        $this->load->model('accesses_model');

        $this->rpc->reply($this->accesses_model->get_lock_duration($this->input->ip_address()));
    }

    public function SendOrderRequest() {
        $this->load->model('accesses_model');

        if ($this->accesses_model->get_lock_duration($this->input->ip_address()) == 0) { 
            $email = $this->rpc->param('email');
            $order_details = $this->rpc->param('orderDetails');
            $category_id = $this->rpc->param('categoryID');
            $tickets = $this->rpc->param('tickets');

            if ($tickets > 0) {
                $this->accesses_model->lock($this->input->ip_address());
                $this->rpc->reply();
            } else {
                $this->rpc->error('tiket tidak boleh 0!');
            }
        } else {
            $this->rpc->error('form pemesanan untuk anda masih dikunci');
        }
    }

}

?>
