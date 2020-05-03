<?php

class Portal extends CI_Controller {

    public function index() {
        $this->load->helper('url');

        $data['route_basename'] = parse_url(site_url('portal'), PHP_URL_PATH);

        $this->load->view('portal', $data);
    }

}

?>
