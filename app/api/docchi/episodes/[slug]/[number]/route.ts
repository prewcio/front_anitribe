import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string; number: string } }
) {
  try {
    const { slug, number } = params;
    console.log('Fetching Docchi players for:', { slug, number });

    const response = await fetch(
      `https://api.docchi.pl/v1/episodes/find/${encodeURIComponent(slug)}/${number}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const data = await response.json();
    console.log('Docchi API response:', data);

    if (!response.ok) {
      console.error('Docchi API error:', data);
      return NextResponse.json(
        { error: 'Failed to fetch episode players', details: data },
        { status: response.status }
      );
    }

    // Return the raw response data
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to Docchi API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 