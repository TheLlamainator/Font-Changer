document.addEventListener('DOMContentLoaded', () => {
  const fontInput = document.getElementById('fontInput');
  const fontToggle = document.getElementById('fontToggle');
  const status = document.getElementById('status');
  const fileInput = document.getElementById('fileInput');
  const dropZone = document.getElementById('dropZone');
  const fontFileName = document.getElementById('fontFileName');
  const preview = document.getElementById('preview');
  const fontSize = document.getElementById('fontSize');
  const fontSizeValue = document.getElementById('fontSizeValue');

  let currentFont = null;

  // Load saved settings
  chrome.storage.sync.get(['fontName', 'enabled', 'customFont', 'fontSize'], (result) => {
    fontInput.value = result.fontName || '';
    fontToggle.checked = result.enabled || false;
    updateStatus(result.enabled);
    
    if (result.customFont) {
      currentFont = result.customFont;
      fontFileName.textContent = 'Custom font loaded';
      applyCustomFont(result.customFont);
    }

    // Set text scale
    if (result.fontSize) {
      fontSize.value = result.fontSize;
      const scalePercent = Math.round((result.fontSize / 16) * 100);
      fontSizeValue.textContent = `${scalePercent}%`;
      preview.style.transform = `scale(${result.fontSize / 16})`;
    }
  });

  // Handle text scale changes
  fontSize.addEventListener('input', () => {
    const size = fontSize.value;
    const scalePercent = Math.round((size / 16) * 100);
    fontSizeValue.textContent = `${scalePercent}%`;
    preview.style.transform = `scale(${size / 16})`;
    
    chrome.storage.sync.set({ fontSize: size }, () => {
      if (fontToggle.checked) {
        updateFont();
      }
    });
  });

  // Handle file input change
  fileInput.addEventListener('change', handleFileSelect);

  // Handle drag and drop
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#2196F3';
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#ccc';
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#ccc';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  });

  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  }

  function handleFile(file) {
    if (!file.name.match(/\.(ttf|otf|woff|woff2)$/i)) {
      status.textContent = 'Please select a valid font file (.ttf, .otf, .woff, .woff2)';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const fontData = e.target.result;
      currentFont = {
        name: file.name.split('.')[0],
        data: fontData
      };
      
      fontFileName.textContent = file.name;
      chrome.storage.sync.set({ 
        customFont: currentFont,
        fontName: null // Clear system font selection
      }, () => {
        if (fontToggle.checked) {
          applyCustomFont(currentFont);
        }
      });
    };
    reader.readAsDataURL(file);
  }

  function applyCustomFont(font) {
    const fontFace = new FontFace(font.name, `url(${font.data})`);
    fontFace.load().then((loadedFace) => {
      document.fonts.add(loadedFace);
      preview.style.fontFamily = `"${font.name}", system-ui`;
      updateFont();
    }).catch((err) => {
      status.textContent = 'Error loading font: ' + err.message;
    });
  }

  // Save font name when input changes
  fontInput.addEventListener('change', () => {
    const fontName = fontInput.value.trim();
    chrome.storage.sync.set({ 
      fontName,
      customFont: null // Clear custom font
    }, () => {
      currentFont = null;
      fontFileName.textContent = '';
      if (fontToggle.checked) {
        updateFont();
      }
    });
  });

  // Handle toggle changes
  fontToggle.addEventListener('change', () => {
    const enabled = fontToggle.checked;
    chrome.storage.sync.set({ enabled }, () => {
      updateStatus(enabled);
      if (enabled) {
        updateFont();
      } else {
        removeFont();
      }
    });
  });

  function updateStatus(enabled) {
    status.textContent = enabled ? 'Font change is enabled' : 'Font change is disabled';
  }

  function updateFont() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.url.startsWith('http')) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }).then(() => {
          chrome.tabs.sendMessage(tab.id, {
            action: 'updateFont',
            fontName: currentFont ? currentFont.name : fontInput.value.trim(),
            customFont: currentFont,
            fontSize: fontSize.value
          });
        });
      }
    });
  }

  function removeFont() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.url.startsWith('http')) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }).then(() => {
          chrome.tabs.sendMessage(tab.id, { action: 'removeFont' });
        });
      }
    });
  }
}); 