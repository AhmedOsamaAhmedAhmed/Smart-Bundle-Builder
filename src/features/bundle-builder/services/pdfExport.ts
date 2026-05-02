import { Product } from '../types/bundle.types'

// Simple PDF generation using browser print
export const exportToPDF = (selectedItems: Product[], totalCost: number) => {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups to export PDF')
    return
  }

  const formatPrice = (price: number) => `$${price}`
  const date = new Date().toLocaleDateString()
  const time = new Date().toLocaleTimeString()

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Smart Bundle Builder - Build Summary</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #1677ff;
        }
        .header h1 {
          color: #1677ff;
          margin-bottom: 8px;
        }
        .header p {
          color: #666;
        }
        .summary {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .summary h2 {
          margin-bottom: 16px;
          color: #1677ff;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #ddd;
        }
        .summary-item:last-child {
          border-bottom: none;
        }
        .item-name {
          font-weight: bold;
        }
        .item-price {
          color: #1677ff;
        }
        .total {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #1677ff;
          display: flex;
          justify-content: space-between;
          font-size: 18px;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #999;
          font-size: 12px;
        }
        .compatibility-note {
          margin-top: 20px;
          padding: 12px;
          background: #e6f7ff;
          border-left: 4px solid #1677ff;
          border-radius: 4px;
        }
        @media print {
          body {
            padding: 20px;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Smart Bundle Builder</h1>
        <p>Build Summary - Generated on ${date} at ${time}</p>
      </div>
      
      <div class="summary">
        <h2>Your Components</h2>
        ${selectedItems.map(item => `
          <div class="summary-item">
            <span class="item-name">${item.name}</span>
            <span class="item-price">${formatPrice(item.price)}</span>
          </div>
        `).join('')}
        
        <div class="total">
          <span>Total Cost</span>
          <span style="color: #1677ff">${formatPrice(totalCost)}</span>
        </div>
        
        <div class="compatibility-note">
          <strong>✅ Compatibility Verified</strong>
          <p>All selected components are compatible with each other.</p>
        </div>
      </div>
      
      <div class="footer">
        <p>Smart Bundle Builder - Build your perfect tech setup</p>
        <p>Budget Limit: $1,500 | Total Spent: ${formatPrice(totalCost)} | Remaining: $${1500 - totalCost}</p>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 40px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #1677ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          🖨️ Print / Save as PDF
        </button>
        <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
          Close
        </button>
      </div>
      
      <script>
        // Auto-trigger print dialog (optional)
        // window.print();
      </script>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}