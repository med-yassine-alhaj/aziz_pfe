<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #091127; }
        .page { padding: 40px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid #7C3AED; padding-bottom: 20px; }
        .agency-name { font-size: 24px; font-weight: bold; color: #7C3AED; }
        .agency-info { font-size: 11px; color: #666; margin-top: 4px; }
        .quote-title { text-align: right; }
        .quote-title h1 { font-size: 28px; color: #091127; font-weight: bold; }
        .quote-title p { font-size: 12px; color: #666; margin-top: 4px; }
        .info-grid { display: flex; gap: 40px; margin-bottom: 30px; }
        .info-box { flex: 1; background: #F7F8FB; padding: 16px; border-radius: 8px; }
        .info-box h3 { font-size: 11px; color: #7C3AED; text-transform: uppercase; margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        thead tr { background: #7C3AED; color: white; }
        thead th { padding: 10px 12px; text-align: left; font-size: 11px; }
        tbody tr:nth-child(even) { background: #F7F8FB; }
        tbody td { padding: 10px 12px; font-size: 11px; border-bottom: 1px solid #eee; }
        .totals { margin-left: auto; width: 280px; }
        .totals td { padding: 6px 10px; }
        .total-row td { background: #7C3AED; color: white; font-weight: bold; font-size: 14px; padding: 10px; }
        .validity { margin-top: 20px; padding: 12px; background: #FEF3C7; border-radius: 8px; font-size: 11px; color: #92400E; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; font-size: 10px; color: #999; text-align: center; }
    </style>
</head>
<body>
<div class="page">
    <div class="header">
        <div>
            <div class="agency-name">{{ $settings->agency_name }}</div>
            <div class="agency-info">{{ $settings->address }}</div>
            <div class="agency-info">{{ $settings->email }} | {{ $settings->phone }}</div>
        </div>
        <div class="quote-title">
            <h1>DEVIS</h1>
            <p>N° {{ $quote->quote_number }}</p>
            <p>Date : {{ $quote->created_at->format('d/m/Y') }}</p>
            @if($quote->valid_until)<p>Valide jusqu'au : {{ $quote->valid_until->format('d/m/Y') }}</p>@endif
        </div>
    </div>

    <div class="info-grid">
        <div class="info-box">
            <h3>Émetteur</h3>
            <p><strong>{{ $settings->agency_name }}</strong></p>
            <p>{{ $settings->email }}</p>
        </div>
        <div class="info-box">
            <h3>Destinataire</h3>
            <p><strong>{{ $quote->client->name }}</strong></p>
            <p>{{ $quote->client->email }}</p>
            @if($quote->serviceRequest)<p>Projet : {{ $quote->serviceRequest->title }}</p>@endif
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Désignation</th>
                <th style="text-align:center">Qté</th>
                <th style="text-align:right">P.U. HT</th>
                <th style="text-align:center">TVA %</th>
                <th style="text-align:right">Total HT</th>
            </tr>
        </thead>
        <tbody>
            @foreach($quote->items as $item)
            <tr>
                <td>
                    <strong>{{ $item->title }}</strong>
                    @if($item->description)<br><span style="color:#666;font-size:10px">{{ $item->description }}</span>@endif
                </td>
                <td style="text-align:center">{{ $item->quantity }}</td>
                <td style="text-align:right">{{ number_format($item->unit_price, 2) }} MAD</td>
                <td style="text-align:center">{{ $item->tax_rate }}%</td>
                <td style="text-align:right">{{ number_format($item->total, 2) }} MAD</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr><td>Sous-total HT</td><td style="text-align:right">{{ number_format($quote->subtotal, 2) }} MAD</td></tr>
            @if($quote->discount_amount > 0)
            <tr><td>Remise</td><td style="text-align:right">-{{ number_format($quote->discount_amount, 2) }} MAD</td></tr>
            @endif
            <tr><td>TVA</td><td style="text-align:right">{{ number_format($quote->tax_amount, 2) }} MAD</td></tr>
            <tr class="total-row"><td>TOTAL TTC</td><td style="text-align:right">{{ number_format($quote->total, 2) }} MAD</td></tr>
        </table>
    </div>

    @if($quote->valid_until)
    <div class="validity">Ce devis est valable jusqu'au {{ $quote->valid_until->format('d/m/Y') }}.</div>
    @endif

    @if($quote->notes)
    <div style="margin-top: 16px; font-size: 11px; color: #555;"><strong>Notes :</strong> {{ $quote->notes }}</div>
    @endif

    <div class="footer">{{ $settings->invoice_legal_mentions ?? $settings->agency_name . ' — ' . $settings->email }}</div>
</div>
</body>
</html>
