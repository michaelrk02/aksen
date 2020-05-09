<p>Pembayaran dapat dilakukan melalui transfer antar bank kepada salah satu dari rekening berikut:</p>
<ul>
    <?php foreach ($accounts as $account): ?>
        <li><?php echo $account['name']; ?> (<?php echo $account['vendor']; ?>: <b><?php echo $account['number']; ?></b>)</li>
    <?php endforeach; ?>
</ul>
<p>Kemudian isi nominal transfer dengan: <b id="amount"></b></p>
