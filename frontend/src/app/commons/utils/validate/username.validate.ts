const EMAIL_REGEX = /^[\w.!#$%&'*+/=?^_`{|}~-]+@[\w-]+(\.[A-Za-z]{2,})+$/;
const PHONE_REGEX = /^(\+?\d{1,3})?[\s.-]?\d{9,11}$/;

export interface ValidateUsernameResult {
  success: boolean;
  type: "email" | "phone" | "unknown";
}

export function validateUsername(value?: string | null): ValidateUsernameResult {
  const input = value?.trim() ?? "";

  if (!input) {
    return { success: false, type: "unknown" };
  }

  if (EMAIL_REGEX.test(input)) {
    return { success: true, type: "email" };
  }

  if (PHONE_REGEX.test(input.replace(/\s+/g, ""))) {
    return { success: true, type: "phone" };
  }

  return { success: false, type: "unknown" };
}

export default validateUsername;
