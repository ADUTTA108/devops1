import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.S3_REGION || "us-east-1",
    endpoint: process.env.S3_ENDPOINT || "http://localhost:9000",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "minioadmin",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "minioadmin",
    },
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
});

const uploadTestFile = async (fileId: number) => {
    const key = `downloads/${fileId}.zip`;
    const content = `Test file content for file ID ${fileId}\nGenerated at: ${new Date().toISOString()}`;

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME || "downloads",
        Key: key,
        Body: Buffer.from(content),
        ContentType: "application/zip",
    });

    try {
        await s3Client.send(command);
        console.log(`✅ Uploaded: ${key} (${Buffer.from(content).length} bytes)`);
    } catch (error) {
        console.error(`❌ Failed to upload ${key}:`, error);
        throw error;
    }
};

const main = async () => {
    console.log("🚀 Starting test file upload...");
    console.log(`📦 S3 Endpoint: ${process.env.S3_ENDPOINT}`);
    console.log(`🪣 Bucket: ${process.env.S3_BUCKET_NAME}\n`);

    // Upload test files for common file IDs
    const testFileIds = [70000, 70001, 70002, 70003, 70004];

    for (const fileId of testFileIds) {
        await uploadTestFile(fileId);
    }

    console.log("\n✅ All test files uploaded successfully!");
    s3Client.destroy();
};

main().catch((error) => {
    console.error("❌ Upload failed:", error);
    process.exit(1);
});
