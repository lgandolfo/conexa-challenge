export const isValidPassword = (password: string) => {
  const regex = /^(?=.*[A-Z])(?=.*d).{8,}$/;
  return regex.test(password);
};
