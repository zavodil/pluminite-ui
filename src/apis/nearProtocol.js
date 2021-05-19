import { Account } from 'near-api-js';

export const doesAccountExists = async (userId, connection) => {
  try {
    return !!(await new Account(connection, userId).state());
  } catch (error) {
    // console.error(error);
  }

  return false;
};
