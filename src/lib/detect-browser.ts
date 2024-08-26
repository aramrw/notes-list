// Define a type for the browser result
export interface BrowserInfo {
  name: BrowserName;
  version: string | null;
}

// Define a type for the possible browsers
export type BrowserName =
  | 'UCBrowser'
  | 'Edge'
  | 'GoogleBot'
  | 'Chromium'
  | 'Firefox'
  | 'Chrome'
  | 'Safari'
  | 'Opera'
  | 'IE'
  | 'unknown';

// Function to get the browser name and version
export const detectBrowser = (): BrowserInfo => {
  const userAgent = navigator.userAgent;
  let browser: BrowserName = 'unknown';
  let version: string | null = null;

  // Detect browser name
  if (/ucbrowser/i.test(userAgent)) {
    browser = 'UCBrowser';
  } else if (/edg/i.test(userAgent)) {
    browser = 'Edge';
  } else if (/googlebot/i.test(userAgent)) {
    browser = 'GoogleBot';
  } else if (/chromium/i.test(userAgent)) {
    browser = 'Chromium';
  } else if (/firefox|fxios/i.test(userAgent) && !/seamonkey/i.test(userAgent)) {
    browser = 'Firefox';
  } else if (/; msie|trident/i.test(userAgent) && !/ucbrowser/i.test(userAgent)) {
    browser = 'IE';
  } else if (/chrome|crios/i.test(userAgent) && !/opr|opera|chromium|edg|ucbrowser|googlebot/i.test(userAgent)) {
    browser = 'Chrome';
  } else if (/safari/i.test(userAgent) && !/chromium|edg|ucbrowser|chrome|crios|opr|opera|fxios|firefox/i.test(userAgent)) {
    browser = 'Safari';
  } else if (/opr|opera/i.test(userAgent)) {
    browser = 'Opera';
  }

  // Detect browser version
  switch (browser) {
    case 'UCBrowser':
      version = browserVersion(userAgent, /(ucbrowser)\/([\d\.]+)/i);
      break;
    case 'Edge':
      version = browserVersion(userAgent, /(edge|edga|edgios|edg)\/([\d\.]+)/i);
      break;
    case 'GoogleBot':
      version = browserVersion(userAgent, /(googlebot)\/([\d\.]+)/i);
      break;
    case 'Chromium':
      version = browserVersion(userAgent, /(chromium)\/([\d\.]+)/i);
      break;
    case 'Firefox':
      version = browserVersion(userAgent, /(firefox|fxios)\/([\d\.]+)/i);
      break;
    case 'Chrome':
      version = browserVersion(userAgent, /(chrome|crios)\/([\d\.]+)/i);
      break;
    case 'Safari':
      version = browserVersion(userAgent, /(safari)\/([\d\.]+)/i);
      break;
    case 'Opera':
      version = browserVersion(userAgent, /(opera|opr)\/([\d\.]+)/i);
      break;
    case 'IE': {
      const tridentVersion = browserVersion(userAgent, /(trident)\/([\d\.]+)/i);
      // IE version is mapped using Trident version
      // IE/8.0 = Trident/4.0, IE/9.0 = Trident/5.0
      version = tridentVersion ? `${parseFloat(tridentVersion) + 4.0}` : '7.0';
      break;
    }
    default:
      version = '0.0.0.0';
      break;
  }

  return { name: browser, version };
};

// Function to extract browser version using regex
const browserVersion = (userAgent: string, regex: RegExp): string | null => {
  const match = userAgent.match(regex);
  return match ? match[2] : null;
}

