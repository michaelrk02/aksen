<p>Pembayaran dapat dilakukan melalui transfer antar bank kepada salah satu dari rekening berikut:</p>
<ul>
    <?php foreach ($accounts as $account): ?>
        <li><?php echo $account['name']; ?> (<?php echo $account['vendor']; ?>: <b><?php echo $account['number']; ?></b>)</li>
    <?php endforeach; ?>
</ul>
<p>Kemudian isi nominal transfer dengan: <b class="label"><?php echo $amount; ?></b></p>
<p>Setelah berhasil membayar, silakan tunggu beberapa waktu untuk memvalidasi pembayaran. Panitia akan mengecek mutasi rekening secara reguler.</p>
<p>Segera konfirmasi ke panitia apabila terdapat kesalahan input jumlah nominal, <b>atau</b>: formulir pemesanan tiket anda ditolak oleh panitia dan beresiko uang tidak dapat dikembalikan. Kelalaian anda <b>bukan</b> tanggung jawab kami.</p>
