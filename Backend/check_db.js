import sequelize from "./src/Database/db.js";
import Event from "./src/model/Event.js";
import User from "./src/model/User.js";
import "./src/model/index.js";

async function checkEvents() {
    try {
        await sequelize.authenticate();
        console.log("Database connected.");

        const events = await Event.findAll({
            include: [{ model: User, as: "artist" }]
        });

        console.log(`Total events found: ${events.length}`);
        events.forEach(e => {
            console.log(`ID: ${e.id}, Title: ${e.title}, Status: "${e.status}", CreatedBy: ${e.createdBy}, Artist: ${e.artist ? e.artist.name : 'NULL'}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkEvents();
