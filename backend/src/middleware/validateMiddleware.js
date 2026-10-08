export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errorDetails = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      message: errorDetails[0]?.message || 'Input validation failed',
      errors: errorDetails,
    });
  }

  // Assign validated and sanitized data back to req.body
  req.body = result.data;
  next();
};
