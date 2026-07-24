import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const sendUnauthorized = (response, message) => {
  return response.status(401).json({
    success: false,
    message,
    data: {},
  })
}

export const protect = async (request, response, next) => {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return sendUnauthorized(response, 'Authentication token is required.')
  }

  const token = authorizationHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return sendUnauthorized(response, 'User not found.')
    }

    request.user = user
    return next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendUnauthorized(response, 'Authentication token has expired.')
    }

    return sendUnauthorized(response, 'Invalid authentication token.')
  }
}

