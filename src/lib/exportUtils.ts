// Export utilities for generating reports

export interface ExportData {
  title: string;
  timestamp: string;
  data: Record<string, unknown>[];
  summary?: Record<string, unknown>;
}

/**
 * Export data as CSV file
 */
export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values with commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

/**
 * Export data as JSON file
 */
export function exportToJSON(data: ExportData, filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
}

/**
 * Export data as formatted text report
 */
export function exportToTextReport(data: ExportData, filename: string): void {
  const lines: string[] = [
    '='.repeat(60),
    data.title.toUpperCase(),
    '='.repeat(60),
    '',
    `Generated: ${data.timestamp}`,
    '',
  ];

  if (data.summary) {
    lines.push('SUMMARY', '-'.repeat(40));
    Object.entries(data.summary).forEach(([key, value]) => {
      lines.push(`${formatKey(key)}: ${value}`);
    });
    lines.push('');
  }

  if (data.data.length > 0) {
    lines.push('DETAILS', '-'.repeat(40));
    data.data.forEach((item, index) => {
      lines.push(`\n[${index + 1}]`);
      Object.entries(item).forEach(([key, value]) => {
        lines.push(`  ${formatKey(key)}: ${formatValue(value)}`);
      });
    });
  }

  lines.push('', '='.repeat(60), 'END OF REPORT', '='.repeat(60));
  
  downloadFile(lines.join('\n'), `${filename}.txt`, 'text/plain');
}

/**
 * Generate a PDF-friendly HTML report and trigger print
 */
export function exportToPDF(data: ExportData, _filename: string): void {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${data.title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
        h1 { color: #160E15; border-bottom: 2px solid #FC0A0A; padding-bottom: 10px; }
        .timestamp { color: #626261; font-size: 14px; margin-bottom: 20px; }
        .summary { background: #E8E8E8; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .summary h2 { margin-top: 0; color: #160E15; }
        .summary-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #C6C6C5; }
        .data-section h2 { color: #160E15; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #160E15; color: white; padding: 12px; text-align: left; }
        td { padding: 10px 12px; border-bottom: 1px solid #C6C6C5; }
        tr:nth-child(even) { background: #E8E8E8; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <h1>${data.title}</h1>
      <div class="timestamp">Generated: ${data.timestamp}</div>
      
      ${data.summary ? `
        <div class="summary">
          <h2>Summary</h2>
          ${Object.entries(data.summary).map(([key, value]) => `
            <div class="summary-item">
              <span>${formatKey(key)}</span>
              <strong>${value}</strong>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.data.length > 0 ? `
        <div class="data-section">
          <h2>Details</h2>
          <table>
            <thead>
              <tr>${Object.keys(data.data[0]).map(key => `<th>${formatKey(key)}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${data.data.map(row => `
                <tr>${Object.values(row).map(value => `<td>${formatValue(value)}</td>`).join('')}</tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

/**
 * Helper to trigger file download
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format key for display
 */
function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Format value for display
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
