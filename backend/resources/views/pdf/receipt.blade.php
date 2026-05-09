<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #091127; }
        .page { padding: 40px; max-width: 600px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #7C3AED; padding-bottom: 20px; }
        .agency-name { font-size: 22px; font-weight: bold; color: #7C3AED; }
        .receipt-icon { font-size: 48px; margin: 16px 0; }
        .receipt-title { font-size: 20px; font-weight: bold; color: #065F46; }
        .receipt-number { font-size: 13px; color: #666; }
        .amount-box { background: #D1FAE5; border: 2px solid #10B981; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .amount-box .label { font-size: 12px; color: #065F46; margin-bottom: 4px; }
        .amount-box .amount { font-size: 32px; font-weight: bold; color: #065F46; }
        .info-section { background: #F7F8FB; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
        .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; font-size: 11px; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #666; }
        .info-value { font-weight: bold; color: #091127; }
        .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #999; padding-top: 16px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
<div class="page">
    <div class="header">
        <div class="agency-name">{{ $settings->agency_name }}</div>
        <div class="receipt-icon">✓</div>
        <div class="receipt-title">REÇU DE PAIEMENT</div>
        <div class="receipt-number">N° {{ $receipt->receipt_number }}</div>
    </div>

    <div class="amount-box">
        <div class="label">Montant payé</div>
        <div class="amount">{{ number_format($receipt->amount, 2) }} MAD</div>
    </div>

    <div class="info-section">
        <div class="info-row">
            <span class="info-label">Client</span>
            <span class="info-value">{{ $receipt->client->name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Email</span>
            <span class="info-value">{{ $receipt->client->email }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Facture N°</span>
            <span class="info-value">{{ $receipt->invoice->invoice_number }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Mode de paiement</span>
            <span class="info-value">{{ $receipt->payment->method_label }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Date de paiement</span>
            <span class="info-value">{{ $receipt->created_at->format('d/m/Y à H:i') }}</span>
        </div>
        @if($receipt->payment->transaction_reference)
        <div class="info-row">
            <span class="info-label">Référence</span>
            <span class="info-value">{{ $receipt->payment->transaction_reference }}</span>
        </div>
        @endif
    </div>

    <div class="footer">
        Ce reçu confirme la réception de votre paiement.<br>
        {{ $settings->agency_name }} — {{ $settings->email }} — {{ $settings->phone }}
    </div>
</div>
</body>
</html>
