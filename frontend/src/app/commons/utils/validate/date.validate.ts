import { parse, isValid, isAfter, isBefore, isEqual } from "date-fns";

export interface DateValidationResult {
  success: boolean;
  message?: string;
}

/**
 * Validates that a date string is in valid format (yyyy-MM-dd)
 */
export function validateDateFormat(dateString?: string): DateValidationResult {
  if (!dateString) {
    return { success: true }; // Empty dates are allowed
  }

  const date = parse(dateString, "yyyy-MM-dd", new Date());

  if (!isValid(date)) {
    return {
      success: false,
      message: "Ngày không hợp lệ",
    };
  }

  return { success: true };
}

/**
 * Validates that startDate is before or equal to endDate
 */
export function validateDateRange(startDate?: string, endDate?: string): DateValidationResult {
  // If either date is empty, validation passes
  if (!startDate || !endDate) {
    return { success: true };
  }

  const startDateObj = parse(startDate, "yyyy-MM-dd", new Date());
  const endDateObj = parse(endDate, "yyyy-MM-dd", new Date());

  // Check if dates are valid
  if (!isValid(startDateObj) || !isValid(endDateObj)) {
    return {
      success: false,
      message: "Ngày không hợp lệ",
    };
  }

  // Check if start date is after end date
  if (isAfter(startDateObj, endDateObj)) {
    return {
      success: false,
      message: "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc",
    };
  }

  return { success: true };
}

/**
 * Validates that a date is not in the future
 */
export function validateDateNotFuture(dateString?: string): DateValidationResult {
  if (!dateString) {
    return { success: true };
  }

  const date = parse(dateString, "yyyy-MM-dd", new Date());
  const today = new Date();

  if (!isValid(date)) {
    return {
      success: false,
      message: "Ngày không hợp lệ",
    };
  }

  if (isAfter(date, today)) {
    return {
      success: false,
      message: "Ngày không được lớn hơn ngày hiện tại",
    };
  }

  return { success: true };
}

/**
 * Validates that a date is not in the past
 */
export function validateDateNotPast(dateString?: string): DateValidationResult {
  if (!dateString) {
    return { success: true };
  }

  const date = parse(dateString, "yyyy-MM-dd", new Date());
  const today = new Date();

  if (!isValid(date)) {
    return {
      success: false,
      message: "Ngày không hợp lệ",
    };
  }

  if (isBefore(date, today) && !isEqual(date, today)) {
    return {
      success: false,
      message: "Ngày không được nhỏ hơn ngày hiện tại",
    };
  }

  return { success: true };
}
