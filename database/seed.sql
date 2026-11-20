<<<<<<< HEAD
USE datastraw_roster;

INSERT IGNORE INTO pods(id,name,lead_name) VALUES
(1,'Alpha Pod','Aarav Mehta'),
(2,'Beta Pod','Diya Shah'),
(3,'Gamma Pod','Kabir Nair');

INSERT IGNORE INTO brands(id,name,description) VALUES
(1,'Aurelia','Beauty and personal care'),
(2,'UrbanNest','Home essentials'),
(3,'FitFuel','Nutrition'),
(4,'PetJoy','Pet supplies'),
(5,'GlowTheory','Skincare'),
(6,'DailyDrape','Fashion'),
(7,'KitchenCraft','Kitchenware'),
(8,'TechTonic','Electronics'),
(9,'GreenBasket','Organic foods'),
(10,'LittleSprout','Baby products');

INSERT INTO employees
(id,name,email,pod_id,role,weekly_off) VALUES
(1,'Aanya Sharma','aanya@datastraw.demo',1,'Senior Associate','Monday'),
(2,'Vivaan Patel','vivaan@datastraw.demo',1,'Associate','Tuesday'),
(3,'Anaya Verma','anaya@datastraw.demo',1,'Associate','Wednesday'),
(4,'Aditya Rao','aditya@datastraw.demo',1,'Associate','Thursday'),
(5,'Ishita Singh','ishita@datastraw.demo',1,'Associate','Friday'),
(6,'Arjun Gupta','arjun@datastraw.demo',1,'Associate','Saturday'),
(7,'Sara Khan','sara@datastraw.demo',1,'Associate','Sunday'),
(8,'Reyansh Joshi','reyansh@datastraw.demo',1,'Associate','Monday'),
(9,'Myra Desai','myra@datastraw.demo',1,'Associate','Tuesday'),
(10,'Atharv Kulkarni','atharv@datastraw.demo',1,'Associate','Wednesday'),
(11,'Kiara Iyer','kiara@datastraw.demo',2,'Senior Associate','Thursday'),
(12,'Dhruv Shah','dhruv@datastraw.demo',2,'Associate','Friday'),
(13,'Pari Mehta','pari@datastraw.demo',2,'Associate','Saturday'),
(14,'Kabir Joshi','kabir@datastraw.demo',2,'Associate','Sunday'),
(15,'Saanvi Rao','saanvi@datastraw.demo',2,'Associate','Monday'),
(16,'Rudra Nair','rudra@datastraw.demo',2,'Associate','Tuesday'),
(17,'Aarohi Das','aarohi@datastraw.demo',2,'Associate','Wednesday'),
(18,'Vihaan Jain','vihaan@datastraw.demo',2,'Associate','Thursday'),
(19,'Navya Kapoor','navya@datastraw.demo',2,'Associate','Friday'),
(20,'Krish Malhotra','krish@datastraw.demo',2,'Associate','Saturday'),
(21,'Meera Patil','meera@datastraw.demo',3,'Senior Associate','Sunday'),
(22,'Ayaan Khan','ayaan@datastraw.demo',3,'Associate','Monday'),
(23,'Riya Chawla','riya@datastraw.demo',3,'Associate','Tuesday'),
(24,'Shaurya Menon','shaurya@datastraw.demo',3,'Associate','Wednesday'),
(25,'Tara Sethi','tara@datastraw.demo',3,'Associate','Thursday'),
(26,'Dev Bansal','dev@datastraw.demo',3,'Associate','Friday'),
(27,'Zoya Ali','zoya@datastraw.demo',3,'Associate','Saturday'),
(28,'Neil Fernandes','neil@datastraw.demo',3,'Associate','Sunday'),
(29,'Ira Ghosh','ira@datastraw.demo',3,'Associate','Monday'),
(30,'Om Prakash','om@datastraw.demo',3,'Associate','Tuesday');

