import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { invalidateCache } from '@/lib/google-sheets';

/**
 * API Route pour revalider le cache quand le Google Sheet est modifié
 * À appeler depuis un webhook Google Apps Script onEdit
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier le secret (sécurité basique)
    const authHeader = request.headers.get('authorization');
    const secret = process.env.REVALIDATE_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Invalider le cache
    invalidateCache();

    // Revalider toutes les pages
    revalidatePath('/', 'layout');

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erreur lors de la revalidation:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * Endpoint GET pour tester manuellement
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  invalidateCache();
  revalidatePath('/', 'layout');

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
  });
}
