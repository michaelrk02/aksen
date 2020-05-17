<?php

class Categories_model extends CI_Model {

    public function __construct() {
        $this->load->database();
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
