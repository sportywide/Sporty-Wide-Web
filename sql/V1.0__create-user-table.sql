CREATE TABLE `user`
(
    `id`            int(11)      NOT NULL AUTO_INCREMENT,
    `created_at`    datetime                  DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    datetime                  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `first_name`    varchar(30)  NOT NULL,
    `last_name`     varchar(30)               DEFAULT NULL,
    `email`         varchar(50)  NOT NULL,
    `username`      varchar(50)  NOT NULL,
    `role`     enum ('ADMIN','USER')     DEFAULT 'USER',
    `status`   enum ('PENDING','ACTIVE') DEFAULT 'PENDING',
    `password`      varchar(255) NOT NULL,
    `refresh_token` varchar(255)              DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_user_email` (`email`),
    UNIQUE KEY `uq_user_username` (`username`)
);