INSERT IGNORE INTO processes
(id,brand_id,name,operating_rule,min_staff) VALUES
(1,1,'Customer Support','ALL_DAYS',1),
(2,2,'Customer Support','NO_HOLIDAYS',1),
(3,3,'Customer Support','WEEKDAYS',1),
(4,4,'Customer Support','ALL_DAYS',1),
(5,5,'Customer Support','ALL_DAYS',1),
(6,6,'Customer Support','NO_HOLIDAYS',1),
(7,7,'Customer Support','WEEKDAYS',1),
(8,8,'Customer Support','ALL_DAYS',1),
(9,9,'Customer Support','NO_HOLIDAYS',1),
(10,10,'Customer Support','ALL_DAYS',1),
(11,1,'Abandoned Cart','ALL_DAYS',1),
(12,2,'NDR','NO_HOLIDAYS',1);

INSERT IGNORE INTO assignments(employee_id,process_id) VALUES
(1,1),(1,11),(2,2),(3,3),(4,4),(5,5),
(6,6),(7,7),(8,8),(9,9),(10,10),
(11,1),(12,2),(13,12),(14,4),(15,5),
(16,6),(17,7),(18,8),(19,9),(20,10),
(21,1),(22,2),(23,3),(24,4),(25,5),
(26,6),(27,7),(28,8),(29,9),(30,10);

INSERT IGNORE INTO public_holidays
(holiday_date,name) VALUES
('2026-11-14','Children''s Day (sample)');
=======
USE datastraw_roster;

INSERT IGNORE INTO pods(id,name,lead_name) VALUES
(1,'Alpha Pod','Aarav Mehta'),
(2,'Beta Pod','Diya Shah'),
(3,'Gamma Pod','Kabir Nair');

INSERT IGNORE INTO brands(id,name,description) VALUES
(1,'Aurelia','Beauty and personal care'),
(2,'UrbanNest','Home essentials'),
(3,'FitFuel','Nutrition'),
(4,'PetJoy','Pet supplies'),
(5,'GlowTheory','Skincare'),
(6,'DailyDrape','Fashion'),
(7,'KitchenCraft','Kitchenware'),
(8,'TechTonic','Electronics'),
(9,'GreenBasket','Organic foods'),
(10,'LittleSprout','Baby products');

INSERT INTO employees
(id,name,email,pod_id,role,weekly_off) VALUES
(1,'Aanya Sharma','aanya@datastraw.demo',1,'Senior Associate','Monday'),
(2,'Vivaan Patel','vivaan@datastraw.demo',1,'Associate','Tuesday'),
(3,'Anaya Verma','anaya@datastraw.demo',1,'Associate','Wednesday'),
(4,'Aditya Rao','aditya@datastraw.demo',1,'Associate','Thursday'),
(5,'Ishita Singh','ishita@datastraw.demo',1,'Associate','Friday'),
(6,'Arjun Gupta','arjun@datastraw.demo',1,'Associate','Saturday'),
(7,'Sara Khan','sara@datastraw.demo',1,'Associate','Sunday'),
(8,'Reyansh Joshi','reyansh@datastraw.demo',1,'Associate','Monday'),
(9,'Myra Desai','myra@datastraw.demo',1,'Associate','Tuesday'),
(10,'Atharv Kulkarni','atharv@datastraw.demo',1,'Associate','Wednesday'),
(11,'Kiara Iyer','kiara@datastraw.demo',2,'Senior Associate','Thursday'),
(12,'Dhruv Shah','dhruv@datastraw.demo',2,'Associate','Friday'),
(13,'Pari Mehta','pari@datastraw.demo',2,'Associate','Saturday'),
(14,'Kabir Joshi','kabir@datastraw.demo',2,'Associate','Sunday'),
(15,'Saanvi Rao','saanvi@datastraw.demo',2,'Associate','Monday'),
(16,'Rudra Nair','rudra@datastraw.demo',2,'Associate','Tuesday'),
(17,'Aarohi Das','aarohi@datastraw.demo',2,'Associate','Wednesday'),
(18,'Vihaan Jain','vihaan@datastraw.demo',2,'Associate','Thursday'),
(19,'Navya Kapoor','navya@datastraw.demo',2,'Associate','Friday'),
(20,'Krish Malhotra','krish@datastraw.demo',2,'Associate','Saturday'),
(21,'Meera Patil','meera@datastraw.demo',3,'Senior Associate','Sunday'),
(22,'Ayaan Khan','ayaan@datastraw.demo',3,'Associate','Monday'),
(23,'Riya Chawla','riya@datastraw.demo',3,'Associate','Tuesday'),
(24,'Shaurya Menon','shaurya@datastraw.demo',3,'Associate','Wednesday'),
(25,'Tara Sethi','tara@datastraw.demo',3,'Associate','Thursday'),
(26,'Dev Bansal','dev@datastraw.demo',3,'Associate','Friday'),
(27,'Zoya Ali','zoya@datastraw.demo',3,'Associate','Saturday'),
(28,'Neil Fernandes','neil@datastraw.demo',3,'Associate','Sunday'),
(29,'Ira Ghosh','ira@datastraw.demo',3,'Associate','Monday'),
(30,'Om Prakash','om@datastraw.demo',3,'Associate','Tuesday');

