import { NextResponse } from 'next/server';
import shindenDescription from '@docchi/shinden-description';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  try {
    const result = await shindenDescription(title);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching Shinden description:', error);
    return NextResponse.json({ error: 'Failed to fetch description' }, { status: 500 });
  }
} 