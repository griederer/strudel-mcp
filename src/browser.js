/**
 * Browser Management Module
 *
 * Manages Puppeteer browser instance and page lifecycle
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Add stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

/**
 * Browser instance (singleton)
 */
let browser = null;
let page = null;

/**
 * Configuration
 */
const config = {
  url: process.env.STRUDEL_URL || 'https://strudel.cc',
  headless: process.env.HEADLESS !== 'false', // Default true
  width: parseInt(process.env.WINDOW_WIDTH) || 1280,
  height: parseInt(process.env.WINDOW_HEIGHT) || 720,
  debug: process.env.DEBUG === 'true',
};

/**
 * Launch browser instance
 *
 * @returns {Promise<Object>} Browser and page objects
 */
export async function launchBrowser() {
  if (browser && page) {
    // Reuse existing browser
    try {
      await page.evaluate(() => true); // Test if page is alive
      return { browser, page };
    } catch (error) {
      // Page is dead, relaunch
      if (config.debug) console.error('Page disconnected, relaunching...');
      browser = null;
      page = null;
    }
  }

  try {
    if (config.debug) console.error('Launching browser...');

    browser = await puppeteer.launch({
      headless: config.headless ? 'new' : false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--autoplay-policy=no-user-gesture-required',
        '--enable-features=WebAudioBypassOutputBuffering',
        '--disable-features=AudioServiceOutOfProcess',
        `--window-size=${config.width},${config.height}`,
      ],
      defaultViewport: {
        width: config.width,
        height: config.height,
      },
    });

    page = await browser.newPage();

    // Set user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Navigate to Strudel
    if (config.debug) console.error(`Navigating to ${config.url}...`);
    await page.goto(config.url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for editor to load
    await page.waitForSelector('.cm-editor', { timeout: 10000 });

    if (config.debug) console.error('Browser ready!');

    return { browser, page };
  } catch (error) {
    if (config.debug) console.error('Failed to launch browser:', error);
    throw new Error(`Browser launch failed: ${error.message}`);
  }
}

/**
 * Get current page instance
 *
 * @returns {Promise<Object>} Page object
 */
export async function getPage() {
  if (!page) {
    const result = await launchBrowser();
    return result.page;
  }
  return page;
}

/**
 * Close browser
 */
export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
    page = null;
    if (config.debug) console.error('Browser closed');
  }
}

/**
 * Restart browser (for recovery)
 */
export async function restartBrowser() {
  await closeBrowser();
  return await launchBrowser();
}

/**
 * Check if browser is alive
 */
export async function isBrowserAlive() {
  if (!browser || !page) return false;

  try {
    await page.evaluate(() => true);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get browser config
 */
export function getConfig() {
  return { ...config };
}
