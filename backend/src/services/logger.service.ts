import fs from 'fs';
import path from 'path';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  stack?: string;
}

class LoggerService {
  private logLevel: LogLevel;
  private logToFile: boolean;
  private logDir: string;

  private readonly levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  constructor() {
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
    this.logToFile = process.env.NODE_ENV === 'production';
    this.logDir = path.join(process.cwd(), 'logs');

    if (this.logToFile && !fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.logLevel];
  }

  private formatMessage(entry: LogEntry): string {
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    const stackStr = entry.stack ? `\n${entry.stack}` : '';
    return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${contextStr}${stackStr}`;
  }

  private getColor(level: LogLevel): string {
    const colors: Record<LogLevel, string> = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m'  // Red
    };
    return colors[level];
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      stack: error?.stack
    };

    const formattedMessage = this.formatMessage(entry);

    // Console output with colors
    if (process.env.NODE_ENV !== 'production') {
      const reset = '\x1b[0m';
      console.log(`${this.getColor(level)}${formattedMessage}${reset}`);
    } else {
      console.log(formattedMessage);
    }

    // File output
    if (this.logToFile) {
      this.writeToFile(entry);
    }
  }

  private writeToFile(entry: LogEntry): void {
    const date = new Date().toISOString().split('T')[0];
    const filename = path.join(this.logDir, `${date}.log`);
    const line = JSON.stringify(entry) + '\n';

    fs.appendFile(filename, line, (err) => {
      if (err) {
        console.error('Failed to write to log file:', err);
      }
    });
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log('error', message, context, error);
  }

  // HTTP request logging
  request(method: string, url: string, statusCode: number, responseTime: number, userId?: string): void {
    this.info('HTTP Request', {
      method,
      url,
      statusCode,
      responseTime: `${responseTime}ms`,
      userId
    });
  }

  // Database query logging
  query(sql: string, duration: number): void {
    this.debug('Database Query', {
      sql: sql.substring(0, 200),
      duration: `${duration}ms`
    });
  }

  // Security event logging
  security(event: string, details: Record<string, any>): void {
    this.warn(`Security Event: ${event}`, details);
  }

  // Performance metrics
  metric(name: string, value: number, unit: string): void {
    this.info(`Metric: ${name}`, { value, unit });
  }
}

// Singleton instance
export const logger = new LoggerService();

// Express middleware for request logging
export const requestLogger = (req: any, res: any, next: any): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.request(
      req.method,
      req.originalUrl,
      res.statusCode,
      duration,
      req.userId
    );
  });

  next();
};

export default logger;
