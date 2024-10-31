
--THIS IS THE SQL QUERY FOR THE MATERIALIZED VIEW TABLE
--THE MATERIALIZED VIEW TABLE IS USED TO STORE THE DATA OF THE USER POSTS
--THE DATA IS STORED IN THE MATERIALIZED VIEW TABLE TO REDUCE THE QUERY TIME
--THE MATERIALIZED VIEW TABLE IS UPDATED EVERY TIME A NEW POST IS MADE OR A POST IS LIKED

TRUNCATE TABLE materialized_user_posts
INSERT INTO materialized_user_posts (username, content, image_url, created_at, like_count)
SELECT 
    users.username, 
    posts.content, 
    posts.image_url, 
    posts.created_at, 
    COUNT(likes.post_id) AS like_count
FROM 
    posts 
INNER JOIN 
    users ON users.user_id = posts.user_id
LEFT JOIN 
    likes ON posts.post_id = likes.post_id
GROUP BY 
    posts.post_id;


