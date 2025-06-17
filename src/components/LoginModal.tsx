
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { User, Phone, QrCode } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
  language: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, language }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nickname: '',
    phone: '',
    password: ''
  });

  const translations = {
    en: {
      loginTitle: 'Welcome Back!',
      registerTitle: 'Join Our Community!',
      nickname: 'Nickname',
      phone: 'Phone Number',
      password: 'Password',
      loginButton: 'Login',
      registerButton: 'Register',
      switchToRegister: "Don't have an account? Register here",
      switchToLogin: 'Already have an account? Login here',
      nicknameHelp: 'Choose a friendly name for the community',
      phoneHelp: 'We use your phone number for login and connecting with friends',
      qrCodeInfo: 'After registration, you will get a personal QR code to connect with friends!'
    },
    zh: {
      loginTitle: '欢迎回来！',
      registerTitle: '加入我们的社区！',
      nickname: '昵称',
      phone: '电话号码',
      password: '密码',
      loginButton: '登录',
      registerButton: '注册',
      switchToRegister: '没有账户？点击这里注册',
      switchToLogin: '已有账户？点击这里登录',
      nicknameHelp: '为社区选择一个友好的名字',
      phoneHelp: '我们使用您的电话号码进行登录和与朋友连接',
      qrCodeInfo: '注册后，您将获得个人二维码来与朋友连接！'
    }
  };

  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate user creation/login
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      nickname: formData.nickname || 'Community Member',
      phone: formData.phone,
      points: isLogin ? 150 : 0, // Existing users have some points
      qrCode: `QR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };

    onLogin(user);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-red-600">
            {isLogin ? t.loginTitle : t.registerTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <Label htmlFor="nickname" className="text-lg font-medium">
                {t.nickname}
              </Label>
              <Input
                id="nickname"
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                className="mt-2 text-lg py-3"
                placeholder="Uncle Tan, Auntie Lim..."
                required={!isLogin}
              />
              <p className="text-sm text-gray-600 mt-1">{t.nicknameHelp}</p>
            </div>
          )}

          <div>
            <Label htmlFor="phone" className="text-lg font-medium">
              {t.phone}
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="mt-2 text-lg py-3"
              placeholder="8123 4567"
              required
            />
            <p className="text-sm text-gray-600 mt-1">{t.phoneHelp}</p>
          </div>

          <div>
            <Label htmlFor="password" className="text-lg font-medium">
              {t.password}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="mt-2 text-lg py-3"
              required
            />
          </div>

          {!isLogin && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">QR Code Feature</span>
                </div>
                <p className="text-sm text-blue-700">{t.qrCodeInfo}</p>
              </CardContent>
            </Card>
          )}

          <Button 
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold"
          >
            {isLogin ? t.loginButton : t.registerButton}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-600 hover:text-red-800 underline text-lg"
            >
              {isLogin ? t.switchToRegister : t.switchToLogin}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
