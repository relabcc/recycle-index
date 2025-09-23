/**
 * Upload Service - Supports multiple providers
 * Providers: Google Drive, Cloudflare R2, Local Server
 */

class UploadService {
  constructor(provider = 'googledrive', config = {}) {
    this.provider = provider;
    this.config = config;
  }

  /**
   * Upload file to the configured provider
   * @param {File} file - File to upload
   * @param {string} accessToken - OAuth access token
   * @returns {Promise<{success: boolean, url: string, filename: string}>}
   */
  async uploadFile(file, accessToken) {
    // Validate file
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    switch (this.provider) {
      case 'googledrive':
        return this.uploadToGoogleDrive(file, accessToken);
      case 'cloudflare':
        return this.uploadToCloudflare(file, accessToken);
      case 'local':
        return this.uploadToLocal(file, accessToken);
      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  /**
   * Validate file type and size
   */
  validateFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: '不支援的檔案格式' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: '檔案大小超過 5MB 限制' };
    }

    return { valid: true };
  }

  /**
   * Upload to Google Drive
   */
  async uploadToGoogleDrive(file, accessToken) {
    const metadata = {
      name: this.generateFilename(file.name),
      parents: [this.config.googleDriveFolderId || 'root'], // Upload to specific folder or root
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: form,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Google Drive upload failed: ${error.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();

    // Make file publicly viewable
    await this.makeGoogleDriveFilePublic(result.id, accessToken);

    // Generate public URL
    const publicUrl = `https://drive.google.com/uc?id=${result.id}`;

    return {
      success: true,
      url: publicUrl,
      filename: result.name,
      fileId: result.id,
    };
  }

  /**
   * Make Google Drive file publicly viewable
   */
  async makeGoogleDriveFilePublic(fileId, accessToken) {
    const permission = {
      role: 'reader',
      type: 'anyone',
    };

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(permission),
    });

    if (!response.ok) {
      console.warn('Failed to make file public, but upload succeeded');
    }
  }

  /**
   * Upload to Cloudflare R2 (existing implementation)
   */
  async uploadToCloudflare(file, accessToken) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Cloudflare upload failed');
    }

    return await response.json();
  }

  /**
   * Upload to local server (existing implementation)
   */
  async uploadToLocal(file, accessToken) {
    return this.uploadToCloudflare(file, accessToken); // Same API endpoint
  }

  /**
   * Generate unique filename
   */
  generateFilename(originalName) {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    const randomString = Math.random().toString(36).substring(2);
    return `admin-upload-${timestamp}-${randomString}.${extension}`;
  }

  /**
   * Get provider display name
   */
  getProviderName() {
    const providers = {
      googledrive: 'Google Drive',
      cloudflare: 'Cloudflare R2',
      local: '本地伺服器',
    };
    return providers[this.provider] || this.provider;
  }
}

// Factory function to create upload service
export const createUploadService = (provider, config = {}) => {
  return new UploadService(provider, config);
};

export default UploadService;