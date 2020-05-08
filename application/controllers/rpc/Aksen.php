<?php

class Aksen extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->library('rpc');

        $this->rpc->init();
    }

    public function GetTicketCategories() {
        $this->load->model('categories_model');

        $categories = $this->categories_model->get_all('category_id,name,capacity,price', ['locked' => 0]);
        $this->rpc->reply($categories);
    }

    public function GetAvailableTickets() {
        $this->load->model('categories_model');

        $available = $this->categories_model->get_available($this->rpc->param('category_id'));
        $this->rpc->reply($available);
    }

    public function GetMaxTickets() {
        $this->load->model('config_model');

        $max_tickets = $this->config_model->get('order.max_tickets');
        $max_tickets = $max_tickets === NULL ? 5 : $max_tickets;
        $max_tickets = (int)$max_tickets;

        $this->rpc->reply($max_tickets);
    }

}

?>
