import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the temp directory path
const tempDir = path.join(__dirname, "../public/temp");

// Ensure the temp directory exists, create it if it doesn't
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// We are configuring Multer to use disk storage. This means it will save uploaded files
// to a temporary folder on the server's local disk before we process them.
const storage = multer.diskStorage({
    // 'destination' is a function that tells Multer where to save the files.
    destination: function (req, file, cb) {
        // We specify the destination folder and ensure it exists.
        cb(null, tempDir);
    },
    // 'filename' is a function that determines the name of the file inside the destination folder.
    filename: function (req, file, cb) {
        // To avoid naming conflicts, add a timestamp to the filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
})

// We export the configured Multer instance as 'upload'.
// This 'upload' can now be used as middleware in our routes to handle file uploads.
export const upload = multer({
    storage,
})