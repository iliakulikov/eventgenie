# EventGenie Quiz Feature

## Overview
A beautifully designed multi-step quiz modal that collects user preferences and information for matching them with compatible groups for cultural events.

## Features

### ✨ Design
- **Dark theme** with 80% blackened background overlay
- **Orange accent colors** (#f59f0a) matching your brand
- **Smooth animations** and transitions
- **Progress bar** showing completion status
- **Mobile responsive** design
- Follows the Figma design pattern with custom adaptations

### 📋 Quiz Screens

#### Screen 1: The Event Filter
- Collects preferred vibe (Classic & Historical, Modern & Provocative, Photography & Visuals)
- Large card-based selection with emojis and descriptions

#### Screen 2: Social Dynamics (4 questions)
1. Introvert/Extrovert scale (1-10)
2. Logic vs. Emotion preference
3. Politically incorrect humor tolerance (1-10)
4. Smart vs. Funny personality type

#### Screen 3: The Basics (7 fields)
- First Name
- Last Name
- Date of Birth
- Gender Identity (Woman, Man, Non-binary)
- Industry
- Phone Number (WhatsApp) - auto-formats to UK format
- Email

#### Screen 4: Success Hook
- Celebration message with emoji 🎉
- Pricing information (£9.99 per event or £13.99/month)
- Yes/No confirmation buttons

### 🔧 Technical Features

- **Form validation** - ensures all required fields are filled
- **Progress tracking** - visual progress bar updates as user advances
- **Data collection** - captures all responses
- **Google Sheets integration** - automatically sends data to spreadsheet
- **Multiple entry points** - can be triggered from any CTA button
- **Keyboard support** - ESC to close modal
- **Smooth scrolling** - auto-scrolls to invalid fields
- **Phone formatting** - automatically formats UK phone numbers

## How to Use

### Opening the Quiz
The quiz modal can be opened by clicking:
- "Join the Next Experience" button (hero section)
- "Find Your Group Now" button (CTA section)
- Any other button with ID `openQuizBtn` or class `cta-button`

### Navigation
- Click "Next" to advance to the next screen
- Form validates before allowing progression
- "Submit" button on screen 3 advances to success screen
- Close button (×) or ESC key closes the modal

### Files Structure
```
eventgenie/
├── index.html              # Contains quiz modal HTML
├── styles.css              # Contains quiz styling (bottom of file)
├── quiz.js                 # Quiz functionality and Google Sheets integration
└── GOOGLE_SHEETS_SETUP.md  # Detailed setup instructions
```

## Setting Up Google Sheets Integration

See `GOOGLE_SHEETS_SETUP.md` for complete step-by-step instructions.

**Quick setup:**
1. Create a Google Sheet with specific column headers
2. Create a Google Apps Script web app
3. Copy the script URL to `quiz.js` (line 19)
4. Test the integration

## Customization

### Colors
Main colors are defined at the top of the quiz CSS section:
- Background: `#0f0f0f` (dark)
- Accent: `#f59f0a` (orange)
- Border: `#2e2e2e` (subtle)
- Text: `#fafafa` (white)
- Muted: `#999999` (gray)

### Questions
To modify questions, edit the HTML in `index.html` within the `.quiz-screen` divs.

### Styling
All quiz styles are in `styles.css` starting from the `/* Quiz Modal Styles */` comment.

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes
- Form uses HTML5 validation
- Data is collected even if Google Sheets isn't set up yet
- Console logs help with debugging
- Phone numbers auto-format to UK standard (+44)

## What Happens After Submission

1. User completes all 3 screens
2. Sees success message with pricing
3. Clicks "Yes" or "No"
4. Data is sent to Google Sheets with timestamp
5. User sees confirmation alert
6. Modal closes and form resets

## Next Steps

1. ✅ Quiz is fully designed and functional
2. 📊 Set up Google Sheets (see GOOGLE_SHEETS_SETUP.md)
3. 🎨 Customize colors/text if needed
4. 🧪 Test the entire flow
5. 🚀 Deploy to production

## Support

If you encounter any issues:
1. Check browser console (F12) for errors
2. Verify Google Sheets setup is complete
3. Ensure all files are uploaded to server
4. Test on different browsers
