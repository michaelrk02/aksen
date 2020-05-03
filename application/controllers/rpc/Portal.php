<?php

class Portal extends CI_Controller {

    public function send_order_request() {
        $_POST = json_decode($this->input->raw_input_stream, TRUE);

        $email = $this->input->post('email');
        $order_details = $this->input->post('orderDetails');
        $category_id = $this->input->post('categoryID');
        $tickets = $this->input->post('tickets');

        if ($tickets > 0) {
            $this->output->set_status_header(200);
        } else {
            $this->output->set_status_header(400, 'tiket tidak boleh 0!');
        }
    }

}

?>
