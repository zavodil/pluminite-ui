import { Account } from 'near-api-js';

export const doesAccountExist = async (userId, connection) => {
  try {
    await new Account(connection, userId).state();
    return true;
  } catch (error) {
    const errorString = error.toString().toLowerCase();
    const nonexistentAccountErrors = ['does not exist while viewing', `account id ${userId.toLowerCase()} is invalid`];

    if (nonexistentAccountErrors.some((errorStringPart) => errorString.includes(errorStringPart))) {
      return false;
    }
    throw error;
  }
};
