-- ENUM TYPES
CREATE TYPE province_enum AS ENUM ('Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','Northern Cape','North West','Western Cape');
CREATE TYPE gender_enum AS ENUM ('Female','Male','Other');
CREATE TYPE home_language_enum AS ENUM ('Afrikaans','English','isiNdebele','isiXhosa','isiZulu','Other','Sesotho','Sepedi','Setswana','siSwati','Tshivenda','Xitsonga');
CREATE TYPE access_level_enum AS ENUM ('Admin','Employee');
CREATE TYPE issue_type_enum AS ENUM ('Electricity','Refuse','Roads','Water');
CREATE TYPE ticket_status_enum AS ENUM ('In Progress','Pending','Resolved');
CREATE TYPE relationship_type_enum AS ENUM ('Community User','Contractor','Emergency Services','Other','Shareholder','Supplier');
CREATE TYPE preferred_contact_method_enum AS ENUM ('Email','Phone','SMS');
 
-- MUNICIPALITY REGION
CREATE TABLE MunicipalityRegion (
    municipality_id SERIAL PRIMARY KEY,
    municipality_name VARCHAR(100),
    province province_enum,
    municipality_code VARCHAR(20),
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
 
-- EMPLOYEE
CREATE TABLE Employee (
    id SERIAL PRIMARY KEY,
    municipality_id INT REFERENCES MunicipalityRegion(municipality_id),
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    surname VARCHAR(100),
    email VARCHAR(100),
    phone_number VARCHAR(10),
    id_number INT,
    home_language home_language_enum DEFAULT 'Other',
    gender gender_enum DEFAULT 'Other',
    date_of_birth DATE,
    password VARCHAR(100),
    province province_enum,
    notification_pref BOOLEAN DEFAULT TRUE,
    emp_code INT,
    emp_start_date DATE DEFAULT CURRENT_DATE,
    emp_job_title VARCHAR(100),
    access_level access_level_enum DEFAULT 'Employee',
    is_active BOOLEAN DEFAULT TRUE,
    out_of_office BOOLEAN DEFAULT FALSE,
    ticket_alloc_road BOOLEAN DEFAULT FALSE,
    ticket_alloc_electricity BOOLEAN DEFAULT FALSE,
    ticket_alloc_water BOOLEAN DEFAULT FALSE,
    ticket_alloc_refuse BOOLEAN DEFAULT FALSE
);
 
-- CONTACTS
CREATE TABLE Contacts (
    contact_id SERIAL PRIMARY KEY,
    employee_id INT UNIQUE REFERENCES Employee(id) ON DELETE CASCADE,
    contact_name VARCHAR(100),
    cell_phone_number VARCHAR(15),
    email_address VARCHAR(100),
    business_name VARCHAR(100),
    relationship_type relationship_type_enum DEFAULT 'Other',
    preferred_contact_method preferred_contact_method_enum DEFAULT 'Email',
    notes TEXT,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- COMMUNITY USER
CREATE TABLE CommunityUser (
    id SERIAL PRIMARY KEY,
    municipality_id INT REFERENCES MunicipalityRegion(municipality_id),
    full_name VARCHAR(100),
    email VARCHAR(100),
    date_of_birth DATE,
    gender gender_enum DEFAULT 'Other',
    home_language home_language_enum DEFAULT 'Other',
    password VARCHAR(100),
    notification_pref BOOLEAN DEFAULT TRUE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    issue_report_count INT DEFAULT 0,
    is_moderator BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE
);
 
-- TICKET LOCATION
CREATE TABLE TicketLocation (
    location_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES CommunityUser(id),
    municipality_id INT REFERENCES MunicipalityRegion(municipality_id),
    country VARCHAR(150),
    province VARCHAR(150),
    postal_code VARCHAR(4),
    city_town VARCHAR(150),
    suburb VARCHAR(150),
    street_name VARCHAR(150)
);
 
-- TICKETS
CREATE TABLE Tickets (
    ticket_id SERIAL PRIMARY KEY,
    municipality_id INT REFERENCES MunicipalityRegion(municipality_id),
    location_id INT REFERENCES TicketLocation(location_id),
    user_id INT REFERENCES CommunityUser(id),
    emp_id INT REFERENCES Employee(id),
    subject VARCHAR(50),
    description VARCHAR(255),
    issue_type issue_type_enum,
    status ticket_status_enum DEFAULT 'Pending',
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_completed TIMESTAMP,
    new_notification BOOLEAN DEFAULT TRUE,
    last_action_date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- TICKET NOTIFICATIONS
CREATE TABLE TicketNotifications (
    notification_id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES Tickets(ticket_id) ON DELETE CASCADE,
    user_id INT REFERENCES CommunityUser(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);
 
-- TICKET MEDIA
CREATE TABLE TicketMedia (
    media_id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES Tickets(ticket_id),
    user_id INT REFERENCES CommunityUser(id),
    file_name VARCHAR(100),
    file_storage_path VARCHAR(255),
    image_data BYTEA
);
 
-- ROOM
CREATE TABLE Room (
    room_id SERIAL PRIMARY KEY,
    moderator_user_id INT REFERENCES CommunityUser(id),
    room_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    date_created DATE DEFAULT CURRENT_DATE
);
 
-- CHAT MESSAGES
CREATE TABLE ChatMessages (
    message_id SERIAL PRIMARY KEY,
    parent_message_id INT REFERENCES ChatMessages(message_id),
    room_id INT REFERENCES Room(room_id),
    user_id INT,
    message_subject VARCHAR(50),
    message_description VARCHAR(255),
    ticket_id INT REFERENCES Tickets(ticket_id),
    is_private BOOLEAN DEFAULT FALSE,
    message_sent_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LEAVE CALENDAR
CREATE TABLE LeaveCalendar (
    leave_id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES Employee(id),
    leave_type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    checking_in BOOLEAN DEFAULT TRUE,
    stand_in_email VARCHAR(100),
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
