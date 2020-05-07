<?php

class Portal extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->library('rpc');

        $this->rpc->init();
    }

    public function GetLockDuration() {
        $this->rpc->reply(3 * 60 * 60);
    }

    public function SendOrderRequest() {
        $email = $this->rpc->param('email');
        $order_details = $this->rpc->param('orderDetails');
        $category_id = $this->rpc->param('categoryID');
        $tickets = $this->rpc->param('tickets');

        if ($tickets > 0) {
            $this->rpc->reply();
        } else {
            $this->rpc->error('tiket tidak boleh 0!');
        }
    }

}

?>
