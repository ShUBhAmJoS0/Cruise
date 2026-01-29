
import sequelize from "./src/Database/db.js";
import Event from "./src/model/Event.js";

async function seedEvents() {
    try {
        await sequelize.authenticate();
        console.log("Database connected.");

        // Check existing events
        const existing = await Event.findAll();
        console.log(`Found ${existing.length} existing events.`);

        // Create mock approved events
        const events = [
            {
                title: "Grand Caribbean Cruise",
                description: "Experience the ultimate luxury on the high seas with non-stop entertainment and gourmet dining.",
                location: "Miami, FL",
                date: "2026-03-15",
                time: "10:00 AM",
                category: "Music",
                subCategory: "Live Concert",
                status: "Approved",
                prices: { Standard: 120, VIP: 300 },
                Quantity: { Standard: 100, VIP: 20 },
                profileImage: "uploads/events/cruise1.jpg", // Using a placeholder path, might need a real file or fallback
                images: [],
                createdBy: 1 // Assuming admin/user with ID 1 exists
            },
            {
                title: "Sunset Jazz Night",
                description: "Smooth jazz, cocktails, and a breathtaking sunset view from the deck.",
                location: "New Orleans, LA",
                date: "2026-02-20",
                time: "06:00 PM",
                category: "Music",
                subCategory: "Jazz",
                status: "Approved",
                prices: { Standard: 85 },
                Quantity: { Standard: 50 },
                profileImage: "uploads/events/jazz.jpg",
                images: [],
                createdBy: 1
            },
            {
                title: "Comedy on the Ocean",
                description: "Laugh your heart out with top comedians while sailing the pacific.",
                location: "Los Angeles, CA",
                date: "2026-04-10",
                time: "08:00 PM",
                category: "Comedy",
                status: "Approved",
                prices: { Standard: 50 },
                Quantity: { Standard: 200 },
                profileImage: "uploads/events/comedy.jpg",
                images: [],
                createdBy: 1
            }
        ];

        for (const evt of events) {
            await Event.create(evt);
        }

        console.log("Seeded 3 approved events.");

    } catch (error) {
        console.error("Error seeding events:", error);
    } finally {
        await sequelize.close();
    }
}

seedEvents();
