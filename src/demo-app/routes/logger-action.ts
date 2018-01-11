import * as exp from 'express';
import { Logger } from '../../logger';

export class LoggerActionData {
  constructor(public action: string, public message: string) {
  }
}

const router: exp.Router = exp.Router();

router.get('/:action', function (req: exp.Request, res: exp.Response, next: exp.NextFunction) {

  const data = new LoggerActionData('', '');
  switch (req.params.action) {

    case 'error':
      data.action = 'error()';
      data.message = Logger.error(new Error(`Logger.error(new Error('message'))`));
      break;

    case 'error-string':
      data.action = 'error()';
      data.message = Logger.error(`Logger.error('message')`);
      break;

    case 'warning':
      data.action = 'warning()';
      data.message = Logger.warn(new Error(`Logger.warn(new Error('message'))`));
      break;

    case 'warning-string':
      data.action = 'warning()';
      data.message = Logger.warn(`Logger.warn('message')`);
      break;

    case 'info':
      data.action = 'info()';
      data.message = Logger.info(`Logger.info('message')`);
      break;

    case 'debug':
      data.action = 'debug()';
      data.message = Logger.debug(`Logger.debug('message')`);
      break;

    default:
      throw new Error(`unexpected logger action '${req.params.action}'`);
  }

  res.render('logger-action', data);
});

export const loggerAction: exp.Router = router;
