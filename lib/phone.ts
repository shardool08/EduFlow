export function toE164IndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return "+91" + digits;
  if (digits.startsWith("91") && digits.length === 12) return "+" + digits;
  if (phone.startsWith("+")) return phone;
  return "+91" + digits.slice(-10);
}
