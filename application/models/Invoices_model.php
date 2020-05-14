<?php

class Invoices_model extends CI_Model {

    public function __construct() {
        $this->load->database();
    }

    public function create_invoice($email, $order_details, $category_id, $tickets) {
        $this->load->helper('string');
        $this->load->model('config_model');

        $order_id = $this->config_model->get('order.next_id');
        $order_id = (int)$order_id;
        $this->config_model->set('order.next_id', ($order_id + 1) % 1000);

        $expire = $this->config_model->get('order.expire');
        $expire = $expire === NULL ? 24 : $expire;
        $expire = $expire * 86400;
        $expire = (int)$expire;

        $invoice_id = '';
        do {
            $invoice_id = random_string('alnum', 16);
        } while ($this->exists($invoice_id));

        $this->db->query(
            'INSERT INTO `invoices`
                (`invoice_id`, `email`, `order_details`, `category_id`, `tickets`, `order_time`, `order_id`, `expire_time`)
                VALUES (?, ?, ?, ?, ?, NOW(), ?, ADDTIME(NOW(), SEC_TO_TIME(?)))',
            [$invoice_id, $email, $order_details, $category_id, $tickets, $order_id, $expire]);

        return $invoice_id;
    }

    public function exists($invoice_id) {
        $result = $this->db->query('SELECT COUNT(*) AS `count` FROM `invoices` WHERE `invoice_id` = ?', [$invoice_id]);
        return $result->row_array(0)['count'] != 0;
    }

    public function get($invoice_id, $columns = '*') {
        $result = $this->db->select($columns)->from('invoices')->where('invoice_id', $invoice_id)->get();
        return $result->row_array(0);
    }

}

?>
