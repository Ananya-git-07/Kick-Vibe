import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Shoe } from "../../models/shoe.model.js";
import { User } from "../../models/user.model.js";

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected for seeding.");
    } catch (error) {
        console.error("MongoDB connection FAILED:", error);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        // Clear existing shoes
        await Shoe.deleteMany();
        console.log("Existing shoes deleted.");

        // Find an owner for the products. Products must have an owner.
        // We'll just pick the first user we find.
        const owner = await User.findOne();

        if (!owner) {
            console.error("\nERROR: No users found in the database.");
            console.error("Please create at least one user before seeding the products.");
            process.exit(1);
        }

        console.log(`\nProducts will be owned by: ${owner.email}`);

        // Read the JSON file
        const shoesData = JSON.parse(
            fs.readFileSync(path.resolve(process.cwd(), 'src/db/seeds/shoes.json'), 'utf-8')
        );

        // Add the owner to each shoe object
        const shoesWithOwner = shoesData.map(shoe => ({
            ...shoe,
            owner: owner._id,
        }));

        // Insert the new data
        await Shoe.insertMany(shoesWithOwner);
        console.log("\nSUCCESS: Data imported successfully!");
        process.exit();
    } catch (error) {
        console.error("Error during data import:", error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Shoe.deleteMany();
        console.log("SUCCESS: All shoe data destroyed!");
        process.exit();
    } catch (error) {
        console.error("Error during data destruction:", error);
        process.exit(1);
    }
};

// Connect to DB first, then decide what to do based on command line arguments
connectDB().then(() => {
    if (process.argv[2] === '--destroy') {
        destroyData();
    } else {
        importData();
    }
});