<?php

class Accesses_model extends CI_Model {

    public function __construct() {
        $this->load->database();
    }

    public function lock($ip_address) {
        $this->load->model('config_model');

        $id = md5($ip_address);
        $duration = (int)$this->config_model->get('order.cooldown');

        $result = $this->db->query('SELECT COUNT(*) AS `count` FROM `accesses` WHERE `ip_address` = ?', [$id]);
        if ($result->row_array(0)['count'] == 0) {
            $this->db->query('INSERT INTO `accesses` VALUES (?, ADDTIME(NOW(), SEC_TO_TIME(?)))', [$id, $duration]);
        } else {
            $this->db->query('UPDATE `accesses` SET `unlock_time` = ADDTIME(NOW(), SEC_TO_TIME(?)) WHERE `ip_address` = ?', [$duration, $id]);
        }
    }

    public function get_lock_duration($ip_address) {
        $id = md5($ip_address);

        $result = $this->db->query('SELECT TIME_TO_SEC(TIMEDIFF(`unlock_time`, NOW())) AS `diff` FROM `accesses` WHERE `ip_address` = ?', [$id]);
        if ($result->num_rows() != 0) {
            $diff = $result->row_array(0)['diff'];
            $diff = ($diff < 0) ? 0 : $diff;
            return $diff;
        }

        return 0;
    }

}

?>
