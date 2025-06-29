import express from "express";
import multer from "multer";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { config } from "./config.js";
import { asyncHandler } from "./middleware/error-handler.js";
import { validateFileUpload } from "./middleware/validation.js";

const router = express.Router();

// Configure multer with proper limits and validation
const upload = multer({
    limits: {
        fileSize: config.upload.maxFileSize,
        files: 1
    },
    fileFilter: (req, file, cb) => {
        // Validate file type
        if (config.upload.allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

// Factory function to create router with injected dependencies
const createUploadRouter = (supabase, prisma) => {
    router.post('/upload', 
        upload.single('file'), 
        validateFileUpload,
        asyncHandler(async (req, res) => {
            // Generate unique identifiers
            const fileId = uuidv4();
            const token = uuidv4();
            const fileName = `${fileId}.enc`;

            // Encrypt file with proper IV handling
            const initializationVector = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv(
                'aes-256-cbc', 
                Buffer.from(config.security.aesSecret, 'hex'), 
                initializationVector
            );

            // Encrypt the file buffer
            const encrypted = Buffer.concat([
                cipher.update(req.file.buffer), 
                cipher.final()
            ]);

            // Prepend IV to encrypted data for storage
            const encryptedWithIV = Buffer.concat([initializationVector, encrypted]);

            // Upload encrypted file to Supabase
            const { error: uploadError } = await supabase.storage
                .from('files')
                .upload(fileName, encryptedWithIV, {
                    contentType: 'application/octet-stream',
                    upsert: false
                });

            if (uploadError) {
                console.error('Supabase upload error:', uploadError);
                throw new Error('Failed to upload file to storage');
            }

            // Calculate expiration date
            const expiresAt = new Date(Date.now() + config.upload.expirationDays * 24 * 60 * 60 * 1000);

            // Create database record with additional metadata
            await prisma.file.create({
                data: {
                    token,
                    path: fileName,
                    expiresAt,
                    originalName: req.file.originalname,
                    fileSize: req.file.size,
                    mimeType: req.file.mimetype,
                    uploadedAt: new Date()
                }
            });

            // Generate secure download link
            const downloadUrl = `${req.protocol}://${req.get('host')}/api/download/${token}`;

            // Return success response with metadata
            res.status(201).json({
                success: true,
                link: downloadUrl,
                token: token,
                expiresAt: expiresAt.toISOString(),
                fileInfo: {
                    originalName: req.file.originalname,
                    size: req.file.size,
                    type: req.file.mimetype
                }
            });
        })
    );

    return router;
};

export default createUploadRouter;