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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Eye, EyeOff } from 'lucide-react';
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    userType: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const departments = ['Computer Science and Engineering', 'Electronics and Communication', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Information Science', 'Artificial Intelligence', 'Data Science', 'Biotechnology'];
  const userTypes = ['Faculty', 'Student'];
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!formData.name || !formData.email || !formData.password || !formData.department || !formData.userType) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    try {
      const {
        confirmPassword,
        ...submitData
      } = formData;
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });
      const data = await response.json();
      if (response.ok) {
        router.push('/auth/signin?message=Registration successful. Please sign in.');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "w-full max-w-2xl"
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
  }, "Create Account"), /*#__PURE__*/React.createElement(CardDescription, null, "Join AcademiQ to showcase your research")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, error && /*#__PURE__*/React.createElement(Alert, {
    variant: "destructive"
  }, /*#__PURE__*/React.createElement(AlertDescription, null, error)), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "name"
  }, "Full Name"), /*#__PURE__*/React.createElement(Input, {
    id: "name",
    name: "name",
    type: "text",
    placeholder: "Dr. John Doe",
    value: formData.name,
    onChange: handleChange,
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "email"
  }, "Email"), /*#__PURE__*/React.createElement(Input, {
    id: "email",
    name: "email",
    type: "email",
    placeholder: "john.doe@university.edu",
    value: formData.email,
    onChange: handleChange,
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "password"
  }, "Password"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "password",
    name: "password",
    type: showPassword ? 'text' : 'password',
    placeholder: "Enter password",
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
  })))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "confirmPassword"
  }, "Confirm Password"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "confirmPassword",
    name: "confirmPassword",
    type: showConfirmPassword ? 'text' : 'password',
    placeholder: "Confirm password",
    value: formData.confirmPassword,
    onChange: handleChange,
    required: true
  }), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "ghost",
    size: "sm",
    className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
    onClick: () => setShowConfirmPassword(!showConfirmPassword)
  }, showConfirmPassword ? /*#__PURE__*/React.createElement(EyeOff, {
    className: "h-4 w-4"
  }) : /*#__PURE__*/React.createElement(Eye, {
    className: "h-4 w-4"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "department"
  }, "Department"), /*#__PURE__*/React.createElement(Select, {
    onValueChange: value => handleSelectChange('department', value)
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Select department"
  })), /*#__PURE__*/React.createElement(SelectContent, null, departments.map(dept => /*#__PURE__*/React.createElement(SelectItem, {
    key: dept,
    value: dept
  }, dept))))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "userType"
  }, "User Type"), /*#__PURE__*/React.createElement(Select, {
    onValueChange: value => handleSelectChange('userType', value)
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Select user type"
  })), /*#__PURE__*/React.createElement(SelectContent, null, userTypes.map(type => /*#__PURE__*/React.createElement(SelectItem, {
    key: type,
    value: type
  }, type)))))), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    className: "w-full",
    disabled: loading
  }, loading ? 'Creating Account...' : 'Create Account')), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 text-center text-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-600"
  }, "Already have an account? "), /*#__PURE__*/React.createElement(Link, {
    href: "/auth/signin",
    className: "text-blue-600 hover:underline"
  }, "Sign in")))));
}

