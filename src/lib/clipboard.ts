/**
 * Clipboard utility for copying text with timeout management
 */

const COPY_TIMEOUT_MS = 2000; // Duration to show "copied" confirmation

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (_error) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

export function useCopyTimeout(onCopy: (value: boolean) => void): (text: string) => Promise<void> {
  return async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      onCopy(true);
      setTimeout(() => onCopy(false), COPY_TIMEOUT_MS);
    }
  };
}

export const COPY_TIMEOUT_MS_EXPORT = COPY_TIMEOUT_MS;
