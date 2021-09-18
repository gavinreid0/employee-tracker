SELECT first_name, last_name, title
FROM employees 
JOIN roles ON employees.role_id = roles.id;

UPDATE employees
SET role_id = 3
WHERE last_name = "Franco";