<?php

class Aksen extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->library('rpc');

        $this->rpc->init();
    }

    public function GetTicketCategories() {
        $categories = [
            ['id' => 'CAT000', 'name' => 'Presale 1', 'price' => 25000],
            ['id' => 'CAT001', 'name' => 'Presale 2', 'price' => 40000],
            ['id' => 'CAT002', 'name' => 'Presale 3', 'price' => 55000]
        ];

        $this->rpc->reply($categories);
    }

    public function GetAvailableTickets() {
        $available = 0;

        $category_id = $this->rpc->param('categoryID');
        if ($category_id === 'CAT000') {
            $available = 100;
        }
        if ($category_id === 'CAT001') {
            $available = 200;
        }
        if ($category_id === 'CAT002') {
            $available = 150;
        }

        $this->rpc->reply($available);
    }

    public function GetMaxTickets() {
        $this->rpc->reply(5);
    }

}

?>
