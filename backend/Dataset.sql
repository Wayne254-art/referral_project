CREATE TABLE `refferal_program`.`transfers` (
    `transfers_id` INT(11) NOT NULL AUTO_INCREMENT,
    `id` INT(20) NOT NULL,
    `amount` INT NOT NULL,
    `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`tranfers_id`)
) ENGINE = InnoDB;


ALTER TABLE transfers
ADD FOREIGN KEY (id) REFERENCES users(id);

ALTER TABLE `refferals` ADD `status` ENUM('false', 'true') NOT NULL DEFAULT 'false'

CREATE TABLE referrals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    referrer_id int,
    referralCode VARCHAR(200),
    referralLink VARCHAR(500),
    status ENUM('inactive', 'active') DEFAULT 'inactive',
    FOREIGN KEY (referrer_id) REFERENCES users(id),
    FOREIGN KEY (referralCode) REFERENCES users(id)
);

