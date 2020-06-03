<?php

class Categories_model extends CI_Model {

    public function __construct() {
        $this->load->database();
    }

    public function create_ticket($data) {
        $this->load->helper('string');

        $category_id = '';
        do {
            $category_id = random_string('alnum', 8);
        } while ($this->exists($category_id));

        $data['category_id'] = $category_id;
        $data['locked'] = $data['locked'] ? 1 : 0;

        $this->db->insert('categories', $data);
    }

    public function update_ticket($category_id, $data) {
        $data['locked'] = $data['locked'] ? 1 : 0;

        $this->db->where('category_id', $category_id);
        $this->db->update('categories', $data);
    }

    public function is_used($category_id) {
        $invoices = $this->db->query('SELECT COUNT(*) AS `count` FROM `invoices` WHERE `category_id` = ?', [$category_id])->row_array(0)['count'] > 0;
        $customers = $this->db->query('SELECT COUNT(*) AS `count` FROM `customers` WHERE `category_id` = ?', [$category_id])->row_array(0)['count'] > 0;
        return $invoices || $customers;
    }

    public function delete($category_id) {
        $this->db->where('category_id', $category_id);
        $this->db->delete('categories');
    }

    public function exists($category_id) {
        $result = $this->db->query('SELECT COUNT(*) AS `count` FROM `categories` WHERE `category_id` = ?', [$category_id]);
        return $result->row_array(0)['count'] != 0;
    }

    public function get($category_id, $columns = '*') {
        return $this->db->select($columns)->from('categories')->where('category_id', $category_id)->get()->row_array(0);
    }

    public function get_available($category_id) {
        $result = $this->db->query('SELECT (SELECT `capacity` FROM `categories` WHERE `category_id` = ?) - (SELECT IFNULL((SELECT SUM(`tickets`) FROM `customers` WHERE `category_id` = ?), 0)) AS `available`', [$category_id, $category_id]);
        if ($result->num_rows() != 0) {
            return $result->row_array(0)['available'];
        }
        return 0;
    }

    public function get_all($columns = '*', $conditions = NULL) {
        $this->db->select($columns)->from('categories');
        if (isset($conditions)) {
            $this->db->where($conditions);
        }
        $this->db->order_by('name');

        return $this->db->get()->result_array();
    }

}

?>
