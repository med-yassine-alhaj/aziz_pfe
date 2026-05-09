const statusConfig = {
  // Service requests
  pending:           { label: 'En attente',       bg: 'bg-yellow-100',  text: 'text-yellow-800' },
  discussion:        { label: 'En discussion',     bg: 'bg-blue-100',    text: 'text-blue-800' },
  quote_sent:        { label: 'Devis envoyé',      bg: 'bg-purple-100',  text: 'text-purple-800' },
  quote_accepted:    { label: 'Devis accepté',     bg: 'bg-green-100',   text: 'text-green-800' },
  quote_refused:     { label: 'Devis refusé',      bg: 'bg-red-100',     text: 'text-red-800' },
  invoice_generated: { label: 'Facture générée',   bg: 'bg-indigo-100',  text: 'text-indigo-800' },
  payment_pending:   { label: 'Paiement en att.',  bg: 'bg-orange-100',  text: 'text-orange-800' },
  paid:              { label: 'Payée',             bg: 'bg-emerald-100', text: 'text-emerald-800' },
  in_progress:       { label: 'En cours',          bg: 'bg-cyan-100',    text: 'text-cyan-800' },
  completed:         { label: 'Terminée',          bg: 'bg-green-100',   text: 'text-green-800' },
  cancelled:         { label: 'Annulée',           bg: 'bg-gray-100',    text: 'text-gray-600' },
  // Quotes
  draft:             { label: 'Brouillon',         bg: 'bg-gray-100',    text: 'text-gray-600' },
  sent:              { label: 'Envoyé',            bg: 'bg-blue-100',    text: 'text-blue-800' },
  accepted:          { label: 'Accepté',           bg: 'bg-green-100',   text: 'text-green-800' },
  refused:           { label: 'Refusé',            bg: 'bg-red-100',     text: 'text-red-800' },
  expired:           { label: 'Expiré',            bg: 'bg-gray-100',    text: 'text-gray-500' },
  // Invoices
  waiting_accountant_validation: { label: 'À valider', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  unpaid:            { label: 'Non payée',         bg: 'bg-red-100',     text: 'text-red-800' },
  // Payments
  success:           { label: 'Validé',            bg: 'bg-green-100',   text: 'text-green-800' },
  failed:            { label: 'Échoué',            bg: 'bg-red-100',     text: 'text-red-800' },
  rejected:          { label: 'Rejeté',            bg: 'bg-red-100',     text: 'text-red-800' },
}

export default function StatusBadge({ status, label }) {
  const config = statusConfig[status] || { label: label || status, bg: 'bg-gray-100', text: 'text-gray-600' }
  return (
    <span className={`status-badge ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
