import admin, { ServiceAccount } from 'firebase-admin';
import { NextFunction, Request, Response } from 'express';
import { NotAuthorizedError } from '../errorValidation/errors';
import * as firebaseServiceAccount from '../../../firebaseServiceAccount.json';


admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount as ServiceAccount)
})

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const err = new NotAuthorizedError();

  if (!req.headers.authorization) {
    return next(err)
  }

  const idToken = req.headers.authorization.substring(7);
  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      const uid = decodedToken.uid;
      req.body = {...req.body, userId: uid};
      next();
    })
    .catch(() => {
      next(err)
    })
}
