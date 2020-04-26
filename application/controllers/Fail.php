<?php

class Fail extends CI_Controller {

    public function forbidden() {
        $this->load->helper('url');

        show_error('Anda tidak diperbolehkan mengakses laman ini secara langsung. Silakan mengikuti prosedur dari awal. ('.anchor('', 'Kembali ke homepage').')', 403, 'Akses Ditolak');
    }

}

?>
