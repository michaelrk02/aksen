<html>
    <head>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <script async src="<?php echo base_url('public/theme.app.js'); ?>"></script>
        <script>
            window.addEventListener('load', function() {
                var formatter = new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'});

                var amount = document.getElementById('amount');
                if (amount !== null) {
                    amount.innerText = formatter.format(parseInt(window.sessionStorage.getItem('aksen.payment_amount')));
                }

                var amountOffline = document.getElementById('amount-offline');
                if (amountOffline !== null) {
                    amountOffline.innerText = formatter.format(parseInt(window.sessionStorage.getItem('aksen.payment_amount_offline')));
                }
            });
        </script>
        <title>Pembayaran Tiket AKSEN Melalui Bank Transfer</title>
    </head>
    <body style="display: flex; flex-direction: column; min-height: 100vh">
        <header class="bg-primary">
            <h1 style="margin: 1rem">Pembayaran Tiket AKSEN</h1>
        </header>
        <main style="flex: 1 0 auto; margin-top: 2rem">
            <div class="container grid-lg">
