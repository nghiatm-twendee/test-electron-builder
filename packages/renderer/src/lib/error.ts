export function getErrorMessage({
  error,
  defaultMsg = "An unknown error occur. Please try again.",
}: {
  error: unknown;
  defaultMsg?: string;
}): string {
  if (error instanceof Error) return error.message;
  return defaultMsg;
}
