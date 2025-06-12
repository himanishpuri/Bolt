-- Seed data for Financial Inclusion Platform

-- Insert education modules
INSERT INTO education_modules (title, description, content, duration_minutes, order_index) VALUES
('Financial Basics', 'Understanding money, income, and expenses', 'Learn the fundamentals of personal finance including income, expenses, and basic money management principles.', 30, 1),
('Budgeting Mastery', 'Create and manage your personal budget', 'Master the art of budgeting with practical tools and techniques to track your income and expenses effectively.', 45, 2),
('Understanding Credit', 'How credit works and building credit history', 'Comprehensive guide to credit scores, credit reports, and strategies for building a strong credit history.', 40, 3),
('Savings Strategies', 'Emergency funds and long-term savings', 'Learn different savings strategies, how to build an emergency fund, and plan for long-term financial goals.', 35, 4),
('Investment Basics', 'Introduction to investing and wealth building', 'Get started with investing fundamentals, risk management, and building wealth over time.', 50, 5),
('Debt Management', 'Strategies for managing and reducing debt', 'Effective strategies for managing existing debt and creating a plan to become debt-free.', 40, 6);

-- Insert sample community events
INSERT INTO community_events (title, description, event_type, event_date, start_time, end_time, location, max_attendees, is_online) VALUES
('Building Your First Budget', 'Interactive workshop on creating and maintaining a personal budget', 'Workshop', '2024-12-16', '14:00', '16:00', 'Community Center, Downtown', 30, false),
('Credit Score Improvement Strategies', 'Learn proven methods to improve your credit score', 'Webinar', '2024-12-20', '18:00', '19:30', 'Online Platform', 200, true),
('Small Business Loan Fair', 'Meet with lenders and learn about small business financing options', 'Fair', '2024-12-23', '10:00', '15:00', 'City Hall, Main Street', 100, false),
('Digital Banking Basics', 'Introduction to online banking and digital payment methods', 'Workshop', '2024-12-27', '15:00', '17:00', 'Library Conference Room', 25, false),
('Investment Planning for Beginners', 'Start your investment journey with expert guidance', 'Seminar', '2025-01-05', '11:00', '13:00', 'Financial Center', 50, false);

-- Insert sample community discussions
INSERT INTO community_discussions (title, content, category, reply_count, like_count) VALUES
('Best strategies for building emergency fund?', 'I am trying to build my first emergency fund. What are some effective strategies you have used? How much should I aim to save initially?', 'Savings', 12, 23),
('How to negotiate better loan terms?', 'Has anyone successfully negotiated better interest rates or terms on their loans? What approach worked for you?', 'Credit', 8, 18),
('Side hustle ideas for extra income', 'Looking for legitimate ways to earn extra income. What side hustles have worked well for people in our community?', 'Income', 24, 31),
('Budgeting apps vs manual tracking', 'What do you prefer - using budgeting apps or tracking expenses manually? Pros and cons of each approach?', 'Budgeting', 15, 19),
('First-time home buyer tips', 'Planning to buy my first home next year. Any advice on preparation, down payment, and the buying process?', 'Planning', 20, 27);

-- Insert sample users (for demo purposes)
INSERT INTO users (email, phone, first_name, last_name, date_of_birth, city, state, kyc_status) VALUES
('sarah.kim@email.com', '+91-9876543210', 'Sarah', 'Kim', '1992-05-15', 'Mumbai', 'Maharashtra', 'verified'),
('maria.rodriguez@email.com', '+91-9876543211', 'Maria', 'Rodriguez', '1988-08-22', 'Delhi', 'Delhi', 'verified'),
('james.chen@email.com', '+91-9876543212', 'James', 'Chen', '1995-03-10', 'Bangalore', 'Karnataka', 'pending'),
('priya.patel@email.com', '+91-9876543213', 'Priya', 'Patel', '1990-11-30', 'Pune', 'Maharashtra', 'verified'),
('michael.brown@email.com', '+91-9876543214', 'Michael', 'Brown', '1987-07-18', 'Chennai', 'Tamil Nadu', 'in-review');

-- Insert sample credit scores
INSERT INTO credit_scores (user_id, score, digital_footprint_score, social_verification_score, financial_behavior_score, education_progress_score, community_engagement_score) VALUES
(1, 720, 0.68, 0.90, 0.72, 0.80, 0.55),
(2, 685, 0.65, 0.85, 0.70, 0.75, 0.60),
(3, 640, 0.60, 0.75, 0.65, 0.45, 0.40),
(4, 750, 0.75, 0.95, 0.80, 0.90, 0.70),
(5, 695, 0.70, 0.80, 0.68, 0.65, 0.50);

-- Insert sample education progress
INSERT INTO user_education_progress (user_id, module_id, progress_percentage, time_spent_minutes, quiz_score, completed_at) VALUES
(1, 1, 100, 35, 95, '2024-11-15 10:30:00'),
(1, 2, 100, 50, 88, '2024-11-20 14:15:00'),
(1, 3, 100, 45, 92, '2024-11-25 16:45:00'),
(1, 4, 60, 25, NULL, NULL),
(2, 1, 100, 40, 90, '2024-11-10 09:20:00'),
(2, 2, 100, 55, 85, '2024-11-18 11:30:00'),
(2, 3, 75, 30, NULL, NULL);

-- Insert sample event registrations
INSERT INTO event_registrations (user_id, event_id, attendance_status) VALUES
(1, 1, 'registered'),
(1, 2, 'attended'),
(2, 1, 'registered'),
(2, 3, 'registered'),
(3, 2, 'registered'),
(4, 1, 'attended'),
(4, 3, 'registered'),
(5, 2, 'registered');

-- Update event attendee counts
UPDATE community_events SET current_attendees = (
    SELECT COUNT(*) FROM event_registrations WHERE event_id = community_events.id
);
