'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import logo from '@/components/logo.png';
import { Home, Users, TrendingUp, BarChart3, User, LogOut, Menu, X } from 'lucide-react';
export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };
  const navigation = [{
    name: 'Feed',
    href: '/feed',
    icon: Home
  }, {
    name: 'Faculty',
    href: '/faculty',
    icon: Users
  }, {
    name: 'Rankings',
    href: '/rankings',
    icon: TrendingUp
  }, {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3
  }, {
    name: 'Profile',
    href: '/profile',
    icon: User
  }];
  return /*#__PURE__*/React.createElement("nav", {
    className: "bg-white border-b border-gray-200 sticky top-0 z-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center h-16"
  }, /*#__PURE__*/React.createElement(Link, {
    href: "/feed",
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Image, {
    src: logo,
    alt: "AcademiQ",
    className: "h-16 w-auto",
    priority: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "hidden md:flex items-center space-x-6"
  }, navigation.map(item => {
    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return /*#__PURE__*/React.createElement(Link, {
      key: item.name,
      href: item.href,
      className: `flex items-center space-x-2 transition-colors ${active ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'}`
    }, /*#__PURE__*/React.createElement(item.icon, {
      className: "w-4 h-4"
    }), /*#__PURE__*/React.createElement("span", null, item.name));
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, user ? /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownMenuTrigger, {
    asChild: true
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    className: "relative h-8 w-8 rounded-full"
  }, /*#__PURE__*/React.createElement(Avatar, {
    className: "h-8 w-8"
  }, /*#__PURE__*/React.createElement(AvatarImage, {
    src: user.profileImage,
    alt: user.name
  }), /*#__PURE__*/React.createElement(AvatarFallback, null, user.name.split(' ').map(n => n[0]).join('').toUpperCase())))), /*#__PURE__*/React.createElement(DropdownMenuContent, {
    className: "w-56",
    align: "end",
    forceMount: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-start gap-2 p-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col space-y-1 leading-none"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-medium"
  }, user.name), /*#__PURE__*/React.createElement("p", {
    className: "w-[200px] truncate text-sm text-muted-foreground"
  }, user.email))), /*#__PURE__*/React.createElement(DropdownMenuSeparator, null), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    asChild: true
  }, /*#__PURE__*/React.createElement(Link, {
    href: "/profile",
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(User, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "Profile"))), /*#__PURE__*/React.createElement(DropdownMenuSeparator, null), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: handleLogout,
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(LogOut, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "Log out")))) : /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Link, {
    href: "/auth/signin"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm"
  }, "Sign In")), /*#__PURE__*/React.createElement(Link, {
    href: "/auth/register"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm"
  }, "Get Started"))), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    className: "md:hidden",
    onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen)
  }, isMobileMenuOpen ? /*#__PURE__*/React.createElement(X, {
    className: "h-6 w-6"
  }) : /*#__PURE__*/React.createElement(Menu, {
    className: "h-6 w-6"
  })))), isMobileMenuOpen && /*#__PURE__*/React.createElement("div", {
    className: "md:hidden border-t border-gray-200 py-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col space-y-3"
  }, navigation.map(item => {
    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return /*#__PURE__*/React.createElement(Link, {
      key: item.name,
      href: item.href,
      className: `flex items-center space-x-2 px-2 py-2 transition-colors ${active ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'}`,
      onClick: () => setIsMobileMenuOpen(false)
    }, /*#__PURE__*/React.createElement(item.icon, {
      className: "w-4 h-4"
    }), /*#__PURE__*/React.createElement("span", null, item.name));
  })))));
}
