import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

interface UploadOptions {
  maxFileSize?: number;
  allowedTypes?: string[];
  uploadDir?: string;
}

interface FileUpload {
  fieldname: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
}

declare global {
  namespace Express {
    interface Request {
      file?: FileUpload;
      files?: FileUpload[];
    }
  }
}

const defaultOptions: UploadOptions = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword',
                 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  uploadDir: process.env.UPLOAD_DIR || './uploads'
};

export const upload = (fieldName: string, options: UploadOptions = {}) => {
  const config = { ...defaultOptions, ...options };

  // Ensure upload directory exists
  if (!fs.existsSync(config.uploadDir!)) {
    fs.mkdirSync(config.uploadDir!, { recursive: true });
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    const contentType = req.headers['content-type'] || '';

    if (!contentType.includes('multipart/form-data')) {
      next();
      return;
    }

    try {
      // Simple multipart parser
      const boundary = contentType.split('boundary=')[1];
      if (!boundary) {
        return res.status(400).json({ error: 'Invalid multipart boundary' });
      }

      const chunks: Buffer[] = [];

      req.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      req.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const parts = buffer.toString().split(`--${boundary}`);

        for (const part of parts) {
          if (part.includes(`name="${fieldName}"`)) {
            const headerEnd = part.indexOf('\r\n\r\n');
            if (headerEnd === -1) continue;

            const header = part.substring(0, headerEnd);
            const filenameMatch = header.match(/filename="([^"]+)"/);
            const contentTypeMatch = header.match(/Content-Type: ([^\r\n]+)/);

            if (!filenameMatch) continue;

            const originalname = filenameMatch[1];
            const mimetype = contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream';

            // Check file type
            if (config.allowedTypes && !config.allowedTypes.includes(mimetype)) {
              res.status(400).json({
                error: `File type ${mimetype} not allowed. Allowed types: ${config.allowedTypes.join(', ')}`
              });
              return;
            }

            // Extract file content
            const contentStart = headerEnd + 4;
            const contentEnd = part.lastIndexOf('\r\n');
            const fileContent = part.substring(contentStart, contentEnd);
            const fileBuffer = Buffer.from(fileContent, 'binary');

            // Check file size
            if (fileBuffer.length > config.maxFileSize!) {
              res.status(400).json({
                error: `File too large. Maximum size: ${config.maxFileSize! / 1024 / 1024}MB`
              });
              return;
            }

            // Generate unique filename
            const ext = path.extname(originalname);
            const filename = `${crypto.randomBytes(16).toString('hex')}${ext}`;
            const filepath = path.join(config.uploadDir!, filename);

            // Save file
            fs.writeFileSync(filepath, fileBuffer);

            req.file = {
              fieldname: fieldName,
              filename,
              originalname,
              mimetype,
              size: fileBuffer.length,
              path: filepath
            };
            break;
          }
        }

        next();
      });

      req.on('error', (error) => {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'File upload failed' });
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'File upload failed' });
    }
  };
};

export const deleteFile = (filepath: string): boolean => {
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Delete file error:', error);
    return false;
  }
};

export const getFileUrl = (filename: string): string => {
  return `/uploads/${filename}`;
};
