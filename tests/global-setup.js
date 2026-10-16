/* Wait for the Jekyll server, which can take a while to build on first start */
export default async function globalSetup(config) {
    const baseURL = config.projects.find(project => project.use.baseURL).use.baseURL;
    const deadline = Date.now() + 180_000;
    let lastError = null;
    while (Date.now() < deadline) {
        try {
            const response = await fetch(new URL('js/app.js', baseURL));
            if (response.ok) {
                return;
            }
            lastError = new Error('HTTP ' + response.status);
        }
        catch (error) {
            lastError = error;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    throw new Error('Site not reachable at ' + baseURL + ': ' + lastError);
}
