<?php

class Rpc {

    private $CI;

    public function __construct() {
        $this->CI =& get_instance();
    }

    public function init() {
        $_POST = json_decode($this->CI->input->raw_input_stream, TRUE);
    }

    public function param($name) {
        return $this->CI->input->post($name);
    }

    public function reply($object = NULL) {
        $this->CI->output->set_status_header(200);
        if ($object !== NULL) {
            $this->CI->output->set_content_type('application/json');
            $this->CI->output->set_output(json_encode(['value' => $object]));
        }
    }

    public function error($message = 'kesalahan parameter', $code = 400) {
        $this->CI->output->set_status_header($code, $message);
    }

}

?>
