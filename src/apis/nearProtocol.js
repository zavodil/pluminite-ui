import { Account } from 'near-api-js';

export const doesAccountExist = async (userId, connection) => {
  try {
    await new Account(connection, userId).state();
    return true;
  } catch (error) {
    if (error.toString().indexOf('does not exist while viewing') !== -1) {
      return false;
    }
    throw error;
  }
};
