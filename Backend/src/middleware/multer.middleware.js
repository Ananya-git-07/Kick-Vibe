import multer from "multer";

// We are configuring Multer to use disk storage. This means it will save uploaded files
// to a temporary folder on the server's local disk before we process them.
const storage = multer.diskStorage({
    // 'destination' is a function that tells Multer where to save the files.
    destination: function (req, file, cb) {
        // We specify the destination folder. Make sure this folder exists.
        // According to our project structure, it should be 'src/public/temp'.
        cb(null, "./src/public/temp")
    },
    // 'filename' is a function that determines the name of the file inside the destination folder.
    filename: function (req, file, cb) {
        // To avoid naming conflicts, it's a good practice to use a unique filename.
        // Here, we are keeping the original filename as provided by the client.
        // In a real-world, high-traffic application, you might add a unique prefix (like Date.now()).
        cb(null, file.originalname)
    }
})

// We export the configured Multer instance as 'upload'.
// This 'upload' can now be used as middleware in our routes to handle file uploads.
export const upload = multer({
    storage,
})