'use client';
import React from 'react';


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Eye, EyeOff } from 'lucide-react';
export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/feed');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "w-full max-w-md"
  }, /*#__PURE__*/React.createElement(CardHeader, {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(Brain, {
    className: "w-7 h-7 text-white"
  }))), /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-2xl"
  }, "Welcome Back"), /*#__PURE__*/React.createElement(CardDescription, null, "Sign in to your AcademiQ account")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, error && /*#__PURE__*/React.createElement(Alert, {
    variant: "destructive"
  }, /*#__PURE__*/React.createElement(AlertDescription, null, error)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "email"
  }, "Email"), /*#__PURE__*/React.createElement(Input, {
    id: "email",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    value: formData.email,
    onChange: handleChange,
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "password"
  }, "Password"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "password",
    name: "password",
    type: showPassword ? 'text' : 'password',
    placeholder: "Enter your password",
    value: formData.password,
    onChange: handleChange,
    required: true
  }), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "ghost",
    size: "sm",
    className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
    onClick: () => setShowPassword(!showPassword)
  }, showPassword ? /*#__PURE__*/React.createElement(EyeOff, {
    className: "h-4 w-4"
  }) : /*#__PURE__*/React.createElement(Eye, {
    className: "h-4 w-4"
  })))), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    className: "w-full",
    disabled: loading
  }, loading ? 'Signing in...' : 'Sign In')), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 text-center text-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-600"
  }, "Don't have an account? "), /*#__PURE__*/React.createElement(Link, {
    href: "/auth/register",
    className: "text-blue-600 hover:underline"
  }, "Sign up")))));
}

