/**
 * FAQ 数据常量
 */
export interface FAQItem {
  key: string;
  question: string;
  answer: string;
}

export const FAQ_LIST: FAQItem[] = [
  {
    key: 'register',
    question: 'How to register an account?',
    answer:
      'Registering an account is very simple:\n\n1. Open the app and click the "Register" button\n2. Enter your mobile phone number and click "Get Verification Code"\n3. Enter the SMS verification code and set your login password\n4. Complete registration and log in to use all features\n\nIf you don\'t receive the verification code, please check if your phone is suspended or check your spam folder.',
  },
  {
    key: 'profile',
    question: 'How to edit personal information?',
    answer:
      'Steps to edit personal information:\n\n1. After logging in, go to the "Profile" page\n2. Click on your avatar or username to enter the profile page\n3. Click the "Edit Profile" button\n4. You can modify your nickname, avatar, bio and other information\n5. Click save after modification to take effect',
  },
  {
    key: 'password',
    question: 'What should I do if I forget my password?',
    answer:
      'If you forget your password, you can reset it through these steps:\n\n1. Click "Forgot Password" on the login page\n2. Enter the registered mobile phone number\n3. Get and enter the SMS verification code\n4. Set a new login password\n5. Log in again with the new password',
  },
  {
    key: 'contact',
    question: 'How to contact customer service?',
    answer:
      'You can contact our customer service through the following ways:\n\n1. Online Support: In the app, go to "Profile" → "Help & Feedback" → "Online Support"\n2. Email: support@example.com\n3. Working Hours: Monday to Sunday 9:00-18:00\n\nWe will reply to your question within 24 business hours.',
  },
  {
    key: 'about',
    question: 'About Us',
    answer:
      'We are a team dedicated to providing quality content discovery services, hoping to help users discover more interesting content through technology.\n\nWe continuously optimize the product experience and welcome your valuable suggestions. If you like our product, please share it with your friends.',
  },
];

export const CONTACT_INFO = {
  email: 'support@example.com',
  phone: '400-xxx-xxxx',
  workingHours: 'Monday to Sunday 9:00-18:00',
};

/**
 * 应用版本信息
 */
export const APP_VERSION = {
  version: '1.0.0',
  buildDate: '2024-01-01',
  updateDate: '2024-01-01',
};
