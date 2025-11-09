-- Seed data for Munici-PAL application
-- Run this after init.sql to populate the database with test data

-- Insert municipality
INSERT INTO MunicipalityRegion (municipality_name, province, municipality_code) VALUES
('Cape Town Municipality', 'Western Cape', 'CPT001');

-- Insert admin employee
INSERT INTO Employee (
    municipality_id, first_name, middle_name, surname, email, phone_number, id_number,
    home_language, gender, date_of_birth, password, province, emp_code, emp_start_date,
    emp_job_title, access_level, is_active
) VALUES (
    1, 'Admin', '', 'User', 'admin@municipal.co.za', '0211234567', 123456789,
    'English', 'Other', '1980-01-01', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'Western Cape', 1001, '2020-01-01', 'System Administrator', 'Admin', true
);

-- Insert regular employee
INSERT INTO Employee (
    municipality_id, first_name, middle_name, surname, email, phone_number, id_number,
    home_language, gender, date_of_birth, password, province, emp_code, emp_start_date,
    emp_job_title, access_level, is_active, ticket_alloc_road, ticket_alloc_electricity,
    ticket_alloc_water, ticket_alloc_refuse
) VALUES (
    1, 'John', '', 'Smith', 'john.smith@municipal.co.za', '0219876543', 987654321,
    'English', 'Male', '1990-05-15', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'Western Cape', 1002, '2021-03-01', 'Municipal Officer', 'Employee', true,
    true, true, true, true
);

-- Insert community users
INSERT INTO CommunityUser (
    municipality_id, full_name, email, date_of_birth, gender, home_language,
    password, registration_date, is_moderator
) VALUES
(1, 'Jane Doe', 'jane.doe@email.com', '1985-08-20', 'Female', 'English',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', CURRENT_TIMESTAMP, false),
(1, 'Mike Johnson', 'mike.johnson@email.com', '1975-12-10', 'Male', 'Afrikaans',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', CURRENT_TIMESTAMP, false),
(1, 'Sarah Williams', 'sarah.williams@email.com', '1992-03-25', 'Female', 'English',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', CURRENT_TIMESTAMP, true);

-- Insert sample tickets
INSERT INTO TicketLocation (user_id, municipality_id, country, province, postal_code, city_town, suburb, street_name) VALUES
(1, 1, 'South Africa', 'Western Cape', '8001', 'Cape Town', 'CBD', 'Adderley Street'),
(2, 1, 'South Africa', 'Western Cape', '8001', 'Cape Town', 'Gardens', 'Government Avenue'),
(3, 1, 'South Africa', 'Western Cape', '8001', 'Cape Town', 'Sea Point', 'Beach Road');

INSERT INTO Tickets (municipality_id, location_id, user_id, emp_id, subject, description, issue_type, status) VALUES
(1, 1, 1, 2, 'Pothole on Main Road', 'Large pothole causing traffic hazard on Main Road near the intersection', 'Roads', 'Pending'),
(1, 2, 2, NULL, 'Street Light Out', 'Street light has been out for 3 days on Government Avenue', 'Electricity', 'In Progress'),
(1, 3, 3, 2, 'Water Leak', 'Water leaking from main pipe on Beach Road', 'Water', 'Resolved'),
(1, 1, 1, NULL, 'Overflowing Bin', 'Rubbish bin has not been collected for a week', 'Refuse', 'Pending');

-- Insert sample forum room
INSERT INTO Room (moderator_user_id, room_name) VALUES (3, 'General Discussion');

-- Insert sample chat messages
INSERT INTO ChatMessages (room_id, user_id, message_subject, message_description) VALUES
(1, 1, 'Welcome', 'Welcome to the Munici-PAL community forum!'),
(1, 3, 'Reporting Issues', 'Please use the ticket system to report municipal issues.'),
(1, 2, 'Community Meeting', 'There will be a community meeting next week to discuss local improvements.');

-- Insert sample contacts
INSERT INTO Contacts (employee_id, contact_name, cell_phone_number, email_address, business_name, relationship_type, preferred_contact_method) VALUES
(1, 'Eskom Representative', '0211112222', 'eskom@eskom.co.za', 'Eskom', 'Supplier', 'Email'),
(2, 'Water Utilities', '0213334444', 'water@capetown.gov.za', 'City of Cape Town Water', 'Emergency Services', 'Phone');

-- Insert sample leave entries
INSERT INTO LeaveCalendar (employee_id, leave_type, start_date, end_date, checking_in, stand_in_email) VALUES
(2, 'Annual Leave', '2024-12-20', '2024-12-27', true, 'admin@municipal.co.za'),
(2, 'Sick Leave', '2024-11-15', '2024-11-16', false, 'admin@municipal.co.za');
