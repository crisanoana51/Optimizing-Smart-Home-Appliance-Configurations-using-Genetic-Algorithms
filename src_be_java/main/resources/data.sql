INSERT INTO role (name) VALUES ('ROLE_CLIENT');
INSERT INTO role (name) VALUES ('ROLE_RESEARCH');
INSERT INTO userr (enabled,email,first_name, last_name, password, username)
VALUES ('true','admin@yahoo.com', 'Admin', 'Adminn', '$2a$10$ZzGrq5bK/NC30zHO6ygvku3cRBTpFxC4/KYmUabFTee1hB7zMbA4u','admin');
INSERT INTO userr_roles (roles_id,user_id) VALUES (2,1);
