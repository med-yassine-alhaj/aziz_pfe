<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #091127; background: #fff; }
        .page { padding: 40px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid #7C3AED; padding-bottom: 20px; }
        .agency-name { font-size: 24px; font-weight: bold; color: #7C3AED; }
        .agency-info { font-size: 11px; color: #666; margin-top: 4px; }
        .invoice-title { text-align: right; }
        .invoice-title h1 { font-size: 28px; color: #091127; font-weight: bold; }
        .invoice-title p { font-size: 12px; color: #666; margin-top: 4px; }
        .badge { display: inline-block; background: #F1EAFE; color: #7C3AED; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; margin-top: 6px; }
        .info-grid { display: flex; gap: 40px; margin-bottom: 30px; }
        .info-box { flex: 1; background: #F7F8FB; padding: 16px; border-radius: 8px; }
        .info-box h3 { font-size: 11px; color: #7C3AED; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .info-box p { font-size: 12px; color: #091127; line-height: 1.6; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        thead tr { background: #7C3AED; color: white; }
        thead th { padding: 10px 12px; text-align: left; font-size: 11px; }
        tbody tr:nth-child(even) { background: #F7F8FB; }
        tbody td { padding: 10px 12px; font-size: 11px; border-bottom: 1px solid #eee; }
        .totals { margin-left: auto; width: 280px; }
        .totals table { margin: 0; }
        .totals td { padding: 6px 10px; font-size: 12px; }
        .totals .total-row td { background: #7C3AED; color: white; font-weight: bold; font-size: 14px; padding: 10px; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: bold; }
        .status-paid { background: #D1FAE5; color: #065F46; }
        .status-unpaid { background: #FEE2E2; color: #991B1B; }
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
            @if($settings->tax_number)<div class="agency-info">IF : {{ $settings->tax_number }}</div>@endif
        </div>
        <div class="invoice-title">
            <h1>FACTURE</h1>
            <p>N° {{ $invoice->invoice_number }}</p>
            <p>Date : {{ $invoice->created_at->format('d/m/Y') }}</p>
            @if($invoice->due_date)<p>Échéance : {{ $invoice->due_date->format('d/m/Y') }}</p>@endif
            <span class="badge status-{{ $invoice->status === 'paid' ? 'paid' : 'unpaid' }}">
                {{ $invoice->status_label }}
            </span>
        </div>
    </div>

    <div class="info-grid">
        <div class="info-box">
            <h3>Émetteur</h3>
            <p><strong>{{ $settings->agency_name }}</strong></p>
            <p>{{ $settings->address }}</p>
            <p>{{ $settings->email }}</p>
            <p>{{ $settings->phone }}</p>
        </div>
        <div class="info-box">
            <h3>Facturé à</h3>
            <p><strong>{{ $invoice->client->name }}</strong></p>
            <p>{{ $invoice->client->email }}</p>
            <p>{{ $invoice->client->phone }}</p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Désignation</th>
                <th style="text-align:center">Qté</th>
                <th style="text-align:right">P.U. HT</th>
                <th style="text-align:center">TVA %</th>
                <th style="text-align:right">Remise</th>
                <th style="text-align:right">Total HT</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
            <tr>
                <td>
                    <strong>{{ $item->title }}</strong>
                    @if($item->description)<br><span style="color:#666;font-size:10px">{{ $item->description }}</span>@endif
                </td>
                <td style="text-align:center">{{ $item->quantity }}</td>
                <td style="text-align:right">{{ number_format($item->unit_price, 2) }} MAD</td>
                <td style="text-align:center">{{ $item->tax_rate }}%</td>
                <td style="text-align:right">{{ number_format($item->discount_amount, 2) }} MAD</td>
                <td style="text-align:right">{{ number_format($item->total, 2) }} MAD</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr><td>Sous-total HT</td><td style="text-align:right">{{ number_format($invoice->subtotal, 2) }} MAD</td></tr>
            @if($invoice->discount_amount > 0)
            <tr><td>Remise</td><td style="text-align:right">-{{ number_format($invoice->discount_amount, 2) }} MAD</td></tr>
            @endif
            <tr><td>TVA</td><td style="text-align:right">{{ number_format($invoice->tax_amount, 2) }} MAD</td></tr>
            <tr class="total-row"><td>TOTAL TTC</td><td style="text-align:right">{{ number_format($invoice->total, 2) }} MAD</td></tr>
        </table>
    </div>

    @if($settings->bank_account)
    <div style="margin-top: 30px; background: #F7F8FB; padding: 16px; border-radius: 8px; font-size: 11px;">
        <strong>Informations bancaires :</strong><br>
        Banque : {{ $settings->bank_name }} | RIB : {{ $settings->bank_account }}
        @if($settings->bank_iban) | IBAN : {{ $settings->bank_iban }} @endif
    </div>
    @endif

    @if($settings->invoice_legal_mentions)
    <div class="footer">{{ $settings->invoice_legal_mentions }}</div>
    @endif
</div>
</body>
</html>
