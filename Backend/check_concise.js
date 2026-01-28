import sequelize from "./src/Database/db.js";
import Event from "./src/model/Event.js";
import User from "./src/model/User.js";
import "./src/model/index.js";

async function checkEvents() {
    try {
        const events = await Event.findAll();
        events.forEach(e => {
            console.log(`ID:${e.id}|STA:${e.status}|BY:${e.createdBy}`);
        });
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
}
checkEvents();
