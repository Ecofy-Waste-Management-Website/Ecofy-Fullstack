const SystemLog = require('../Model/SystemLog');

// Records completed API requests without storing request bodies or credentials.
const systemLogger = (req, res, next) => {
  res.on('finish', () => {
    // Reading the log must not create a new log entry on every refresh.
    if (req.originalUrl.startsWith('/admin/system-logs')) return;

    const actorId = req.auth?.userId || req.auth?.sessionClaims?.sub || '';
    SystemLog.create({
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      actorId,
      message: `${req.method} ${req.originalUrl} completed with status ${res.statusCode}`,
    }).catch((error) => console.error('Failed to write system log:', error.message));
  });

  next();
};

module.exports = { systemLogger };
