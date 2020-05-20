<?php

class Admin extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->library(['rpc', 'authenticator']);

        $this->rpc->init();
    }

    public function Authenticate() {
        if (!empty(SERVER_SECRET)) {
            $this->load->model('config_model');

            $password = $this->rpc->param('password');
            $valid = $this->config_model->get('admin.password');
            if (!empty($valid)) {
                if (password_verify($password, $valid)) {
                    $payload = ['issued_at' => time()];
                    $payload = base64_encode(json_encode($payload));
                    $signature = sha1($payload.'.'.SERVER_SECRET);
                    $token = $payload.'.'.$signature;
                    $this->rpc->reply($token);
                } else {
                    $this->rpc->error('password yang anda masukkan tidak valid', 401);
                }
            } else {
                $this->rpc->error('anda tidak dapat mengakses situs admin untuk sekarang ini. Mohon hubungi panitia', 500);
            }
        } else {
            $this->rpc->error('SERVER_SECRET tidak terdefinisi. Mohon hubungi panitia', 500);
        }
    }

    public function AuthCheck() {
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

    public function GetTicketCategories() {
        $this->authenticator->check();

        $this->load->model('categories_model');

        $categories = $this->categories_model->get_all();
        $this->rpc->reply($categories);
    }

}

?>
