CREATE TABLE `user`
(
    `id`            int(11) NOT NULL AUTO_INCREMENT,
    `created_at`    datetime                  DEFAULT NULL,
    `updated_at`    datetime                  DEFAULT NULL,
    `first_name`    varchar(255)              DEFAULT NULL,
    `last_name`     varchar(255)              DEFAULT NULL,
    `email`         varchar(255)              DEFAULT NULL,
    `user_role`     enum ('ADMIN','USER')     DEFAULT 'USER',
    `user_status`   enum ('PENDING','ACTIVE') DEFAULT 'PENDING',
    `password`      varchar(255)              DEFAULT NULL,
    `refresh_token` varchar(255)              DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_user_email` (`email`)
);
