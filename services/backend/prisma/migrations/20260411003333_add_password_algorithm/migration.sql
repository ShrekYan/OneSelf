-- CreateTable
CREATE TABLE `categories` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(500) NULL,
    `image_url` VARCHAR(500) NULL,
    `article_count` INTEGER NOT NULL DEFAULT 0,
    `sort_order` INTEGER NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` BIGINT NOT NULL,
    `updated_at` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hot_search_keywords` (
    `id` VARCHAR(36) NOT NULL,
    `keyword` VARCHAR(50) NOT NULL,
    `hot_score` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER NULL DEFAULT 0,
    `created_at` BIGINT NOT NULL,

    INDEX `idx_hot_score`(`hot_score`),
    INDEX `idx_is_active`(`is_active`),
    INDEX `idx_sort_order`(`sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articles` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `summary` VARCHAR(500) NULL,
    `cover_url` VARCHAR(500) NULL,
    `category_id` VARCHAR(36) NOT NULL,
    `author_id` VARCHAR(36) NOT NULL,
    `author_name` VARCHAR(50) NULL,
    `author_avatar` VARCHAR(500) NULL,
    `tags` VARCHAR(200) NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `likes` INTEGER NOT NULL DEFAULT 0,
    `comments_count` INTEGER NOT NULL DEFAULT 0,
    `is_top` BOOLEAN NOT NULL DEFAULT false,
    `read_time` INTEGER NULL,
    `published_at` BIGINT NOT NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `created_at` BIGINT NOT NULL,
    `updated_at` BIGINT NOT NULL,

    INDEX `idx_author_id`(`author_id`),
    INDEX `idx_category_id`(`category_id`),
    INDEX `idx_is_published`(`is_published`),
    INDEX `idx_is_top`(`is_top`),
    INDEX `idx_published_at`(`published_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `refresh_token` VARCHAR(500) NOT NULL,
    `client_ip` VARCHAR(50) NOT NULL,
    `expires_at` BIGINT NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,
    `created_at` BIGINT NOT NULL,

    UNIQUE INDEX `uk_refresh_token`(`refresh_token`),
    INDEX `idx_expires_at`(`expires_at`),
    INDEX `idx_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(36) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `password_algorithm` VARCHAR(20) NULL,
    `email` VARCHAR(100) NULL,
    `nickname` VARCHAR(50) NULL,
    `avatar` VARCHAR(500) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` BIGINT NOT NULL,
    `updated_at` BIGINT NOT NULL,

    UNIQUE INDEX `uk_username`(`username`),
    INDEX `idx_is_active`(`is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `article_content_blocks` (
    `id` VARCHAR(36) NOT NULL,
    `article_id` VARCHAR(36) NOT NULL,
    `block_type` VARCHAR(20) NOT NULL,
    `content` TEXT NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` BIGINT NOT NULL,
    `updated_at` BIGINT NOT NULL,

    INDEX `idx_article_id`(`article_id`),
    INDEX `idx_sort_order`(`article_id`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `article_likes` (
    `id` VARCHAR(36) NOT NULL,
    `article_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `created_at` BIGINT NOT NULL,

    INDEX `idx_user_id`(`user_id`),
    UNIQUE INDEX `uk_article_user`(`article_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `article_content_blocks` ADD CONSTRAINT `article_content_blocks_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `article_likes` ADD CONSTRAINT `article_likes_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `article_likes` ADD CONSTRAINT `article_likes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
