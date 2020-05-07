<?php

class Content extends CI_Controller {

    public function get($mime1, $mime2 = NULL) {
        $mime = $mime1;
        if (!empty($mime2)) {
            $mime .= '/'.$mime2;
        }

        $path = $this->input->get('path');
        if (!empty($path)) {
            if (file_exists($path)) {
                $this->output->set_status_header(200);
                $this->output->set_content_type($mime);
                $this->cache_check();
                $this->output->set_output(file_get_contents($path));
            } else {
                $this->output->set_status_header(404);
            }
        } else {
            $this->output->set_status_header(400);
        }
    }

    public function app($name) {
        $path = FCPATH.'public/'.$name.'.app.js';
        if (file_exists($path)) {
            $this->output->set_status_header(200);
            $this->output->set_content_type('text/javascript');
            $this->cache_check();
            $this->output->set_output(file_get_contents($path));
        } else {
            $this->output->set_status_header(404);
        }
    }

    private function cache_check() {
        $cache_age = $this->input->get('cache');
        if (!empty($cache_age)) {
            $this->output->set_header('Cache-Control: max-age='.$cache_age);
        }
    }

}

?>
