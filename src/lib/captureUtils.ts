import { toBlob, Options } from 'html-to-image';

/**
 * Captures a DOM element as a PNG Blob.
 *
 * Workarounds applied:
 * 1. Waits for every <img> inside the element to finish loading before
 *    capturing, so that the browser has painted all textures.
 * 2. Calls toBlob three times in sequence.  html-to-image serialises
 *    the DOM to an SVG <foreignObject> and draws it onto a canvas.
 *    Safari and mobile browsers often miss images on the first one or
 *    two calls because the internal resource-fetch cache is cold.
 *    Subsequent calls hit the warm cache and produce a complete image.
 */
export async function captureElementToBlob(
    element: HTMLElement,
    options: Options = {}
): Promise<Blob> {
    // Wait for every <img> inside the capture target to finish loading.
    const imgs = Array.from(element.querySelectorAll('img'));
    await Promise.all(
        imgs.map((img) => {
            // Already settled: either loaded successfully or failed.
            if (img.complete) {
                if (img.naturalWidth === 0) {
                    console.warn(
                        '[captureElementToBlob] Image already in error state:',
                        img.src
                    );
                }
                return Promise.resolve();
            }
            return new Promise<void>((resolve) => {
                img.addEventListener('load', () => resolve(), { once: true });
                img.addEventListener(
                    'error',
                    (e) => {
                        console.warn(
                            '[captureElementToBlob] Image failed to load:',
                            (e.target as HTMLImageElement).src
                        );
                        resolve();
                    },
                    { once: true }
                );
            });
        })
    );

    const captureOptions: Options = {
        cacheBust: true,
        includeQueryParams: true,
        pixelRatio: 2,
        ...options,
    };

    // Call toBlob multiple times so that html-to-image can fetch and cache
    // every external resource before the final, authoritative capture.
    // This is the standard workaround for Safari / mobile WebKit where the
    // SVG foreignObject rendering misses images on the first pass.
    await toBlob(element, captureOptions);
    await toBlob(element, captureOptions);
    const blob = await toBlob(element, captureOptions);

    if (!blob) {
        throw new Error('Failed to generate image blob');
    }

    return blob;
}
