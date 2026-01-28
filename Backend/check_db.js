import sequelize from "./src/Database/db.js";
import Event from "./src/model/Event.js";
import User from "./src/model/User.js";
import "./src/model/index.js";

async function checkEvents() {
    try {
        await sequelize.authenticate();
        console.log("Connected to database");

        const events = await Event.findAll({
            include: [{
                model: User,
                as: "artist",
                attributes: ['id', 'name', 'email']
            }]
        });

        console.log(`\nTotal events: ${events.length}`);
        events.forEach(e => {
            console.log(`\nID: ${e.id}`);
            console.log(`Title: ${e.title}`);
            console.log(`Status: ${e.status}`);
            console.log(`Created By: ${e.createdBy}`);
            console.log(`Artist: ${e.artist ? e.artist.name : 'No artist'}`);
        });

        const pendingEvents = await Event.findAll({
            where: { status: "pending" },
            include: [{
                model: User,
                as: "artist",
                attributes: ['id', 'name', 'email']
            }]
        });

        console.log(`\n\nPending events: ${pendingEvents.length}`);
        pendingEvents.forEach(e => {
            console.log(`\nID: ${e.id}`);
            console.log(`Title: ${e.title}`);
            console.log(`Status: ${e.status}`);
            console.log(`Artist: ${e.artist ? e.artist.name : 'No artist'}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}
checkEvents();
