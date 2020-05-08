<?php

class Invoices_model extends CI_Model {

    public function __construct() {
        $this->load->database();
    }

    public function create_invoice($email, $order_details, $category_id, $tickets) {
        $this->load->helper('string');
        $this->load->model('config_model');

        $invoice_id = '';
        do {
            $invoice_id = random_string('alnum', 16);
        } while ($this->exists($invoice_id));

        $expire = $this->config_model->get('order.expire');
        $expire = $expire === NULL ? 24 : $expire;
        $expire = $expire * 3600;
        $expire = (int)$expire;

        $this->db->query(
            'INSERT INTO `invoices`
                (`invoice_id`, `email`, `order_details`, `category_id`, `tickets`, `order_time`, `expire_time`)
                VALUES (?, ?, ?, ?, ?, NOW(), ADDTIME(NOW(), SEC_TO_TIME(?)))',
            [$invoice_id, $email, $order_details, $category_id, $tickets, $expire]);
    }

    public function exists($invoice_id) {
        $result = $this->db->query('SELECT COUNT(*) AS `count` FROM `invoices` WHERE `invoice_id` = ?', [$invoice_id]);
        return $result->row_array(0)['count'] != 0;
    }

}

?>
