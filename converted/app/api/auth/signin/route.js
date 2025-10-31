import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
export async function POST(request) {
  try {
    const {
      email,
      password
    } = await request.json();
    if (!email || !password) {
      return NextResponse.json({
        error: 'Email and password are required'
      }, {
        status: 400
      });
    }

    // Find user in database
    const user = await db.user.findUnique({
      where: {
        email
      }
    });
    if (!user || !user.password) {
      return NextResponse.json({
        error: 'Invalid credentials'
      }, {
        status: 401
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({
        error: 'Invalid credentials'
      }, {
        status: 401
      });
    }

    // Return user data without password
    const {
      password: _,
      ...userWithoutPassword
    } = user;
    return NextResponse.json({
      message: 'Sign in successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, {
      status: 500
    });
  }
}
