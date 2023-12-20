import { isNil } from 'lodash';

import { prisma } from '@app/prisma';

export async function hasAuth(userID: string) {
  const auth = await prisma.userAuthentication.findFirst({
    select: { id: true },
    where: { userID },
  });

  return !isNil(auth?.id);
}

export async function assertAuth(
  userID: string,
  errorMsg: string = 'User is not authenticated',
) {
  const isAuth = await hasAuth(userID);
  if (!isAuth) {
    throw new Error(errorMsg);
  }
}
