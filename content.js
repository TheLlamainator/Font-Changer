// Create a style element for font injection
const styleElement = document.createElement('style');
document.head.appendChild(styleElement);

// Create a MutationObserver to handle dynamic content
const observer = new MutationObserver((mutations) => {
  chrome.storage.sync.get(['fontName', 'enabled', 'customFont', 'fontSize'], (result) => {
    if (result.enabled) {
      if (result.customFont) {
        applyCustomFont(result.customFont, result.fontSize);
      } else if (result.fontName) {
        applySystemFont(result.fontName, result.fontSize);
      }
    }
  });
});

// Start observing the document with the configured parameters
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateFont') {
    if (request.customFont) {
      applyCustomFont(request.customFont, request.fontSize);
    } else {
      applySystemFont(request.fontName, request.fontSize);
    }
  } else if (request.action === 'removeFont') {
    removeFont();
  }
});

// Check if font change should be applied on page load
chrome.storage.sync.get(['fontName', 'enabled', 'customFont', 'fontSize'], (result) => {
  if (result.enabled) {
    if (result.customFont) {
      applyCustomFont(result.customFont, result.fontSize);
    } else if (result.fontName) {
      applySystemFont(result.fontName, result.fontSize);
    }
  }
});

function applyCustomFont(font, fontSize) {
  if (!font) return;
  
  // Create and load the custom font
  const fontFace = new FontFace(font.name, `url(${font.data})`);
  fontFace.load().then((loadedFace) => {
    document.fonts.add(loadedFace);
    
    // Create CSS rule to override all font-family declarations and font size
    const css = `
      * {
        font-family: "${font.name}", system-ui, -apple-system, sans-serif !important;
      }
      body, p, div, span, a, li, td, th, input, textarea, button, label, h1, h2, h3, h4, h5, h6 {
        font-size: ${fontSize}px !important;
      }
      /* Force font changes on dynamic content */
      [style*="font-family"], [style*="font-size"] {
        font-family: "${font.name}", system-ui, -apple-system, sans-serif !important;
        font-size: ${fontSize}px !important;
      }
    `;
    
    styleElement.textContent = css;

    // Force a reflow to ensure styles are applied
    document.body.style.display = 'none';
    document.body.offsetHeight; // Force reflow
    document.body.style.display = '';
  }).catch((err) => {
    console.error('Error loading custom font:', err);
  });
}

function applySystemFont(fontName, fontSize) {
  if (!fontName) return;
  
  // Create CSS rule to override all font-family declarations and font size
  const css = `
    * {
      font-family: "${fontName}", system-ui, -apple-system, sans-serif !important;
    }
    body, p, div, span, a, li, td, th, input, textarea, button, label, h1, h2, h3, h4, h5, h6 {
      font-size: ${fontSize}px !important;
    }
    /* Force font changes on dynamic content */
    [style*="font-family"], [style*="font-size"] {
      font-family: "${fontName}", system-ui, -apple-system, sans-serif !important;
      font-size: ${fontSize}px !important;
    }
  `;
  
  styleElement.textContent = css;

  // Force a reflow to ensure styles are applied
  document.body.style.display = 'none';
  document.body.offsetHeight; // Force reflow
  document.body.style.display = '';
}

function removeFont() {
  styleElement.textContent = '';
  observer.disconnect();
} 