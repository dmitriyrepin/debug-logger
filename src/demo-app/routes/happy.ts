import * as exp from 'express';

const router: exp.Router = exp.Router();

router.get('/', function (req: exp.Request, res: exp.Response, next: exp.NextFunction) {
  res.render('happy', { message: 'Life is good and the sun is shining' });
});

export const happy: exp.Router = router;
