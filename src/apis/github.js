export const getBlacklistedTokens = async () => {
  const response = await fetch('https://raw.githubusercontent.com/zavodil/pluminite-ui/moderation/blacklist.json');

  return response.json();
};
