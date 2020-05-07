<?php

class Config_model extends CI_Model {

    public function __construct() {
        $this->load->database();
    }

    public function get($key) {
        $result = $this->db->query('SELECT `value` FROM `config` WHERE `key` = ?', [$key]);
        if ($result->num_rows() != 0) {
            return $result->row_array(0)['value'];
        }
        return NULL;
    }

    public function set($key, $value) {
        $this->db->query('UPDATE `config` SET `value` = ? WHERE `key` = ?', [$value, $key]);
    }

}

?>
