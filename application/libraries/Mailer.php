<?php

class Mailer {

    private $CI;
    private $protocol;
    private $from_address;
    private $from_name;

    public function __construct() {
        $this->CI =& get_instance();

        $this->CI->load->model('config_model');

        $this->protocol = $this->CI->config_model->get('email.protocol');
        $this->protocol = !empty($this->protocol) ? $this->protocol : 'disabled';

        if ($this->protocol !== 'disabled') {
            $this->CI->load->helper('url');
            $this->CI->load->library('email');

            $domain = parse_url(base_url(), PHP_URL_HOST);

            $this->from_address = $this->CI->config_model->get('email.from.address');
            $this->from_address = !empty($this->from_address) ? $this->from_address : 'noreply@'.$domain;

            $this->from_name = $this->CI->config_model->get('email.from.name');
            $this->from_name = !empty($this->from_name) ? $this->from_name : $domain;

            $config = [];
            $config['protocol'] = $this->protocol;
            $config['mailtype'] = 'html';
            $config['charset'] = 'iso-8859-1';
            $config['crlf'] = "\r\n";
            $config['newline'] = "\r\n";
            $config['validate'] = TRUE;

            if ($this->protocol === 'smtp') {
                $config['smtp_host'] = $this->CI->config_model->get('email.smtp.host');
                $config['smtp_user'] = base64_decode($this->CI->config_model->get('email.smtp.user'));
                $config['smtp_pass'] = base64_decode($this->CI->config_model->get('email.smtp.pass'));
                $config['smtp_port'] = $this->CI->config_model->get('email.smtp.port');
            }

            $this->CI->email->initialize($config);
        }
    }

    public function mail($email, $subject, $message, $attachment = NULL) {
        $this->CI->load->helper('url');

        $str = '';

        $str .= '<html>';
        $str .= ' <div>';
        $str .= '  <h5>'.$subject.'</h5>';
        $str .= ' </div>';
        $str .= ' <div style="margin: 1rem">'.$message.'</div>';
        $str .= ' <div>';
        $str .= '  <div>Homepage: <a href="'.site_url().'" target="_blank">'.$this->from_name.'</a></div>';
        $str .= ' </div>';
        $str .= '</html>';

        $this->CI->email->from($this->from_address, $this->from_name);
        $this->CI->email->to($email);
        $this->CI->email->subject($subject);
        $this->CI->email->message($str);

        if (isset($attachment)) {
            $path = $attachment['path'];
            $name = isset($attachment['name']) ? $attachment['name'] : NULL;
            $mime = isset($attachment['mime']) ? $attachment['mime'] : '';
            $this->CI->email->attach($path, '', $name, $mime);
        }

        return $this->CI->email->send();
    }

}

?>
