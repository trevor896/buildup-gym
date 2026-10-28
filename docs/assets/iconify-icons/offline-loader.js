(() => {
    const script = document.currentScript;
    const IconifyIcon = customElements.get('iconify-icon');

    if (!script || !IconifyIcon) {
        throw new Error('Iconify runtime must load before its offline loader.');
    }

    const baseUrl = new URL('.', script.src);
    const collections = new Map();

    function loadCollection(prefix) {
        if (!collections.has(prefix)) {
            const url = new URL(`data/json/${encodeURIComponent(prefix)}.json`, baseUrl);
            collections.set(prefix, fetch(url).then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load local Iconify collection "${prefix}": ${response.status}`);
                }
                return response.json();
            }));
        }
        return collections.get(prefix);
    }

    fetch(new URL('data/collections.json', baseUrl))
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load local Iconify collection index: ${response.status}`);
            }
            return response.json();
        })
        .then(index => {
            // These sets are packaged but omitted from collections.json.
            const prefixes = new Set([
                ...Object.keys(index),
                'bubbles',
                'devicon-line',
                'devicon-original',
                'emblemicons',
                'streamline-guidance'
            ]);
            prefixes.forEach(prefix => {
                IconifyIcon.setCustomIconsLoader((_icons, collectionPrefix) => loadCollection(collectionPrefix), prefix);
            });
        })
        .catch(error => console.error('Could not initialize local Iconify icon data.', error));
})();
