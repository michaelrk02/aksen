<?php

class Authenticator {

    private $CI;
    private $valid;

    public function __construct() {
        $this->CI =& get_instance();

        $this->CI->load->model('config_model');
        $this->valid = $this->CI->config_model->get('admin.password');
    }

    public function check() {
        $token = $this->CI->input->get_request_header('X-AKSEN-AuthToken');
        if (!empty($token)) {
            if (!empty($this->valid)) {
                $password = base64_decode($token);
                if (!password_verify($password, $this->valid)) {
                    $this->CI->rpc->error('kata sandi untuk autentikasi tidak valid', 401);
                    exit();
                }
            } else {
                $this->CI->rpc->error('password untuk autentikasi tidak tersedia', 500);
                exit();
            }
        } else {
            $this->CI->rpc->error();
            exit();
        }
    }

}

?>
