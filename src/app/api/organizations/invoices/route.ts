import { auth } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { listInvoices } from '@/libs/Stripe';
import { invoice, organizationSchema } from '@/models/Schema';



export async function GET() {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Get organization
    const [org] = await db
      .select()
      .from(organizationSchema)
      .where(eq(organizationSchema.id, orgId))
      .limit(1);

    if (!org || !org.stripeCustomerId) {
      return NextResponse.json([]);
    }

    // Get invoices from database
    const dbInvoices = await db
      .select()
      .from(invoice)
      .where(eq(invoice.organizationId, orgId))
      .orderBy(desc(invoice.createdAt))
      .limit(10);

    // If we have invoices in DB, return them
    if (dbInvoices.length > 0) {
      return NextResponse.json(
        dbInvoices.map((inv: any) => ({
          id: inv.stripeInvoiceId,
          status: inv.status,
          amountPaid: inv.amountPaid,
          currency: inv.currency,
          paidAt: inv.paidAt,
          hostedInvoiceUrl: inv.hostedInvoiceUrl,
          invoicePdf: inv.invoicePdf,
        })),
      );
    }

    // Otherwise, fetch from Stripe
    try {
      const stripeInvoices = await listInvoices({
        customerId: org.stripeCustomerId,
        limit: 10,
      });

      return NextResponse.json(
        stripeInvoices.data.map(inv => ({
          id: inv.id,
          status: inv.status,
          amountPaid: inv.amount_paid,
          currency: inv.currency,
          paidAt: inv.status_transitions?.paid_at
            ? new Date(inv.status_transitions.paid_at * 1000)
            : null,
          hostedInvoiceUrl: inv.hosted_invoice_url,
          invoicePdf: inv.invoice_pdf,
        })),
      );
    } catch (error) {
      console.error('Failed to fetch Stripe invoices:', error);
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 },
    );
  }
}
