import SequelizeMock from 'sequelize-mock';

// Initialize mock DB
const dbMock = new SequelizeMock();

// Define the Event mock model based on your real Event model
const Event = dbMock.define('Events', {
  id: 1,
  title: 'Sample Event',
  description: 'This is a test event',
  location: 'Test Venue',
  date: new Date(),
  time: '18:00',
  category: 'Music',
  images: [], // optional array
  profileImage: 'profile.png',
  prices: { VIP: 0, Regular: 0, Student: 0 },
  Quantity: { VIP: 0, Regular: 0, Student: 0 },
  createdBy: 1,
  status: 'pending',
  visible: 'Active'
}, {
  timestamps: true,
  underscored: true
});

describe('Event Model', () => {

  it('should define Event model', () => {
    expect(Event).toBeDefined();
    expect(Event.name).toBe('Events'); // sequelize-mock uses .name
  });

  it('should have required fields', () => {
    const fields = Event._defaults;

    expect(fields.id).toBeDefined();
    expect(fields.title).toBeDefined();
    expect(fields.description).toBeDefined();
    expect(fields.location).toBeDefined();
    expect(fields.date).toBeDefined();
    expect(fields.time).toBeDefined();
    expect(fields.category).toBeDefined();
    expect(fields.profileImage).toBeDefined();
    expect(fields.images).toBeDefined();
    expect(fields.prices).toBeDefined();
    expect(fields.Quantity).toBeDefined();
    expect(fields.createdBy).toBeDefined();
    expect(fields.status).toBeDefined();
    expect(fields.visible).toBeDefined();
  });

  it('should have default values for prices and Quantity', () => {
    const fields = Event._defaults;
    expect(fields.prices).toEqual({ VIP: 0, Regular: 0, Student: 0 });
    expect(fields.Quantity).toEqual({ VIP: 0, Regular: 0, Student: 0 });
  });

  it('should have default values for status and visible', () => {
    const fields = Event._defaults;
    expect(fields.status).toBe('pending');
    expect(fields.visible).toBe('Active');
  });


  it('should support images array', () => {
    const fields = Event._defaults;
    expect(Array.isArray(fields.images)).toBe(true);
  });
});
