# Font Changer Chrome Extension

A Chrome extension that allows you to change the font and font size of any website. You can either use system fonts or upload your own custom fonts.

## Features

- Change website fonts to any locally installed font
- Upload and use custom fonts (.ttf, .otf, .woff, .woff2)
- Adjust font size for better readability
- Simple toggle to enable/disable font changes
- Works on all websites
- Clean and minimal user interface
- Persists your font and size preferences

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

### Using System Fonts
1. Click the extension icon in your browser toolbar
2. Enter the name of a font installed on your system (e.g., "Georgia", "Arial", "Times New Roman")
3. Adjust the font size using the slider
4. Toggle the switch to enable/disable the font change

### Using Custom Fonts
1. Click the extension icon in your browser toolbar
2. Click the upload area or drag and drop your font file
3. Supported formats: .ttf, .otf, .woff, .woff2
4. Adjust the font size using the slider
5. Toggle the switch to enable/disable the font change

## Features in Detail

### Font Selection
- Use any system font by typing its name
- Upload custom fonts in various formats
- Preview the font before applying
- Switch between system and custom fonts easily

### Font Size Control
- Adjust font size from 8px to 32px
- Real-time preview of size changes
- Applies to all text elements on the page
- Maintains website layout and formatting

### Persistence
- Saves your font preferences
- Remembers your font size settings
- Maintains settings across browser sessions
- Works automatically on page load

## Technical Details

The extension uses:
- Chrome Extension Manifest V3
- Content Scripts for font injection
- Chrome Storage API for settings persistence
- Font Face API for custom font loading
- CSS for font and size modifications

## File Structure
```
fontchange/
├── manifest.json      # Extension configuration
├── popup.html        # Extension popup interface
├── popup.js          # Popup functionality
├── content.js        # Content script for font injection
├── content.css       # Additional styles
└── icons/            # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Notes

- The font must be installed on your system to use system fonts
- Custom fonts are stored in the browser's storage
- Font size changes apply to all text elements
- The extension uses !important to override website styles
- Some websites may have restrictions on font changes

## Troubleshooting

If the font changes aren't applying:
1. Make sure the extension is enabled
2. Check if the font name is correct for system fonts
3. Verify the custom font file is in a supported format
4. Try refreshing the page
5. Check if the website has restrictions on font changes

## License

MIT License

## Contributing

Feel free to submit issues and enhancement requests! 