DELETE FROM mysql.user WHERE User='';
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';

FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS moisture_dashboard;

CREATE USER IF NOT EXISTS 'moisture_user'@'localhost'
IDENTIFIED BY 'moisture_pass';

GRANT ALL PRIVILEGES
ON moisture_dashboard.*
TO 'moisture_user'@'localhost';

FLUSH PRIVILEGES;