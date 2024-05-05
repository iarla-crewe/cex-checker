import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
 
export async function POST(request: Request) {
  try {
    let body = await request.json()
    let tokenA = body.tokenA;
    let tokenB = body.tokenB;

    let resultA = await getData(tokenA);
    let resultB = await getData(tokenB);

    const depositFeesWithTokenA  = resultA.map(obj => ({ ...obj, token: `${tokenA}` }));
    const depositFeesWithTokenB = resultB.map(obj => ({ ...obj, token: `${tokenB}` }));
    
    // Join the arrays
    const combinedDepositFees = [...depositFeesWithTokenA, ...depositFeesWithTokenB];
  
    return NextResponse.json({ combinedDepositFees }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

async function getData(token: string) {
  const sql = neon(process.env.DATABASE_URL!);

  const response = await sql`SELECT 'deposit' AS type, e.name AS exchange_name, df.fee_amount AS fee
  FROM deposit_fee df
  JOIN exchange e ON df.exchange_id = e.exchange_id
  WHERE df.token = ${token};
  `;
  return response;
}