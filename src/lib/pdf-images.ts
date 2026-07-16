export async function fetchAsBase64(url: string): Promise<string> {
    try {
        const absolute = url.startsWith('/') ? `${window.location.origin}${url}` : url;
        const res = await fetch(absolute);
        if (!res.ok) return '';
        const blob = await res.blob();
        return await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => resolve('');
            reader.readAsDataURL(blob);
        });
    } catch {
        return '';
    }
}

export async function prefetchPdfImages(
    logoSrc: string,
    gallery: string[]
): Promise<{ logo: string; gallery: string[] }> {
    const [logo, ...galleryResults] = await Promise.all([
        fetchAsBase64(logoSrc),
        ...gallery.map(fetchAsBase64),
    ]);
    return { logo, gallery: galleryResults };
}