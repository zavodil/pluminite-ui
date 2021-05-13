export const getUSDsFromNear = async (amount) => {
  let rate;

  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd`, {
      method: 'GET',
    });
    const data = await response.json();

    rate = data?.near?.usd;
  } catch (error) {
    console.error(error);
    return null;
  }

  return rate * amount;
};
