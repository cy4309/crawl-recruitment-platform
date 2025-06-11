// 因vercel部屬上線serverless function後有免費次數限制，這裡防範過多的requests，如果是dev開發就無次數限制

const rateLimitMap = new Map();
const MAX_REQUESTS_PER_MINUTE = 30;
const WINDOW_TIME = 60 * 1000; // 1 分鐘

export function rateLimiter(req, res) {
  const ip =
    req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";

  const currentTime = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, startTime: currentTime };

  if (currentTime - entry.startTime < WINDOW_TIME) {
    if (entry.count >= MAX_REQUESTS_PER_MINUTE) {
      res.status(429).json({ error: "Too Many Requests" });
      return false;
    }
    entry.count += 1;
  } else {
    entry.count = 1;
    entry.startTime = currentTime;
  }

  rateLimitMap.set(ip, entry);
  return true;
}

// 清除過期 IP，避免 memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.startTime > 5 * 60 * 1000) {
      rateLimitMap.delete(ip);
    }
  }
}, 60 * 1000);
