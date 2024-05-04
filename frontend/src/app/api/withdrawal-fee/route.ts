import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
 
export async function POST(request: Request) {
  try {
    let body = await request.json()
    let tokenA = body.tokenA;
    let tokenB = body.tokenB;

    let resultA = await getData(tokenA);
    let resultB = await getData(tokenB);

    const withdrawalFeesWithTokenA  = resultA.map(obj => ({ ...obj, token: `${tokenA}` }));
    const withdrawalFeesWithTokenB = resultB.map(obj => ({ ...obj, token: `${tokenB}` }));
    
    // Join the arrays
    const combinedWithdrawalFees = [...withdrawalFeesWithTokenA, ...withdrawalFeesWithTokenB];
  
    return NextResponse.json({ combinedWithdrawalFees }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

async function getData(token: string) {
  const sql = neon(process.env.DATABASE_URL!);

  const response = await sql`SELECT 'withdrawal' AS type, e.name AS exchange_name, wf.fee_amount AS fee
  FROM withdrawal_fee wf
  JOIN exchange e ON wf.exchange_id = e.exchange_id
  WHERE wf.token = ${token};
  `;
  return response;
}