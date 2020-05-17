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

    public function GetDashboardInfo() {
        $this->authenticator->check();

        $this->load->database();
        $this->load->model('categories_model');

        $info = [];
        $info['categories'] = $this->categories_model->get_all();
        $info['invoices_active'] = $this->db->query('SELECT COUNT(*) AS `count` FROM `invoices` WHERE NOW() < `expire_time`')->row_array(0)['count'];
        $info['invoices_expired'] = $this->db->query('SELECT COUNT(*) AS `count` FROM `invoices` WHERE NOW() >= `expire_time`')->row_array(0)['count'];
        $info['invoices_kept'] = $this->db->query('SELECT COUNT(*) AS `count` FROM `invoices` WHERE `keep` = 1')->row_array(0)['count'];
        $info['customers'] = $this->db->query('SELECT COUNT(*) AS `count` FROM `customers`')->row_array(0)['count'];

        $info['percentages'] = [];
        $info['tickets_sold'] = [];
        $info['tickets_available'] = [];
        $info['tickets_revenue'] = [];
        $info['tickets_sold_total'] = 0;
        $info['tickets_available_total'] = 0;
        $info['tickets_revenue_total'] = 0;
        $info['capacity_total'] = 0;
        foreach ($info['categories'] as $category) {
            $sold = $this->db->query('SELECT IFNULL(SUM(`tickets`), 0) AS `count` FROM `customers` WHERE `category_id` = ?', [$category['category_id']])->row_array(0)['count'];
            $info['tickets_sold'][$category['category_id']] = $sold;
            $info['tickets_sold_total'] += $sold;
            $info['percentages'][$category['category_id']] = round($sold * 100.0 / $category['capacity'], 2);

            $available = $category['capacity'] - $sold;
            $info['tickets_available'][$category['category_id']] = $available;
            $info['tickets_available_total'] += $available;

            $revenue = $sold * $category['price'];
            $info['tickets_revenue'][$category['category_id']] = $revenue;
            $info['tickets_revenue_total'] += $revenue;

            $info['capacity_total'] += $category['capacity'];
        }
        $info['percentages_total'] = round($info['tickets_sold_total'] * 100.0 / $info['capacity_total'], 2);

        $this->rpc->reply($info);
    }

}

?>
