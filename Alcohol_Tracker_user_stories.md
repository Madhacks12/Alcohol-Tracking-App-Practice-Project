# <alcohol-tracker> User Story

### User Story 1 – Account Registration
**Title:** User Registration  
**As a** new user, **I want to** create an account using my email, username, and password **so that** I can securely track my drinking habits.  

**Acceptance Criteria:**  
1. The user can input a valid email, username, and password and click **Sign Up**.  
2. Password validation checks (minimum length and confirmation) are enforced.  
3. Error messages appear for invalid or missing fields.  
4. A success message confirms successful registration.  
---

### User Story 2 – Account Login  
**As a** registered user, **I want to** log in using my credentials **so that** I can access my personal dashboard.  

**Acceptance Criteria:**  
1. Users can log in using valid credentials.  
2. Incorrect credentials trigger an error message.  
3. Successful login redirects the user to the dashboard.  


### User Story 3 – Feedback on Errors  
**As a** user, **I want to** receive immediate feedback for invalid login or registration attempts **so that** I know how to correct my inputs.  

**Acceptance Criteria:**  
1. “Field required” messages appear when fields are empty.  
2. Error messages specify invalid emails or incorrect passwords.  


### User Story 4 – Persistent Login  
**As a** returning user, **I want to** stay logged in between sessions **so that** I don’t have to log in every time.  

**Acceptance Criteria:**  
1. User session is stored in localStorage.  
2. The app auto-authenticates returning users until they log out manually.  


## Exercise 4: Develop User Stories for Home Screen (Dashboard)

### User Story 1 – View Overview Data  
**As a** user, **I want to** see an overview of my drinking data on the dashboard **so that** I can monitor my weekly and daily progress at a glance.  

**Acceptance Criteria:**  
1. Dashboard displays daily drinks, weekly totals, and goal progress.  
2. Data updates dynamically as new drinks are logged.  

### User Story 2 – Introductory Guide for New Users  
**As a** new user, **I want to** see a brief onboarding guide on the dashboard **so that** I can understand how to log drinks and set goals.  

**Acceptance Criteria:**  
1. Onboarding tooltips or modal highlights key dashboard areas.  
2. The guide can be dismissed and won’t show again.  

### User Story 3 – Quick Access Navigation  
**As a** user, **I want to** quickly access my most-used features from the dashboard **so that** I can manage my tracking efficiently.  

**Acceptance Criteria:**  
1. Buttons for “Add Drink”, “View Progress”, “Notifications”, and “Settings” are visible.  
2. Each button links directly to the relevant screen.  

## Exercise 5: Develop User Stories for Detail Screen

### User Story 1 – View Drink Details  
**As a** user, **I want to** view detailed information for each logged drink **so that** I can understand its impact on my goals.  

**Acceptance Criteria:**  
1. The detail page displays type, quantity, date, and calorie content.  
2. Visual indicator shows if the drink exceeded recommended guidelines.  

---

### User Story 2 – Save or Share Drink Log  
**As a** user, **I want to** share my progress or export drink data **so that** I can discuss it with a healthcare provider.  

**Acceptance Criteria:**  
1. Buttons for **Share Progress** and **Export Data** are available.  
2. Exports generate CSV or PDF files for sharing.  

---

### User Story 3 – View Related Information  
**As a** user, **I want to** see health guidance related to my drinking data **so that** I can make informed lifestyle choices.  

**Acceptance Criteria:**  
1. NHS guideline summaries appear below drink detail.  
2. Contextual tips are shown for healthier alternatives.  


## Exercise 6: Develop User Stories to Integrate Persistent Data

### User Story 1 – Persist Login State  
**As a** user, **I want to** remain logged in between sessions **so that** I can continue tracking seamlessly.  

**Acceptance Criteria:**  
1. Authentication token stored in localStorage.  
2. User stays logged in until they manually log out.  

**Story Points:** 3  

---

### User Story 2 – Save Preferences (Theme, Units, Notifications)  
**As a** user, **I want to** save my preferences **so that** I don’t need to reconfigure settings after each login.  

**Acceptance Criteria:**  
1. Theme (light/dark), units, and notification settings persist locally.  
2. App loads saved preferences automatically on startup.  
---

### User Story 3 – Persistent Data Logs  
**As an** admin, **I want to** store anonymised user activity logs **so that** I can track usage trends over time.  

**Acceptance Criteria:**  
1. User events (login, log add, settings changes) are saved securely.  
2. Data can be analysed for app improvement.  

