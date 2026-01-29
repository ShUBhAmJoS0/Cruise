
import sequelize from "./src/Database/db.js";
import User from "./src/model/User.js";

async function checkAdmin() {
    try {
        await sequelize.authenticate();
        console.log("Database connected.");

        // Find all users
        const users = await User.findAll();
        console.log("Total users:", users.length);

        // Find admin
        const admins = await User.findAll({ where: { userType: 'Admin' } });
        console.log("Admins found:", admins.length);
        admins.forEach(a => console.log(`Admin User: ${a.name} (${a.email}) - Firebase UID: ${a.firebase_uid}`));

    } catch (error) {
        console.error("Error checking admin:", error);
    } finally {
        await sequelize.close();
    }
}

checkAdmin();
