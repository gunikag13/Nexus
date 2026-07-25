import { getDashboard } from '../services/dashboardService.js'

export const getDashboardHandler = async (request, response, next) => {
  try {
    const dashboard = await getDashboard({ userId: request.user._id })

    return response.status(200).json({
      success: true,
      message: 'Dashboard fetched successfully.',
      data: dashboard,
    })
  } catch (error) {
    return next(error)
  }
}

