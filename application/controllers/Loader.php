<?php

class Loader extends CI_Controller {

    public function load() {
        $file = $_GET['file'];
        $type = $_GET['type'];
        $cached = !empty($_GET['cached']);

        $path = FCPATH.$file;
        if (file_exists($path)) {
            $contents = file_get_contents($path);
            $this->output->set_status_header(200);
            $this->output->set_content_type($type);
            if ($cached) {
                $this->output->set_header('Cache-Control: max-age=86400');
            }
            $this->output->set_output($contents);
        } else {
            $this->output->set_status_header(404);
        }
    }

}

?>
