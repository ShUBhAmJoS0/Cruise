import SequelizeMock from "sequelize-mock";
const dbMock = new SequelizeMock();
const UserMock = dbMock.define('User', {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  firebase_uid: 'firebase-123',
  userType: 'attendee',
  bio: 'Test bio',
  about: 'Test about',
  sociallink: 'https://example.com',
  profileImage: '/images/profile.jpg',
  coverImage: '/images/cover.jpg',
  followersCount: 0,
  mediaImages: [],
  isActive: true,
  createdAt: new Date(),
});

describe('User Model', () => {
  it('should create a user', async () => {
    const user = await UserMock.create({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      firebase_uid: 'firebase-123',
      userType: 'attendee',
      bio: 'Test bio',
      about: 'Test about',
      sociallink: 'https://example.com',
      profileImage: '/images/profile.jpg',
      coverImage: '/images/cover.jpg',
      followersCount: 0,
      mediaImages: [],
      isActive: true,
      createdAt: new Date(),
    });

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.userType).toBe('attendee');
    expect(user.isActive).toBe(true);
  });
});
