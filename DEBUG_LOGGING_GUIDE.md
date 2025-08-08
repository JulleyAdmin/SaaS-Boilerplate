# Debug Logging Guide for Patient Management Module

## Overview

I've set up comprehensive logging for both client-side and server-side to help identify gaps and issues in the patient management module.

## Features

### 1. Server-Side API Logging (`/src/utils/api-logger.ts`)
- **Request/Response Logging**: All API requests are logged with method, path, parameters, and response times
- **Performance Monitoring**: Slow operations (>1s) are flagged with warnings
- **Error Tracking**: Detailed error logs with stack traces
- **Database Query Logging**: Track all database operations and their performance

### 2. Client-Side Logging (`/src/utils/client-logger.ts`)
- **Component Lifecycle**: Track component mounting, updates, and errors
- **User Interactions**: Log all user actions (searches, filters, clicks)
- **Performance Tracking**: Monitor render times and slow operations
- **Error Handling**: Catch and log unhandled errors and promise rejections

### 3. Network Interceptor (`/src/utils/network-interceptor.ts`)
- **API Call Monitoring**: Intercept all fetch requests to track API calls
- **Request/Response Details**: Log headers, body, status codes, and timing
- **Performance Metrics**: Track slow API calls (>1s) and failures
- **Real-time Monitoring**: See pending requests in real-time

### 4. Debug Dashboard
- **Visual Log Viewer**: See all logs in a floating dashboard
- **Filtering**: Filter by log level (debug, info, warn, error) and category
- **Export**: Download logs as JSON for analysis
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + Shift + B`: Toggle debug dashboard
  - `Ctrl/Cmd + Shift + D`: Download logs
  - `Ctrl/Cmd + Shift + L`: Log current state to console

## How to Use

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```

2. **Navigate to Patient Management**:
   - Go to http://localhost:3002/dashboard/patients
   - The logging will start automatically

3. **Monitor Logs**:
   - **Console**: Open browser DevTools to see detailed logs
   - **Debug Dashboard**: Press `Ctrl/Cmd + Shift + B` to open the visual dashboard
   - **Server Logs**: Check terminal for API request/response logs

4. **Test Different Scenarios**:
   - Search for patients
   - Change filters
   - Click on patient actions
   - Navigate between tabs
   - Trigger errors (e.g., disconnect network)

## What to Look For

### Console Logs (Browser DevTools)
- **API_REQUEST/API_RESPONSE**: Track all API calls and their timing
- **PATIENT_SEARCH**: See search parameters and results
- **UI_INTERACTION**: Track user actions
- **COMPONENT**: Component lifecycle events
- **NETWORK_ERROR**: API failures and network issues

### Server Logs (Terminal)
- **API Request/Response**: Full request details with timing
- **Patient operations**: Create, search, update logs
- **Database queries**: SQL execution and performance
- **Errors**: Detailed error stack traces

### Common Issues to Identify
1. **Slow API Responses**: Look for operations taking >1s
2. **Failed Requests**: 4xx/5xx status codes
3. **Missing Data**: Empty responses or null values
4. **UI State Issues**: Component mounting/unmounting problems
5. **Network Errors**: Connection failures or timeouts

## Analyzing Logs

1. **Export Logs**: Press `Ctrl/Cmd + Shift + D` to download logs
2. **Filter by Category**: Use the debug dashboard filters
3. **Check Timing**: Look for performance bottlenecks
4. **Trace Errors**: Follow stack traces to find root causes
5. **Review User Flow**: Track the sequence of user actions

## Example Log Output

```json
{
  "timestamp": "2024-08-04T10:30:45.123Z",
  "level": "info",
  "category": "PATIENT_SEARCH",
  "message": "Searching patients",
  "data": {
    "params": {
      "query": "john",
      "status": "outpatient",
      "page": 1,
      "pageSize": 10
    },
    "resultCount": 5
  }
}
```

## Next Steps

After collecting logs:
1. Identify patterns in errors or slow operations
2. Review API response times and optimize slow endpoints
3. Check for missing error handling
4. Analyze user interaction patterns
5. Document any gaps or issues found

The comprehensive logging will help us identify exactly where improvements are needed in the patient management module.