const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker');
const url = 'mongodb://localhost:27017';
const dbName = 'social_network';
async function seedDatabase() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const users = Array.from({ length: 10000 }, (_, index) => ({
      user_id: index + 1,
      username: faker.person.fullName(),
      email: faker.internet.email(),
      password_hash: faker.string.uuid(),
      profile_picture: faker.image.avatar(),
      bio: faker.lorem.sentence(),
      friends: generateFriendList(1, 10000),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }));
    const posts = Array.from({ length: 10000 }, (_, index) => {
      const user = users[Math.floor(Math.random() * users.length)];
      return {
        post_id: index + 1,
        user_id: user.user_id,
        username: user.username,
        content: faker.lorem.sentence(),
        image_url: faker.image.avatar(),
        likes: generateLikesArray(100),
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
      };
    });
    await db.collection('users').deleteMany({});
    await db.collection('posts').deleteMany({});
    await db.collection('users').insertMany(users);
    await db.collection('posts').insertMany(posts);
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

function generateFriendList(count, maxUserId) {
  const friendList = new Set();
  while (friendList.size < count) {
    const randomFriendId = faker.number.int({ min: 1, max: maxUserId });
    friendList.add(randomFriendId);
  }
  return Array.from(friendList);
}

function generateLikesArray(count) {
  const likes = new Set();
  while (likes.size < count) {
    likes.add(faker.number.int({ min: 1, max: 10000 }));
  }
  return Array.from(likes);
}

seedDatabase();
