
import UserProblem from "../model/UserProblem.js";
import User from "../model/User.js";

export const submitProblem = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!email || !message) {
            return res.status(400).json({ success: false, message: "Email and message are required" });
        }

        const problem = await UserProblem.create({
            name,
            email,
            subject,
            message,
            reportedBy: req.user ? req.user.id : null // req.user comes from authentication middleware if available
        });

        res.status(201).json({
            success: true,
            message: "Problem reported successfully",
            data: problem
        });
    } catch (error) {
        console.error('Error reporting problem:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to report problem',
            error: error.message
        });
    }
};

export const getAllProblems = async (req, res) => {
    try {
        const problems = await UserProblem.findAll({
            include: [
                {
                    model: User,
                    as: "reporter",
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(problems);
    } catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch problems',
            error: error.message
        });
    }
};

export const resolveProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const problem = await UserProblem.findByPk(id);

        if (!problem) {
            return res.status(404).json({ success: false, message: 'Problem not found' });
        }

        problem.status = "Resolved";
        await problem.save();

        res.status(200).json({
            success: true,
            message: 'Problem marked as resolved',
            data: problem
        });
    } catch (error) {
        console.error('Error resolving problem:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to resolve problem',
            error: error.message
        });
    }
};

export const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const problem = await UserProblem.findByPk(id);

        if (!problem) {
            return res.status(404).json({ success: false, message: 'Problem not found' });
        }

        await problem.destroy();

        res.status(200).json({
            success: true,
            message: 'Problem report deleted'
        });
    } catch (error) {
        console.error('Error deleting problem:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete problem',
            error: error.message
        });
    }
};
