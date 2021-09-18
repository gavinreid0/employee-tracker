INSERT INTO departments (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Salesperson", 35000, 1),
       ("Sales Lead", 70000, 1),
       ("Software Engineer", 1000000, 2),
       ("Accountant", 60000, 3),
       ("Lawyer", 150000, 4);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Jordan", "Belfort", 1),
       ("Donnie", "Azoff", 2),
       ("Mark", "Hanna", 3),
       ("Jerry", "Fogel", 4),
       ("Nicky", "Koskoff", 5);