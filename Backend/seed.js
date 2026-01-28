import sequelize from "./src/Database/db.js";
import User from "./src/model/User.js";
import Event from "./src/model/Event.js";
import "./src/model/index.js";

const seed = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });

        // Create a default Admin
        const [adminUser] = await User.findOrCreate({
            where: { email: 'admin@example.com' },
            defaults: {
                name: 'System Admin',
                userType: 'Admin',
                firebase_uid: 'mock-admin-uid'
            }
        });

        // Create a default Artist
        const [artist] = await User.findOrCreate({
            where: { email: 'artist@example.com' },
            defaults: {
                name: 'Default Artist',
                userType: 'Artist',
                firebase_uid: 'default-artist-uid'
            }
        });

        // Create a pending event request
        await Event.findOrCreate({
            where: { title: 'Pending Music Festival' },
            defaults: {
                description: 'A massive music festival waiting for approval.',
                location: 'Stadium X',
                date: new Date(Date.now() + 86400000 * 7), // 7 days from now
                time: '18:00',
                category: 'Music',
                profileImage: 'uploads/default_event.png',
                images: ['uploads/img1.png'],
                prices: { VIP: 100, Regular: 50 },
                Quantity: { VIP: 50, Regular: 200 },
                status: 'pending',
                createdBy: artist.id
            }
        });

        // Create an approved event
        await Event.findOrCreate({
            where: { title: 'Approved Art Show' },
            defaults: {
                description: 'A beautiful art show.',
                location: 'Gallery Y',
                date: new Date(Date.now() + 86400000 * 14), // 14 days from now
                time: '10:00',
                category: 'Art',
                profileImage: 'uploads/default_event.png',
                images: ['uploads/img2.png'],
                prices: { Student: 10, Regular: 20 },
                Quantity: { Student: 30, Regular: 100 },
                status: 'Approved',
                createdBy: artist.id
            }
        });

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
