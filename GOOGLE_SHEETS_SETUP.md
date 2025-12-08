# EventGenie Quiz - Google Sheets Integration Setup

## Overview
The quiz form collects user data and sends it to Google Sheets for easy management and analysis.

## Step 1: Create a Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "EventGenie Quiz Responses"
4. Create the following column headers in Row 1:
   - A1: `Date`
   - B1: `vibe`
   - C1: `introvert_extrovert`
   - D1: `logic_emotion`
   - E1: `humor`
   - F1: `personality_type`
   - G1: `first_name`
   - H1: `last_name`
   - I1: `dob`
   - J1: `gender`
   - K1: `industry`
   - L1: `phone`
   - M1: `email`
   - N1: `payment_confirmed`

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code
3. Paste the following code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Get form data from POST parameters
    var params = e.parameter;
    
    // Create a row with the data in the same order as headers
    var row = [
      params.Date || new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }),
      params.vibe || '',
      params.introvert_extrovert || '',
      params.logic_emotion || '',
      params.humor || '',
      params.personality_type || '',
      params.first_name || '',
      params.last_name || '',
      params.dob || '',
      params.gender || '',
      params.industry || '',
      params.phone || '',
      params.email || '',
      params.payment_confirmed || ''
    ];
    
    // Append the row to the sheet
    sheet.appendRow(row);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify setup
function testDoPost() {
  var testData = {
    parameter: {
      Date: new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }),
      vibe: 'modern',
      introvert_extrovert: '7',
      logic_emotion: 'logic',
      humor: '5',
      personality_type: 'smart',
      first_name: 'Test',
      last_name: 'User',
      dob: '1990-01-01',
      gender: 'non-binary',
      industry: 'Tech',
      phone: '+447123456789',
      email: 'test@example.com',
      payment_confirmed: 'Yes'
    }
  };
  
  var result = doPost(testData);
  Logger.log(result.getContent());
}
```

4. Save the script (File → Save or Ctrl/Cmd + S)
5. Name your project "EventGenie Quiz Handler"

## Step 3: Deploy the Script

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type" → Choose **Web app**
3. Configure the deployment:
   - **Description**: EventGenie Quiz Collector v1
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **Deploy**
5. Review and authorize permissions when prompted:
   - Click "Review Permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to [Project Name] (unsafe)"
   - Click "Allow"
6. **Copy the Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

## Step 4: Update Your Website (ALREADY DONE ✅)

Your script URL has already been configured in `quiz.js`:
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzK1Ejj6wtzjGGymCry83q8IM_dMiZJ73CxY8FcPNp0YZPa1zyW_RqfK971c9kiqduN/exec';
```

Just make sure to:
1. Save all files
2. Upload to your server
3. Test the form

## Step 5: Test the Integration

### Test from Apps Script (Recommended First)
1. In Apps Script editor, select the `testDoPost` function from the dropdown
2. Click the "Run" button
3. Check your spreadsheet - you should see a new row with test data

### Test from Your Website
1. Open your website
2. Click "Find Your Group Now" to open the quiz
3. Fill out all fields
4. Complete the quiz
5. Check your Google Sheet - you should see the submission

## Data Fields Collected

| Field | Type | Description |
|-------|------|-------------|
| Date | String | Formatted date/time (London timezone, DD/MM/YYYY HH:MM) |
| vibe | String | classic / modern / photography |
| introvert_extrovert | Number | Scale 1-10 |
| logic_emotion | String | logic / emotion |
| humor | Number | Scale 1-10 |
| personality_type | String | smart / funny |
| first_name | String | User's first name |
| last_name | String | User's last name |
| dob | Date | Date of birth (YYYY-MM-DD) |
| gender | String | woman / man / non-binary |
| industry | String | User's industry |
| phone | String | WhatsApp phone number |
| email | String | Email address |
| payment_confirmed | String | Yes / No |

## Troubleshooting

### Submissions not appearing in sheet
- Verify the Apps Script is deployed as "Anyone" can access
- Check that the Web App URL is correctly copied to quiz.js
- Open browser console (F12) to check for JavaScript errors
- Run the `testDoPost` function in Apps Script to verify it works

### Permission errors
- Re-deploy the script with fresh permissions
- Make sure "Execute as" is set to "Me"
- Ensure "Who has access" is set to "Anyone"

### CORS errors in browser
- Using FormData POST method should avoid CORS issues
- If you still see errors, check the Apps Script deployment settings
- Make sure "Who has access" is set to "Anyone"

## Next Steps

### Email Notifications (Optional)
Add email notifications when someone submits:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var params = e.parameter;
    
    var row = [
      params.Date || new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }),
      params.vibe || '',
      params.introvert_extrovert || '',
      params.logic_emotion || '',
      params.humor || '',
      params.personality_type || '',
      params.first_name || '',
      params.last_name || '',
      params.dob || '',
      params.gender || '',
      params.industry || '',
      params.phone || '',
      params.email || '',
      params.payment_confirmed || ''
    ];
    
    sheet.appendRow(row);
    
    // Send email notification
    var emailBody = 'New EventGenie Quiz Submission\n\n' +
      'Name: ' + params.first_name + ' ' + params.last_name + '\n' +
      'Email: ' + params.email + '\n' +
      'Phone: ' + params.phone + '\n' +
      'Vibe: ' + params.vibe + '\n' +
      'Payment Confirmed: ' + params.payment_confirmed + '\n';
    
    MailApp.sendEmail({
      to: 'your@email.com',
      subject: 'New EventGenie Quiz Submission',
      body: emailBody
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Data Analysis
- Use Google Sheets formulas and charts to analyze responses
- Create pivot tables to see vibe preferences
- Track personality type distributions
- Monitor payment confirmation rates

## Security Notes

- Never expose your Google Script URL in public repositories
- Consider adding a simple API key check for additional security
- Regularly review your spreadsheet access permissions
- The script only accepts POST requests
