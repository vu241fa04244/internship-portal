const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Error Details]:', err);
  }

  // Multer file upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const maxMb = (parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880) / (1024 * 1024);
      return res.status(400).json({
        success: false,
        message: `File size exceeds the limit of ${maxMb}MB. Please upload a smaller PDF.`,
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Resource not found with id of '${err.value}'`,
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    // Check if duplicate application
    if (err.keyPattern && err.keyPattern.internship && err.keyPattern.student) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted an application for this internship.',
      });
    }
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `Duplicate value entered for ${field}. Please use another value.`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Session token has expired. Please log in again.',
    });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'An unexpected server error occurred.',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};

module.exports = errorHandler;
