/**
 * Mock configuration for testing the admin system
 * This file provides sample data for development and testing
 */

export const mockPopupConfig = {
  enabled: true,
  title: '特別優惠！',
  content: '立即註冊享有專屬優惠，錯過就要再等一年！',
  image: 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Special+Offer',
  imageAlt: '特別優惠圖片',
  buttonText: '立即註冊',
  buttonLink: 'https://example.com/register',
  buttonExternal: true,
  closeText: '關閉',
  size: 'md',
  delay: 3000,
};

export const mockCountdownConfig = {
  enabled: true,
  title: '限時優惠倒數',
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  backgroundColor: '#e53e3e',
  textColor: '#ffffff',
  buttonText: '搶購',
  buttonLink: 'https://example.com/sale',
  buttonExternal: true,
  buttonBg: '#ffffff',
  buttonColor: '#e53e3e',
  buttonHoverBg: '#f7fafc',
  closeable: true,
};

export const mockGlobalConfig = {
  popup: mockPopupConfig,
  countdown: mockCountdownConfig,
};