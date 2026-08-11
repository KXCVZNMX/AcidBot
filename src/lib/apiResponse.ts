function extractErrorMessage(value: unknown): string | null {
    if (typeof value === 'string' && value.trim()) {
        return value;
    }

    if (!value || typeof value !== 'object') {
        return null;
    }

    const payload = value as Record<string, unknown>;
    return extractErrorMessage(payload.error) ?? extractErrorMessage(payload.message);
}

export async function getResponseError(response: Response): Promise<string> {
    const fallback = response.statusText || `Request failed with status ${response.status}`;
    let responseText: string;

    try {
        responseText = await response.text();
    } catch {
        return fallback;
    }

    if (!responseText.trim()) {
        return fallback;
    }

    try {
        return extractErrorMessage(JSON.parse(responseText)) ?? fallback;
    } catch {
        return responseText;
    }
}
