import { NextResponse } from 'next/server';
import { checkAndUpdateExpiredDonations } from '@/lib/donation-service';

export async function GET(request: Request) {
  // Verify authorization (e.g., using a secret key in headers from a cron service)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedCount = await checkAndUpdateExpiredDonations();
    return NextResponse.json({ 
      success: true, 
      updatedCount, 
      message: `${updatedCount} donations updated to EXPIRED status.` 
    });
  } catch (error: any) {
    console.error('Error in cron job:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
