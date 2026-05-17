

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m'
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m'
  }
};

class Logger {
  private formatMessage(level: LogLevel, message: string, ..._args: unknown[]) {
    const timestamp = new Date().toISOString();
    const color = this.getLevelColor(level);
    const levelStr = `${color}[${level}]${colors.reset}`;
    const timeStr = `${colors.dim}${timestamp}${colors.reset}`;
    
    return `${timeStr} ${levelStr} ${message}`;
  }

  private getLevelColor(level: LogLevel) {
    switch (level) {
      case LogLevel.INFO: return colors.fg.blue;
      case LogLevel.WARN: return colors.fg.yellow;
      case LogLevel.ERROR: return colors.fg.red;
      case LogLevel.DEBUG: return colors.fg.magenta;
      default: return colors.fg.white;
    }
  }

  info(message: string, ...args: any[]) {
    console.log(this.formatMessage(LogLevel.INFO, message), ...args);
  }

  warn(message: string, ...args: any[]) {
    console.warn(this.formatMessage(LogLevel.WARN, message), ...args);
  }

  error(message: string, ...args: any[]) {
    console.error(this.formatMessage(LogLevel.ERROR, message), ...args);
  }

  debug(message: string, ...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage(LogLevel.DEBUG, message), ...args);
    }
  }
}

export const logger = new Logger();
