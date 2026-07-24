import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'

const emailRegex = /^\S+@\S+\.\S+$/

const formatUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

const sendResponse = (response, statusCode, success, message, data = {}) => {
  return response.status(statusCode).json({
    success,
    message,
    data,
  })
}

const isJwtConfigured = () => Boolean(process.env.JWT_SECRET)

export const signup = async (request, response, next) => {
  try {
    const { name, email, password } = request.body

    if (!name || !email || !password) {
      return sendResponse(response, 400, false, 'Name, email, and password are required.')
    }

    if (!emailRegex.test(email)) {
      return sendResponse(response, 400, false, 'Enter a valid email address.')
    }

    if (password.length < 6) {
      return sendResponse(response, 400, false, 'Password must be at least 6 characters.')
    }

    if (!isJwtConfigured()) {
      return sendResponse(response, 500, false, 'JWT secret is not configured.')
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })

    if (existingUser) {
      return sendResponse(response, 409, false, 'An account with this email already exists.')
    }

    const user = await User.create({
      name: name.trim(),
      email,
      password,
    })
    const token = generateToken(user._id)

    return sendResponse(response, 201, true, 'Signup successful.', {
      user: formatUser(user),
      token,
    })
  } catch (error) {
    if (error.code === 11000) {
      return sendResponse(response, 409, false, 'An account with this email already exists.')
    }

    return next(error)
  }
}

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body

    if (!email || !password) {
      return sendResponse(response, 400, false, 'Email and password are required.')
    }

    if (!emailRegex.test(email)) {
      return sendResponse(response, 400, false, 'Enter a valid email address.')
    }

    if (!isJwtConfigured()) {
      return sendResponse(response, 500, false, 'JWT secret is not configured.')
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')

    if (!user) {
      return sendResponse(response, 404, false, 'User not found.')
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return sendResponse(response, 401, false, 'Invalid credentials.')
    }

    const token = generateToken(user._id)

    return sendResponse(response, 200, true, 'Login successful.', {
      user: formatUser(user),
      token,
    })
  } catch (error) {
    return next(error)
  }
}

export const getMe = async (request, response) => {
  return sendResponse(response, 200, true, 'Profile fetched successfully.', {
    user: formatUser(request.user),
  })
}

export const logout = async (_request, response) => {
  return sendResponse(response, 200, true, 'Logout successful.')
}
