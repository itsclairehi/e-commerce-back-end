INSERT INTO department (name)
  VALUES ('Legal'),
  ('Sales'),
  ('Marketing'),
  ('Engineering');


  INSERT INTO role (title, salary, department_id)
  VALUES ('manager', 100000,  1),
  ('sales asssociate', 70000,  2),
  ('lawyer', 250000,  1),
  ('slogan guru', 120000,  3),
  ('developer', 90000000,  4);

INSERT INTO employee (first_name,
  last_name, role_id, manager_id)
  VALUES ('Helena', 'Bonham-Carter', 1, 1),
  ('Georgie', 'Porgie', 1, 2),
  ('Selena', 'Gomez', 2, 1),
  ('Darrel', 'Doohickey', 3, 2),
  ('Prudence', 'Clearwater', 4, 1),
  ('Stella', 'Folger', 5, 2);
