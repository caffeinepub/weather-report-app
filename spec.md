# GPay App

## Current State
The project currently has a Weather Report App with weather display functionality. This will be replaced with a digital payments app.

## Requested Changes (Diff)

### Add
- User wallet with balance display
- Send money to contacts feature
- Receive money with QR code
- Request money from contacts
- Bills/payments feature
- Transaction history list
- Quick pay contacts
- Account management

### Modify
- Replace all existing UI and backend logic with GPay-style payment app

### Remove
- All weather-related functionality

## Implementation Plan
1. Backend: wallet balance, transactions (send/receive/request), contacts, bills storage in Motoko
2. Frontend: Dashboard with balance card, shortcut tiles (Send, Receive, Request, Bills), recent transactions, quick pay contacts, bottom nav on mobile
3. Authorization for user login
