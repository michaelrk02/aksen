<?php

class Authenticator {

    private $CI;

    public $payload;

    public function __construct() {
        $this->CI =& get_instance();
    }

    public function check() {
        $token = $this->CI->input->get_request_header('X-AKSEN-AdminAuthToken');
        if (!empty($token)) {
            if (!empty(SERVER_SECRET)) {
                $token = explode('.', $token);
                if (count($token) == 2) {
                    $payload = $token[0];
                    $signature = $token[1];
                    if ($signature === sha1($payload.'.'.SERVER_SECRET)) {
                        $payload = json_decode(base64_decode($payload), TRUE);
                        if (time() <= $payload['issued_at'] + 86400) {
                            $this->payload = $payload;
                        } else {
                            $this->CI->rpc->error('sesi anda sudah berakhir. Silakan login lagi', 401);
                            exit();
                        }
                    } else {
                        $this->CI->rpc->error('tanda tangan digital untuk token autentikasi tidak cocok!', 401);
                        exit();
                    }
                } else {
                    $this->CI->rpc->error('token autentikasi tidak valid');
                    exit();
                }
            } else {
                $this->CI->rpc->error('SERVER_SECRET tidak terdefinisi. Mohon hubungi panitia', 500);
                exit();
            }
        } else {
            $this->CI->rpc->error('anda harus login dahulu', 401);
            exit();
        }
    }

}

?>
