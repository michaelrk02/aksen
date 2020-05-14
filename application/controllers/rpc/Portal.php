<?php

class Portal extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->library('rpc');

        $this->rpc->init();
    }

    public function GetContactPersons() {
        $this->load->model('config_model');

        $cp = $this->config_model->get('info.contact_persons');
        if (!empty($cp)) {
            $cp = explode(',', $cp);
            $cp_list = [];
            foreach ($cp as $cp_item) {
                $cp_item = explode(':', $cp_item);
                $cp_list[] = ['name' => $cp_item[0], 'phoneNumber' => $cp_item[1]];
            }

            return $this->rpc->reply($cp_list);
        }

        return $this->rpc->error('contact person tidak tersedia', 404);
    }

    public function GetLockDuration() {
        $this->load->model('accesses_model');

        $this->rpc->reply($this->accesses_model->get_lock_duration($this->input->ip_address()));
    }

    public function SendOrderRequest() {
        $this->load->model('accesses_model');

        if ($this->accesses_model->get_lock_duration($this->input->ip_address()) == 0) {
            $this->load->model('categories_model');

            $category_id = $this->rpc->param('category_id');
            $category = $this->categories_model->get($category_id, 'name,price');
            if (isset($category)) {
                $this->load->helper('string');
                $this->load->library('form_validation');
                $this->load->model('config_model');

                $available = $this->categories_model->get_available($category_id);
                $max_tickets = $this->config_model->get('order.max_tickets');
                $max_tickets = $max_tickets === NULL ? 5 : $max_tickets;
                $max_tickets = $available > $max_tickets ? $max_tickets : $available;

                $this->form_validation->set_rules('email', 'e-mail', 'required|valid_email|max_length[254]');
                $this->form_validation->set_rules('order_details', 'order details', 'max_length[200]');
                $this->form_validation->set_rules('tickets', 'tickets', 'greater_than[0]|less_than_equal_to['.$max_tickets.']');

                if ($this->form_validation->run() === TRUE) {
                    $this->load->library(['email_messages', 'mailer']);
                    $this->load->model('invoices_model');

                    $this->accesses_model->lock($this->input->ip_address());

                    $tickets = $this->rpc->param('tickets');
                    $email = $this->rpc->param('email');
                    $order_details = $this->rpc->param('order_details');
                    $invoice_id = $this->invoices_model->create_invoice($email, $order_details, $category_id, $tickets);

                    $invoice = $this->invoices_model->get($invoice_id, 'invoice_id,email,order_details,tickets,order_time,order_id,expire_time');
                    $invoice['category'] = $category;
                    if ($this->mailer->mail($email, 'Tagihan Pembayaran E-tiket AKSEN SMAGA', $this->email_messages->invoice($invoice)) === TRUE) {
                        $this->rpc->reply($invoice_id);
                    } else {
                        $this->rpc->error('terjadi kesalahan pada server saat mengirimkan e-mail, mohon segera hubungi panitia', 500);
                    }
                } else {
                    $this->rpc->error(str_replace("\n", ';', strip_tags(validation_errors())));
                }
            } else {
                $this->rpc->error('kategori tiket yang anda pesan tidak ditemukan');
            }
        } else {
            $this->rpc->error('form pemesanan untuk anda masih dikunci');
        }
    }

    public function GetInvoiceDetails() {
        $invoice_id = $this->rpc->param('invoice_id');

        if (!empty($invoice_id)) {
            $this->load->model('invoices_model');

            $invoice = $this->invoices_model->get($invoice_id, 'email,order_details,category_id,tickets,order_time,order_id,expire_time');
            if (isset($invoice)) {
                $expire_time = new DateTime($invoice['expire_time']);
                $expire_time = $expire_time->getTimestamp();
                $now = time();
                $invoice['expire_duration'] = $expire_time - $now;

                $this->rpc->reply($invoice);
            } else {
                $this->rpc->error('tagihan tidak ditemukan', 404);
            }
        } else {
            $this->rpc->error();
        }
    }

    public function GetPaymentMethods() {
        $this->load->model('config_model');

        $payment_methods = $this->config_model->get('payment.methods');
        if (!empty($payment_methods)) {
            $payment_methods = explode(',', $payment_methods);

            $this->rpc->reply($payment_methods);
        } else {
            $this->rpc->error('', 404);
        }
    }

}

?>
