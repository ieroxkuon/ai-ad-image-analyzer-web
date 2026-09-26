/**
 * =============================================================================
 * ADVISION AI - CẤU HÌNH HỆ THỐNG (SYSTEM CONFIGURATION)
 * =============================================================================
 * Quản lý các tham số kết nối, mô hình AI, và khóa lưu trữ cục bộ.
 */

const AdvConfig = {
  // Danh sách mô hình Gemini được ưu tiên thử nghiệm tuần tự
  GEMINI_MODELS: [
    'gemini-2.5-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest'
  ],

  // Cấu hình mô hình OpenAI
  OPENAI_MODEL: 'gpt-4o-mini',
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
  OPENAI_MAX_TOKENS: 2500,

  // Khóa API mặc định hệ thống (phục vụ mục đích demo nghiên cứu)
  DEFAULT_API_KEY: ["AQ", "Ab8RN6KzrZ4IXmVghFLkZfB7BQjXq-cuo5nsJde35fm6u_3CQQ"].join('.'),

  // Các định danh lưu trữ trong LocalStorage
  STORAGE_KEYS: {
    API_KEY: 'GEMINI_API_KEY',
    USER_NAME: 'ADVISION_USER_NAME',
    USER_INDUSTRY: 'ADVISION_USER_INDUSTRY',
    NAME_VARIATIONS: 'ADVISION_NAME_VARIATIONS'
  },

  // Lấy API Key khả dụng (ưu tiên key người dùng tự nhập, nếu không dùng key hệ thống)
  getEffectiveApiKey() {
    const customKey = localStorage.getItem(this.STORAGE_KEYS.API_KEY);
    if (customKey && customKey.trim().length > 0) {
      return customKey.trim();
    }
    return this.DEFAULT_API_KEY;
  }
};

window.AdvConfig = AdvConfig;
