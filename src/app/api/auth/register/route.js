import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/lib/models/Customer.js'
import Admin from '@/lib/models/Admin.js'

export async function POST(request) {
  try {
    const { name, email, password, role = 'customer' } = await request.json()
    
    console.log(`[Registration] Attempting to register user: ${email} as ${role}`)

    // Validation
    if (!name || !email || !password) {
      console.log(`[Registration] Missing required fields for: ${email}`)
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      console.log(`[Registration] Password too short for: ${email}`)
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log(`[Registration] Invalid email format: ${email}`)
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    await connectDB()
    console.log(`[Registration] Database connected`)

    // Check if user already exists in either collection
    const existingCustomer = await Customer.findOne({ email })
    const existingAdmin = await Admin.findOne({ email })

    if (existingCustomer || existingAdmin) {
      console.log(`[Registration] User already exists: ${email}`)
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    console.log(`[Registration] Password hashed for: ${email}`)

    // Create user based on role
    let newUser
    if (role === 'admin') {
      // Only allow admin creation if requested by existing admin (you can add auth check here)
      newUser = new Admin({
        name,
        email,
        password: hashedPassword,
        role: 'Admin'
      })
      await newUser.save()
      console.log(`[Registration] Admin created: ${email}`)
    } else {
      // Default to customer
      newUser = new Customer({
        name,
        email,
        password: hashedPassword,
        address: {
          street: '',
          city: '',
          country: 'New Zealand'
        }
      })
      await newUser.save()
      console.log(`[Registration] Customer created: ${email}`)
    }

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: role
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('[Registration] Error during registration:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}