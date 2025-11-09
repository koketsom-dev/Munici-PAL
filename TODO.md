# TODO: Make Munici-PAL App Function with Real Data (No Tokens)

## 1. Update Authentication System
- [ ] Replace dummy Auth::authenticate() with real session-based authentication in `backend/utils/Auth.php`
- [ ] Update `backend/login/login.php` to properly set session data after successful authentication
- [ ] Update `backend/login/verify.php` to check real session data instead of dummy data
- [ ] Update `backend/login/logout.php` to properly destroy session

## 2. Update Backend Endpoints
- [ ] Update all admin endpoints to use real authentication:
  - `backend/admin/get-all-tickets.php`
  - `backend/admin/get-employees.php`
  - `backend/admin/get-community-users.php`
  - `backend/admin/add-employee.php`
  - `backend/admin/add-community-user.php`
  - `backend/admin/assign-ticket.php`
  - `backend/admin/get-contacts.php`
  - `backend/admin/add-contact.php`
  - `backend/admin/get-leave-entries.php`
  - `backend/admin/add-leave-entry.php`
  - And other admin endpoints
- [ ] Update ticket endpoints:
  - `backend/ticket/get-my-tickets.php`
  - `backend/ticket/add-ticket.php`
- [ ] Update forum endpoints:
  - `backend/forum/get-messages.php`
  - `backend/forum/add-message.php`
- [ ] Update dashboard endpoints:
  - `backend/api/dashboard/stats.php`
- [ ] Update user endpoints:
  - `backend/user/get-profile.php`
  - `backend/user/update-profile.php`

## 3. Remove Token References
- [ ] Remove any token-related code from `frontend/src/services/api.js`
- [ ] Ensure no token storage or usage in frontend
- [ ] Remove `generate_token.php` file if it exists
- [ ] Clean up any JWT or token references in config files

## 4. Populate Database with Initial Data
- [ ] Create script to insert initial municipality data
- [ ] Create script to insert admin employee user
- [ ] Create script to insert sample community users
- [ ] Create script to insert sample tickets
- [ ] Update `db/init.sql` if needed for initial data

## 5. Testing
- [ ] Test login flow with real data
- [ ] Test authentication on protected endpoints
- [ ] Test session persistence
- [ ] Test logout functionality
- [ ] Test frontend integration with real auth

## 6. Cleanup
- [ ] Remove any unused authentication-related files
- [ ] Update documentation if needed
- [ ] Ensure all endpoints work with real data
