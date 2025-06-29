import express from "express";
import crypto from "crypto";
import { config } from "./config.js";
import { asyncHandler, NotFoundError } from "./middleware/error-handler.js";
import { validateDownloadToken } from "./middleware/validation.js";

const router = express.Router();

// Factory function to create router with injected dependencies
const createDownloadRouter = (supabase, prisma) => {
    router.get("/download/:token", 
        validateDownloadToken,
        asyncHandler(async (req, res) => {
            const { token } = req.params;

            // Find file record
            const record = await prisma.file.findUnique({ 
                where: { token },
                select: {
                    id: true,
                    token: true,
                    path: true,
                    isUsed: true,
                    expiresAt: true,
                    originalName: true
                }
            });

            if (!record) {
                throw new NotFoundError('File not found');
            }

            if (record.isUsed) {
                throw new Error('Link has already been used');
            }

            if (record.expiresAt < new Date()) {
                throw new Error('Link has expired');
            }

            // Fetch encrypted file from Supabase
            const { data, error } = await supabase.storage
                .from('files')
                .download(record.path);

            if (error) {
                console.error('Supabase download error:', error);
                throw new Error('Failed to retrieve file');
            }

            if (!data) {
                throw new NotFoundError('File not found in storage');
            }

            // Convert to buffer if needed
            const fileBuffer = data instanceof ArrayBuffer ? Buffer.from(data) : data;

            // Validate minimum file size for IV
            if (fileBuffer.length < 16) {
                throw new Error('Invalid file format');
            }

            // Extract IV and encrypted data
            const initializationVector = fileBuffer.slice(0, 16);
            const encryptedData = fileBuffer.slice(16);

            // Decrypt file
            const decipher = crypto.createDecipheriv(
                'aes-256-cbc', 
                Buffer.from(config.security.aesSecret, 'hex'), 
                initializationVector
            );

            const decrypted = Buffer.concat([
                decipher.update(encryptedData), 
                decipher.final()
            ]);

            // Mark file as used and delete from storage (atomic operation)
            await Promise.all([
                prisma.file.update({ 
                    where: { token }, 
                    data: { isUsed: true } 
                }),
                supabase.storage.from('files').remove([record.path])
            ]);

            // Set appropriate headers for file download
            const filename = record.originalName || 'document';
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
            res.setHeader('Content-Length', decrypted.length);
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');

            // Send decrypted file
            res.send(decrypted);
        })
    );

    return router;
};

export default createDownloadRouter;