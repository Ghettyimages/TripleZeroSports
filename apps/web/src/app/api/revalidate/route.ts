import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Verify the webhook secret
    const authHeader = request.headers.get('authorization');
    const expectedSecret = `Bearer ${process.env.WEBHOOK_SECRET}`;
    
    if (!authHeader || authHeader !== expectedSecret) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { paths } = body;

    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json(
        { message: 'Invalid request body. Expected paths array.' },
        { status: 400 }
      );
    }

    // Revalidate each path
    const revalidatedPaths: string[] = [];
    for (const path of paths) {
      try {
        revalidatePath(path);
        revalidatedPaths.push(path);
      } catch (error) {
        console.error(`Failed to revalidate path ${path}:`, error);
      }
    }

    return NextResponse.json({
      message: 'Revalidation triggered successfully',
      revalidatedPaths,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

