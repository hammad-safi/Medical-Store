import { NextRequest, NextResponse } from 'next/server';
import api from '@/app/lib/axios';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const response = await api.get(`/sales/invoice/${id}`);
    
    // Return as HTML for printing
    const invoice = response.data.data;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            /* Add your print styles here */
          </style>
        </head>
        <body>
          <!-- Invoice content -->
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}