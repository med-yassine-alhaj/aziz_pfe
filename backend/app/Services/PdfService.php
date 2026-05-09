<?php

namespace App\Services;

use App\Models\AgencySetting;
use App\Models\Invoice;
use App\Models\Quote;
use App\Models\Receipt;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfService
{
    private AgencySetting $settings;

    public function __construct()
    {
        $this->settings = AgencySetting::instance();
    }

    public function generateQuotePdf(Quote $quote): string
    {
        $pdf = Pdf::loadView('pdf.quote', [
            'quote'    => $quote,
            'settings' => $this->settings,
        ])->setPaper('A4');

        return $pdf->output();
    }

    public function generateInvoicePdf(Invoice $invoice): string
    {
        $pdf = Pdf::loadView('pdf.invoice', [
            'invoice'  => $invoice,
            'settings' => $this->settings,
        ])->setPaper('A4');

        return $pdf->output();
    }

    public function generateReceiptPdf(Receipt $receipt): string
    {
        $pdf = Pdf::loadView('pdf.receipt', [
            'receipt'  => $receipt,
            'settings' => $this->settings,
        ])->setPaper('A4');

        return $pdf->output();
    }
}
