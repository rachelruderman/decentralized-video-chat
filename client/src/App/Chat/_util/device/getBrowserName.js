// Get name of browser session using user agent
export const getBrowserName = () => {
    const { userAgent } = window.navigator;

    if (userAgent.includes('MSIE')) {
        return 'Unknown';
    }

    const browsers = [
        'Firefox',
        'Opera',
        'Chrome',
        'Safari'
    ];

    return browsers.find(browser => userAgent.includes(browser)) || 'Unknown';
}