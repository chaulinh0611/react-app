export async function copyTextToClipboard(text: string): Promise<boolean> {
    if (!text) return false;

    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return false;
    }

    const canUseNavigatorClipboard =
        typeof navigator !== 'undefined' &&
        !!navigator.clipboard?.writeText &&
        (window.isSecureContext ||
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1');

    if (canUseNavigatorClipboard) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Fall through to legacy copy approach.
        }
    }

    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, text.length);

        const copied = document.execCommand('copy');
        document.body.removeChild(textArea);

        return copied;
    } catch {
        return false;
    }
}
