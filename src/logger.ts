import * as exp from 'express';
import * as Winston from 'winston';
import * as debug from 'debug';
const winston = require('winston');
const expressWinston = require('express-winston');
const LoggingWinstonTransport = require('@google-cloud/logging-winston');

const moduleName = 'debug-logger';
export class Logger {

  private static _theLogger: Logger;

  private readonly _routeInfoLoggingEnabled = debug.enabled(`${moduleName}:route-info`);
  private readonly _routeErrorLoggingEnabled = debug.enabled(`${moduleName}:route-error`);

  private readonly _errorDebugger = debug(`${moduleName}:error`);
  private readonly _warnDebugger = debug(`${moduleName}:warn`);
  private readonly _infoDebugger = debug(`${moduleName}:info`);
  private readonly _debugDebugger = debug(`${moduleName}:debug`);

  private _transportRequests: any;
  private _loggerRequests: Winston.LoggerInstance;
  private _transportMessages: any;
  private _loggerMessages: Winston.LoggerInstance;

  static get instance(): Logger {
    if (!Logger._theLogger) {
      const logger = new Logger();
      logger._transportRequests = new LoggingWinstonTransport({ logName: 'winston_requests' });
      logger._loggerRequests = new Winston.Logger({ transports: [logger._transportRequests], });
      logger._transportMessages = new LoggingWinstonTransport({ logName: 'winston_messages' });
      logger._loggerMessages = new Winston.Logger({ transports: [logger._transportMessages], });
      Logger._theLogger = logger;
    }
    return Logger._theLogger;
  }

  private static readonly ignoreRoute = function (req: exp.Request, res: exp.Response) {
    // Do not log GAE health checks
    return req.url.match(new RegExp('^/_ah/health'));
  };

  // Logger to capture all requests and output them to
  // the StackDriver if running on the GAE or to the console if running on a local host
  static get requestMiddleware(): exp.RequestHandler {
    if (!this.instance._routeInfoLoggingEnabled) {
      return (req: exp.Request, res: exp.Response, next: exp.NextFunction) => { next(); };
    }

    if (Logger.isGAE) {
      return expressWinston.logger({
        transports: [Logger.instance._transportRequests],
        statusLevels: true, // Use HTTP status codes for log levels: info(status<400)/warn(status<500)/error(status>=500))
        expressFormat: true,  // Use the default Express/morgan request formatting
        meta: true,  // Control whether to log the meta data about the request (default to true)
        ignoreRoute: Logger.ignoreRoute // Skip some log messages based on request and/or response
      });
    } else {
      return expressWinston.logger({
        transports: [new winston.transports.Console({ json: false, colorize: true })],
        expressFormat: true,
        meta: false,
      });
    }
  }

  // Logger to capture any top-level errors and output json diagnostic info to
  // the StackDriver if running on the GAE or to the console if running on a local host
  static get errorMiddleware(): exp.ErrorRequestHandler {
    if (!this.instance._routeErrorLoggingEnabled) {
      return (err: any, req: exp.Request, res: exp.Response, next: exp.NextFunction) => { next(err); };
    }

    if (Logger.isGAE) {
      return expressWinston.errorLogger({
        transports: [Logger.instance._transportRequests],
      });
    } else {
      return expressWinston.errorLogger({
        transports: [new winston.transports.Console({ json: true, colorize: true })],
      });
    }
  }

  static error(error: any): string {
    let errMsg: string | undefined;
    if (error) {
      if (typeof error === 'string') {
        errMsg = `${error}\n    *** stack trace is not available ***`;
      } else if (error.stack) {
        errMsg = error.stack;
      }
    }
    errMsg = errMsg || `error message and stack trace are unavailable`;

    const msg = `ERROR: ${errMsg}`;
    Logger.instance._errorDebugger(msg);
    Logger.instance._loggerMessages.error(msg);
    return msg;
  }

  static warn(error: any): string {
    let errMsg: string | undefined;
    if (error) {
      if (typeof error === 'string') {
        errMsg = error;
      } else {
        errMsg = error.message;
      }
    }
    errMsg = errMsg || 'no error message available';

    const msg = `WARNING: ${errMsg}`;
    Logger.instance._warnDebugger(msg);
    Logger.instance._loggerMessages.warn(msg);
    return msg;
  }

  static info(message: string): string {
    const infoMsg = message || 'empty info message';

    const msg = `INFO: ${infoMsg}`;
    Logger.instance._infoDebugger(msg);
    Logger.instance._loggerMessages.info(msg);
    return msg;
  }

  static debug(message: string): string {
    if (!message) { message = 'empty debug message'; }
    Logger.instance._debugDebugger(message);
    return message;
  }

  private static get isGAE(): boolean {
    return (process.env.GOOGLE_CLOUD_PROJECT);
  }
}
