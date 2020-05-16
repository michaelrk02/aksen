<?php

class Admin extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->library(['rpc', 'authenticator']);

        $this->rpc->init();
    }

    public function Authenticate() {
        $this->authenticator->check();
    }

}

?>
