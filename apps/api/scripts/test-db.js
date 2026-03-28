const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// FIX: Explicitly point to apps/api/.env
// __dirname is 'apps/api/scripts', so we go up one level
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log(`📂 Loading .env from: ${envPath}`);
console.log("---------------------------------------------------");

const uri = process.env.MONGO_URI;

// Safety Check: Hide the password in logs
const maskedUri = uri ? uri.replace(/:([^:@]+)@/, ':****@') : "undefined";
console.log(`🔌 Connection String: ${maskedUri}`);

if (!uri) {
    console.error("❌ ERROR: MONGO_URI is still undefined.");
    console.error("👉 Action: Check if the file is named '.env' and not '.env.txt'");
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => {
        console.log("✅ SUCCESS: MongoDB is reachable!");
        console.log("   Network Access is OPEN.");
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ CONNECTION FAILED:");
        console.error(err.message);
        if (err.message.includes('buffering timed out')) {
             console.log("\n👉 CAUSE: IP Address Blocked."); 
             console.log("👉 FIX: Go to Atlas > Security > Network Access > Add IP > Allow Anywhere (0.0.0.0/0)");
        }
        process.exit(1);
    });
