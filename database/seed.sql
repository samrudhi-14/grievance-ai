-- ==============================================================================
-- GrievanceAI Demo Seed Data
-- ==============================================================================

USE `grievance_ai`;

-- 1. Populate Official Departments
INSERT INTO `departments` (`id`, `name`, `description`, `head_officer`, `contact_email`) VALUES
(1, 'Garbage & Sanitation', 'Municipal solid waste management, drain cleaning, and public cleanliness', 'Er. M. K. Patil', 'sanitation@grievance.ai'),
(2, 'Roads & Traffic', 'Potholes, road repair, traffic signals, and pedestrian safety', 'Er. S. R. Deshmukh', 'roads@grievance.ai'),
(3, 'Water Supply', 'Pipeline leakage, water quality testing, low pressure, and tanker management', 'Er. V. A. Kulkarni', 'water@grievance.ai'),
(4, 'Electricity', 'Power outages, hazardous open cables, and voltage fluctuation', 'Er. A. B. Joshi', 'electricity@grievance.ai'),
(5, 'Food Security & Safety', 'PDS ration distribution, mid-day meals, food adulteration, and canteen hygiene', 'Dr. P. N. Rao', 'foodsecurity@grievance.ai'),
(6, 'Public Safety', 'Encroachment, hazardous structures, stray animal control, and civil hazards', 'Insp. T. K. Verma', 'safety@grievance.ai'),
(7, 'Education', 'Government schools infrastructure, teachers absenteeism, and library facilities', 'Prof. S. N. Iyer', 'education@grievance.ai'),
(8, 'Other', 'General municipal and administrative grievances', 'Desk Officer', 'support@grievance.ai')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. Populate Default Superadmin
-- Default Credentials:
-- Email: admin@grievance.ai
-- Password: Admin@12345
-- (Change this password in production)
INSERT INTO `admins` (`id`, `full_name`, `email`, `password_hash`, `department_id`, `role`) VALUES
(1, 'Chief Grievance Officer', 'admin@grievance.ai', '$2b$10$ryq8pOkvsCKjwyFYq8A7WuSX6TyqIYhz/Vk6yxOllGxK/7Uskx4i.', NULL, 'superadmin')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- 3. Populate Sample Citizen
-- Default Credentials:
-- Email: citizen@example.com
-- Password: Citizen@123
INSERT INTO `users` (`id`, `full_name`, `email`, `mobile`, `password_hash`, `role`) VALUES
(1, 'Rahul Sharma', 'citizen@example.com', '9876543210', '$2b$10$L8IXpInKMOiamO/sCYud5.yVlJAxU1urQxy973DhwMm/Ee/xYoE9C', 'citizen')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- 4. Sample Grievances for Demonstration
INSERT INTO `grievances` (
  `id`, `grievance_id`, `user_id`, `title`, `description`, `category`, `location`, `latitude`, `longitude`,
  `priority`, `status`, `department_id`, `assigned_officer`, `ai_category`, `ai_priority`, `ai_department`,
  `ai_summary`, `created_at`
) VALUES
(
  1,
  'GRV-2026-00101',
  1,
  'Severe Food Grain Disruption at Fair Price Shop #14',
  'Subsidized wheat and rice have not been distributed to eligible yellow ration card holders for two weeks. Biometric device repeatedly displays server timeout.',
  'Food Security & Safety',
  'Ward 4, Near Ganpati Temple, Market Road',
  19.0760,
  72.8777,
  'High',
  'IN_PROGRESS',
  5,
  'Dr. P. N. Rao',
  'Food Security & Safety',
  'High',
  'Food Security & Safety',
  'Subsidized grain distribution stalled at Fair Price Shop #14 due to biometric device failure affecting local cardholders.',
  NOW() - INTERVAL 3 DAY
),
(
  2,
  'GRV-2026-00102',
  1,
  'Major Drinking Water Pipe Burst Flooding Street',
  'High-pressure water main burst early morning, causing thousands of liters of clean drinking water to flood the road and enter residential compounds.',
  'Water Supply',
  'Station Road, Near Metro Pillar 45',
  19.0825,
  72.8850,
  'Critical',
  'ASSIGNED',
  3,
  'Er. V. A. Kulkarni',
  'Water Supply',
  'Critical',
  'Water Supply',
  'Severe underground pipeline rupture on Station Road resulting in street flooding and disruption of residential water supply.',
  NOW() - INTERVAL 1 DAY
),
(
  3,
  'GRV-2026-00103',
  1,
  'Accumulated Garbage and Overflowing Community Dumpster',
  'The community bin on 7th Cross has not been cleared for 4 days. Strong stench and stray dog menace.',
  'Garbage & Sanitation',
  '7th Cross, Gandhi Nagar, Sector 2',
  19.0900,
  72.8900,
  'Medium',
  'RESOLVED',
  1,
  'Er. M. K. Patil',
  'Garbage & Sanitation',
  'Medium',
  'Garbage & Sanitation',
  'Community garbage dumpster on 7th Cross was overflowing due to skipped collection.',
  NOW() - INTERVAL 7 DAY
)
ON DUPLICATE KEY UPDATE `grievance_id` = VALUES(`grievance_id`);

-- 5. Audit History for Seed Grievances
INSERT INTO `grievance_history` (`grievance_id`, `previous_status`, `new_status`, `remark`, `changed_by`, `created_at`) VALUES
(1, NULL, 'SUBMITTED', 'Grievance submitted by citizen through online portal.', 'Rahul Sharma', NOW() - INTERVAL 3 DAY),
(1, 'SUBMITTED', 'ASSIGNED', 'Assigned to Department of Food Security & Safety.', 'System / Admin', NOW() - INTERVAL 2 DAY),
(1, 'ASSIGNED', 'IN_PROGRESS', 'Inspector dispatched to Fair Price Shop #14 for physical stock audit.', 'Dr. P. N. Rao', NOW() - INTERVAL 1 DAY),
(2, NULL, 'SUBMITTED', 'Grievance submitted by citizen with Critical urgency.', 'Rahul Sharma', NOW() - INTERVAL 1 DAY),
(2, 'SUBMITTED', 'ASSIGNED', 'Emergency pipeline repair crew assigned.', 'Chief Grievance Officer', NOW() - INTERVAL 18 HOUR),
(3, NULL, 'SUBMITTED', 'Grievance submitted.', 'Rahul Sharma', NOW() - INTERVAL 7 DAY),
(3, 'SUBMITTED', 'IN_PROGRESS', 'Sanitation truck routed.', 'Er. M. K. Patil', NOW() - INTERVAL 6 DAY),
(3, 'IN_PROGRESS', 'RESOLVED', 'Bin cleared, area disinfected with bleaching powder.', 'Er. M. K. Patil', NOW() - INTERVAL 5 DAY);

-- 6. Initial Citizen Notifications
INSERT INTO `notifications` (`user_id`, `grievance_id`, `title`, `message`, `is_read`, `created_at`) VALUES
(1, 1, 'Status Update: In Progress', 'Your grievance GRV-2026-00101 (Food Grain Disruption) is now Under Inspection.', FALSE, NOW() - INTERVAL 1 DAY),
(1, 2, 'Grievance Assigned', 'Your grievance GRV-2026-00102 (Water Pipe Burst) has been assigned to Water Supply Dept.', FALSE, NOW() - INTERVAL 18 HOUR),
(1, 3, 'Grievance Resolved', 'Your grievance GRV-2026-00103 has been successfully resolved.', TRUE, NOW() - INTERVAL 5 DAY);
