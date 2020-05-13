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

    public function GetTicketProperties() {
        $this->load->model('categories_model');

        $category_id = $this->rpc->param('category_id');
        if (!empty($category_id)) {
            $category = $this->categories_model->get($category_id, 'name,price');
            if (isset($category)) {
                $this->rpc->reply(['price' => $category['price'], 'category' => $category['name']]);
            } else {
                $this->rpc->error('kategori tiket tidak ditemukan', 404);
            }
        } else {
            $this->rpc->error();
        }
    }

    public function GetAvailableTickets() {
        $this->load->model('categories_model');

        $category_id = $this->rpc->param('category_id');
        if (!empty($category_id)) {
            $available = $this->categories_model->get_available($category_id);
            $this->rpc->reply($available);
        } else {
            $this->rpc->error();
        }
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