INSERT IGNORE INTO processes
(id,brand_id,name,operating_rule,min_staff) VALUES
(1,1,'Customer Support','ALL_DAYS',1),
(2,2,'Customer Support','NO_HOLIDAYS',1),
(3,3,'Customer Support','WEEKDAYS',1),
(4,4,'Customer Support','ALL_DAYS',1),
(5,5,'Customer Support','ALL_DAYS',1),
(6,6,'Customer Support','NO_HOLIDAYS',1),
(7,7,'Customer Support','WEEKDAYS',1),
(8,8,'Customer Support','ALL_DAYS',1),
(9,9,'Customer Support','NO_HOLIDAYS',1),
(10,10,'Customer Support','ALL_DAYS',1),
(11,1,'Abandoned Cart','ALL_DAYS',1),
(12,2,'NDR','NO_HOLIDAYS',1);

INSERT IGNORE INTO assignments(employee_id,process_id) VALUES
(1,1),(1,11),(2,2),(3,3),(4,4),(5,5),
(6,6),(7,7),(8,8),(9,9),(10,10),
(11,1),(12,2),(13,12),(14,4),(15,5),
(16,6),(17,7),(18,8),(19,9),(20,10),
(21,1),(22,2),(23,3),(24,4),(25,5),
(26,6),(27,7),(28,8),(29,9),(30,10);

INSERT IGNORE INTO public_holidays
(holiday_date,name) VALUES
('2026-11-14','Children''s Day (sample)');

INSERT INTO processes
(id, brand_id, name, operating_rule, min_staff)
VALUES
(1, 1, 'Customer Support', 'ALL_DAYS', 1),
(2, 2, 'Order Management', 'WEEKDAYS', 1),
(3, 3, 'Customer Queries', 'ALL_DAYS', 1),
(4, 4, 'Product Support', 'NO_HOLIDAYS', 1),
(5, 5, 'Order Processing', 'ALL_DAYS', 2),
(6, 6, 'Kitchen Operations', 'WEEKDAYS', 1),
(7, 7, 'Customer Care', 'ALL_DAYS', 1),
(8, 8, 'Pet Product Support', 'NO_HOLIDAYS', 1),
(9, 9, 'Technical Support', 'ALL_DAYS', 2),
(10, 10, 'Sales Support', 'WEEKDAYS', 1),
(11, 1, 'Returns Management', 'WEEKDAYS', 1),
(12, 2, 'Delivery Support', 'ALL_DAYS', 1);

INSERT INTO processes
(id, brand_id, name, operating_rule, min_staff)
VALUES
(1, 1, 'Customer Support', 'ALL_DAYS', 1),
(2, 2, 'Order Management', 'WEEKDAYS', 1),
(3, 3, 'Customer Queries', 'ALL_DAYS', 1),
(4, 4, 'Product Support', 'NO_HOLIDAYS', 1),
(5, 5, 'Order Processing', 'ALL_DAYS', 2),
(6, 6, 'Kitchen Operations', 'WEEKDAYS', 1),
(7, 7, 'Customer Care', 'ALL_DAYS', 1),
(8, 8, 'Pet Product Support', 'NO_HOLIDAYS', 1),
(9, 9, 'Technical Support', 'ALL_DAYS', 2),
(10, 10, 'Sales Support', 'WEEKDAYS', 1),
(11, 1, 'Returns Management', 'WEEKDAYS', 1),
(12, 2, 'Delivery Support', 'ALL_DAYS', 1);

select * from processes;
select count(*) as total_processes
from processes;

select count(*) as total_assignments
from assignments;

select * from assignments;

select count(*) as total_employees from employees;
>>>>>>> 9ae93dc (Add backend health route)