**Story Points:** 5  

---

## Exercise 7: Develop User Stories to Integrate External API (Future with Supabase)

### User Story 1 – Sync Data via Supabase  
**As a** user, **I want to** sync my data with Supabase **so that** I can access my progress from any device.  

**Acceptance Criteria:**  
1. User data automatically syncs on login and logout.  
2. Local data merges with Supabase account data.  

### User Story 2 – Real-Time Progress Sharing  
**As a** user, **I want to** share progress reports with healthcare providers **so that** they can monitor my improvement.  

**Acceptance Criteria:**  
1. A “Share Progress” button generates a secure Supabase link.  
2. Reports are read-only and update in real-time.  

### User Story 3 – Health Insights Integration  
**As a** user, **I want to** view recommended NHS guidelines from an external API **so that** I can compare my intake with health standards.  

**Acceptance Criteria:**  
1. API fetches latest NHS alcohol guidelines.  
2. App displays consumption vs guideline comparison.  


## Exercise 8: Develop User Stories to Implement Settings Menu

### User Story 1 – Access Settings Menu Anywhere  
**As a** user, **I want to** access the settings menu from any screen **so that** I can adjust preferences quickly.  

**Acceptance Criteria:**  
1. Settings icon is available on all screens.  
2. Clicking it opens the settings sidebar or page.  


### User Story 2 – Categorised Settings  
**As a** user, **I want to** see grouped sections in the settings menu **so that** I can easily find options.  

**Acceptance Criteria:**  
1. Sections: Profile, Notifications, Privacy, Data Management.  
2. Each section expands and collapses independently.  


### User Story 3 – Admin Access Control  
**As an** admin, **I want to** restrict access to certain settings **so that** app integrity and compliance are maintained.  

**Acceptance Criteria:**  
1. Admin-only settings appear conditionally.  
2. Restricted options are greyed out or hidden for regular users.  

## Exercise 9: Develop User Stories to Implement Settings Screen

### User Story 1 – Enable Dark Mode  
**As a** user, **I want to** toggle between light and dark mode **so that** I can reduce eye strain.  

**Acceptance Criteria:**  
1. Theme switcher instantly updates app theme.  
2. Preference persists after logout.  


### User Story 2 – Manage Notifications  
**As a** user, **I want to** adjust reminder and alert preferences **so that** I only receive relevant updates.  

**Acceptance Criteria:**  
1. Toggle for daily reminders, weekly reports, and streak alerts.  
2. Notification settings persist.  

### User Story 3 – Update Account Information  
**As a** user, **I want to** update my email or password **so that** I can maintain my account security.  

**Acceptance Criteria:**  
1. Editable fields with save confirmation.  
2. Password update requires current password verification.  


## Exercise 10: Develop User Stories to Implement Notifications

### User Story 1 – Daily Reminder  
**As a** user, **I want to** receive a daily reminder **so that** I don’t forget to log my drinks.  

**Acceptance Criteria:**  
1. Notification triggers at user-selected time.  
2. Clicking notification opens the log page.  


### User Story 2 – Feature Updates  
**As a** user, **I want to** receive notifications for new app features **so that** I can use them right away.  

**Acceptance Criteria:**  
1. Notification appears when a new update is available.  
2. Clicking it opens the changelog or guide.  


### User Story 3 – Disable Promotions  
**As a** user, **I want to** turn off promotional notifications **so that** I only receive relevant reminders.  

**Acceptance Criteria:**  
1. Toggle in settings disables promotional notifications.  
2. Setting persists across sessions.  


### User Story 4 – Admin Targeted Notifications  
**As an** admin, **I want to** send messages to specific user groups **so that** I can provide tailored guidance.  

**Acceptance Criteria:**  
1. Admin can select groups (e.g. beginners, active users).  
2. Notifications only reach selected group.  

## Exercise 11: Additional Examples (Optional)

### Social App Example
- As a user, I want to connect with peers for support so that I can stay motivated.  
- As an admin, I want to moderate shared posts so that the community remains respectful.  

### Health Tracking Example
- As a user, I want to set a weekly drink goal so that I can track reduction over time.  
- As a doctor, I want to receive patient reports automatically so that I can monitor progress.  


## Summary of Key Points

- **User roles:** regular users, new users, and admins.  
- **Structure:** As a [user], I want to [action], so that [benefit].  
- Each feature maps directly to the implemented app.  
- Includes persistent data, settings, notifications, and Supabase-ready API stories.

