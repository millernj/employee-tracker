INSERT INTO departments 
  (name) 
VALUES 
  ('Finance'), 
  ('Engineering'),
  ('Sales');

INSERT INTO roles 
  (title, salary, department_id) 
VALUES 
  ('Salesperson', 90000, 3),
  ('Sales Lead', 120000, 3),
  ('Sr. Engineer', 130000, 2),
  ('Jr. Engineer', 90000, 2),
  ('Accountant', 75000, 1);

INSERT INTO Employees 
  (first_name, last_name, role_id) 
VALUES 
  ('Slales', 'Leed', 2), 
  ('Senior', 'Enger', 3), 
  ('Alex', 'McCountant', 5);

INSERT INTO Employees 
  (first_name, last_name, role_id, manager_id) 
VALUES 
  ('Slales', 'Person', 1, 1), 
  ('Junior', 'Enger', 4, 2), 
  ('Avery', 'McCountant', 5, 3);