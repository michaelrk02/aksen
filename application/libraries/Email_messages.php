<?php

class Email_messages {

    private $CI;

    public function __construct() {
        $this->CI =& get_instance();
    }

    public function invoice($data) {
        $this->CI->load->helper('url');

        $str = '';

        $items = [
            ['E-mail', $data['email']],
            ['Keterangan pemesanan', $data['order_details']],
            ['Waktu memesan', $data['order_time']],
            ['Kategori tiket', $data['category']['name'].' @ Rp. '.number_format($data['category']['price'], 2, ',', '.')],
            ['Jumlah tiket', $data['tickets']],
            ['Nomor pemesanan', $data['order_id']],
            ['Harga total', '<b>Rp. '.number_format($data['tickets'] * $data['category']['price'], 2, ',', '.').'</b>'],
            ['Deadline pembayaran', '<b>'.$data['expire_time'].'</b>'],
        ];

        $str .= '<p>';
        $str .= ' <h6>Tagihan pembayaran e-tiket</h6>';
        $str .= ' <div>Berikut adalah informasi untuk tagihan anda:</div>';
        $str .= ' <ul>';
        foreach ($items as $item) {
            $str .= '  <li>'.$item[0].': '.$item[1].'</li>';
        }
        $str .= ' </ul>';
        $str .= ' <div>Pembayaran dilakukan melalui web dengan mengikuti langkah-langkah di bawah ini.</div>';
        $str .= ' <ol>';
        $str .= '  <li>Salin kode tagihan berikut: <code>'.$data['invoice_id'].'</code> (tidak untuk dibagikan kepada siapapun)</li>';
        $str .= '  <li>Tempelkan <a href="'.site_url('portal/order/invoice').'" target="_blank">di sini</a> kemudian klik tombol <b>Lihat tagihan</b></li>';
        $str .= '  <li>Setelah itu, klik tombol <b>Bayar sekarang</b> kemudian pilih salah satu metode pembayaran</li>';
        $str .= '  <li>Klik <b>Lanjut</b> kemudian ikuti instruksi yang tertera pada laman</li>';
        $str .= ' </ol>';
        $str .= '</p>';

        return $str;
    }

    public function tickets($data) {
        $this->CI->load->helper('url');

        $str = '';

        $items = [
            ['E-mail', $data['email']],
            ['Keterangan pemesanan', $data['order_details']],
            ['Waktu memesan', $data['order_time']],
            ['Kategori tiket', $data['category']['name']],
            ['Jumlah tiket', $data['tickets']],
            ['Nomor pemesanan', $data['order_id']]
        ];

        $str .= '<p>';
        $str .= ' <h6>Keterangan e-tiket</h6>';
        $str .= ' <div>Berikut adalah e-tiket untuk:</div>';
        $str .= ' <ul>';
        foreach ($items as $item) {
            $str .= '  <li>'.$item[0].': '.$item[1].'</li>';
        }
        $str .= ' </ul>';
        $str .= ' <div>Anda dapat mengakses e-tiket anda melalui web dengan mengikuti langkah-langkah di bawah ini.</div>';
        $str .= ' <ol>';
        $str .= '  <li>Salin kode tagihan berikut: <code>'.$data['invoice_id'].'</code> (tidak untuk dibagikan kepada siapapun)</li>';
        $str .= '  <li>Tempelkan <a href="'.site_url('portal/order/tickets').'" target="_blank">di sini</a> kemudian klik tombol <b>Lihat e-tiket</b></li>';
        $str .= ' </ol>';
        $str .= '</p>';

        return $str;
    }

}

?>
