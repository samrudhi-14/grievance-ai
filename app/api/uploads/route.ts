import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum 5MB limit.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid file type. Only JPG, PNG, WEBP, and PDF documents are allowed.',
        },
        { status: 400 }
      );
    }

    // Sanitize extension
    const ext = path.extname(file.name).toLowerCase().slice(0, 5) || '.bin';
    const safeBaseName = file.name
      .replace(ext, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueFilename = `${Date.now()}_${safeBaseName}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const targetPath = path.join(uploadDir, uniqueFilename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(targetPath, buffer);

    return NextResponse.json({
      success: true,
      filePath: `/uploads/${uniqueFilename}`,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('File upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Failed to upload file.',
      },
      { status: 500 }
    );
  }
}
