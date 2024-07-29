import { Storage } from 'aws-amplify';

export async function s3Upload(file: File, filename: string) {
  try {
    const stored = await Storage.vault.put(filename, file, {
      contentType: file.type,
      acl: 'public-read', // Ensure public read access
    });

    console.log(filename, stored.key);
    return stored.key;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed');
  }
}

export async function s3Download(key: string) {
  try {
    const fileUrl = await Storage.vault.get(key);
    return fileUrl;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('File download failed');
  }
}
