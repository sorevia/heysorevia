export type ReceiptItem = {
  id: string
  name: string
  tag: string
  price: number
  quantity: number
}

export type ReceiptOrder = {
  id: string
  customerName: string
  customerEmail: string
  phone: string
  address: string
  paymentMethod: string
  subtotal: number
  shipping: number
  total: number
  createdAt: string
  items: ReceiptItem[]
}

const formatReceiptPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")

export function buildReceiptHtml(order: ReceiptOrder) {
  const createdAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(order.createdAt))

  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td>
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(item.tag)}</span>
          </td>
          <td>${item.quantity}</td>
          <td>${formatReceiptPrice(item.price)}</td>
          <td>${formatReceiptPrice(item.price * item.quantity)}</td>
        </tr>
      `,
    )
    .join("")

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sorevia receipt ${escapeHtml(order.id)}</title>
    <style>
      @page {
        size: 80mm auto;
        margin: 6mm;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: #f7f3ec;
        color: #1f170f;
        font-family: Arial, sans-serif;
      }

      .receipt {
        width: 80mm;
        margin: 24px auto;
        background: #fffdf8;
        border: 1px solid #e4dacb;
        border-radius: 10px;
        padding: 18px;
        box-shadow: 0 18px 45px rgba(36, 26, 13, 0.12);
      }

      .brand {
        text-align: center;
        border-bottom: 1px dashed #c9baa4;
        padding-bottom: 14px;
      }

      .brand h1 {
        margin: 0;
        font-family: Georgia, serif;
        font-size: 28px;
        letter-spacing: 0.08em;
      }

      .brand p,
      .muted {
        color: #6b5d4a;
        font-size: 12px;
      }

      .meta {
        display: grid;
        gap: 6px;
        border-bottom: 1px dashed #c9baa4;
        padding: 14px 0;
        font-size: 12px;
      }

      .meta div,
      .total-row {
        display: flex;
        justify-content: space-between;
        gap: 16px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 12px 0;
        font-size: 12px;
      }

      th {
        border-bottom: 1px solid #e4dacb;
        color: #6b5d4a;
        font-size: 10px;
        padding: 8px 0;
        text-align: right;
        text-transform: uppercase;
      }

      th:first-child,
      td:first-child {
        text-align: left;
      }

      td {
        border-bottom: 1px solid #f0e8dd;
        padding: 9px 0;
        text-align: right;
        vertical-align: top;
      }

      td span {
        display: block;
        color: #6b5d4a;
        font-size: 10px;
        margin-top: 3px;
      }

      .totals {
        display: grid;
        gap: 8px;
        border-bottom: 1px dashed #c9baa4;
        border-top: 1px dashed #c9baa4;
        padding: 12px 0;
        font-size: 13px;
      }

      .grand {
        font-size: 18px;
        font-weight: 700;
      }

      .thanks {
        padding-top: 14px;
        text-align: center;
      }

      .actions {
        display: flex;
        justify-content: center;
        margin: 20px auto;
      }

      button {
        border: 0;
        border-radius: 999px;
        background: #174c1b;
        color: white;
        cursor: pointer;
        font-weight: 700;
        padding: 12px 18px;
      }

      @media print {
        body {
          background: white;
        }

        .receipt {
          width: 100%;
          margin: 0;
          border: 0;
          border-radius: 0;
          box-shadow: none;
          padding: 0;
        }

        .actions {
          display: none;
        }
      }
    </style>
  </head>
  <body>
    <section class="receipt">
      <div class="brand">
        <h1>SOREVIA</h1>
        <p>Premium peanut butter for clean daily energy</p>
      </div>

      <div class="meta">
        <div><span>Receipt</span><strong>#${escapeHtml(order.id.slice(0, 8).toUpperCase())}</strong></div>
        <div><span>Date</span><strong>${createdAt}</strong></div>
        <div><span>Customer</span><strong>${escapeHtml(order.customerName)}</strong></div>
        <div><span>Email</span><strong>${escapeHtml(order.customerEmail)}</strong></div>
        <div><span>Payment</span><strong>${escapeHtml(order.paymentMethod.toUpperCase())}</strong></div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <div class="totals">
        <div class="total-row"><span>Subtotal</span><strong>${formatReceiptPrice(order.subtotal)}</strong></div>
        <div class="total-row"><span>Shipping</span><strong>${order.shipping ? formatReceiptPrice(order.shipping) : "Free"}</strong></div>
        <div class="total-row grand"><span>Total</span><strong>${formatReceiptPrice(order.total)}</strong></div>
      </div>

      <div class="thanks">
        <strong>Thank you for choosing Sorevia.</strong>
        <p class="muted">Keep this receipt for order tracking and support.</p>
        <p class="muted">${escapeHtml(order.address)}</p>
      </div>
    </section>

    <div class="actions">
      <button onclick="window.print()">Print or save as PDF</button>
    </div>
  </body>
</html>`
}

export function downloadReceipt(order: ReceiptOrder) {
  const html = buildReceiptHtml(order)
  const blob = new Blob([html], { type: "text/html;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")

  anchor.href = url
  anchor.download = `sorevia-receipt-${order.id.slice(0, 8)}.html`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function printReceipt(order: ReceiptOrder) {
  const receiptWindow = window.open("", "_blank", "width=420,height=700")
  if (!receiptWindow) return

  receiptWindow.document.open()
  receiptWindow.document.write(buildReceiptHtml(order))
  receiptWindow.document.close()
  receiptWindow.focus()
}
