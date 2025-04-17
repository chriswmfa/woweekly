#!/usr/bin/env node

const { execSync } = require('child_process')
const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3')
const cloudFront = require('@aws-sdk/client-cloudfront')
const { CloudFrontClient, CreateInvalidationCommand } = cloudFront
const cloudFrontClient = new CloudFrontClient({ region: 'eu-west-1' })
const fs = require('fs')
const path = require('path')
const mime = require('mime-types')

// Configuration
const BUCKET_NAME = 'woweekly' // Replace with your bucket name
const DISTRIBUTION_ID = 'E4FTIMLJ0O9SG' // Optional: CloudFront distribution ID if you use CloudFront

// Build the application
console.log('🏗️  Building the application...')
try {
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Build completed successfully!')
} catch (error) {
  console.error('❌ Build failed:', error)
  process.exit(1)
}

// Initialize S3 client
const s3Client = new S3Client({
  region: 'eu-west-1' // AWS region where your bucket is located
})

// Function to recursively get all files in a directory
function getAllFiles (dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
    } else {
      arrayOfFiles.push(filePath)
    }
  })

  return arrayOfFiles
}

async function clearBucket () {
  console.log(`🧹 Clearing existing files from S3 bucket: ${BUCKET_NAME}...`)

  try {
    // List all objects in the bucket
    const listCommand = new ListObjectsV2Command({ Bucket: BUCKET_NAME })
    const { Contents } = await s3Client.send(listCommand)

    if (Contents && Contents.length > 0) {
      // Create an array of objects to delete
      const objectsToDelete = Contents.map(({ Key }) => ({ Key }))

      // Delete the objects
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: BUCKET_NAME,
        Delete: { Objects: objectsToDelete }
      })

      await s3Client.send(deleteCommand)
      console.log(`✅ Successfully cleared ${objectsToDelete.length} files from the bucket.`)
    } else {
      console.log('ℹ️  Bucket is already empty.')
    }
  } catch (error) {
    console.error('❌ Error clearing bucket:', error)
    throw error
  }
}

async function uploadDirectory () {
  try {
    // Clear existing files
    await clearBucket()

    console.log(`📤 Uploading files to S3 bucket: ${BUCKET_NAME}...`)
    const distPath = path.join(__dirname, '..', 'dist')
    const allFiles = getAllFiles(distPath)

    let uploadedCount = 0
    const totalFiles = allFiles.length

    for (const filePath of allFiles) {
      const fileContent = fs.readFileSync(filePath)
      const relativeFilePath = filePath.replace(distPath + path.sep, '')
      // Convert Windows backslashes to forward slashes for S3 keys
      const s3Key = relativeFilePath.split(path.sep).join('/')

      const contentType = mime.lookup(filePath) || 'application/octet-stream'

      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: fileContent,
        ContentType: contentType
      }

      // Add cache control for different file types
      if (s3Key.match(/\.(js|css)$/)) {
        uploadParams.CacheControl = 'max-age=31536000' // 1 year for static assets
      } else if (s3Key.match(/\.(html)$/)) {
        uploadParams.CacheControl = 'no-cache' // No caching for HTML
      } else if (s3Key.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
        uploadParams.CacheControl = 'max-age=604800' // 1 week for images
      }

      await s3Client.send(new PutObjectCommand(uploadParams))
      uploadedCount++

      // Log progress
      if (uploadedCount % 10 === 0 || uploadedCount === totalFiles) {
        console.log(`Uploaded ${uploadedCount}/${totalFiles} files...`)
      }
    }

    console.log(`✅ Successfully uploaded ${uploadedCount} files to ${BUCKET_NAME}.`)

    // Invalidate CloudFront cache if distribution ID is provided
    if (DISTRIBUTION_ID) {
      console.log(`🔄 Invalidating CloudFront distribution: ${DISTRIBUTION_ID}...`)

      const invalidationParams = {
        DistributionId: DISTRIBUTION_ID,
        InvalidationBatch: {
          CallerReference: `invalidate-${Date.now()}`,
          Paths: {
            Quantity: 1,
            Items: ['/*']
          }
        }
      }
      await cloudFrontClient.send(new CreateInvalidationCommand(invalidationParams))
      console.log('✅ CloudFront cache invalidated successfully!')
    }

    console.log('🚀 Deployment completed successfully!')
  } catch (error) {
    console.error('❌ Deployment failed:', error)
    process.exit(1)
  }
}

// Execute the deployment
uploadDirectory()
