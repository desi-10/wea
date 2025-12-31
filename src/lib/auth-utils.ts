export const sanitizePassword = (value: string) =>
  value.replace(/\s/g, "").slice(0, 100);

// Hardcoded user object
export const HARDCODED_USER = {
  email: "user@example.com",
  passwordHash: "", // Will set dynamically
};

// Set password dynamically
export const setHardcodedUserPassword = async (password: string) => {
  HARDCODED_USER.passwordHash = password;
};
