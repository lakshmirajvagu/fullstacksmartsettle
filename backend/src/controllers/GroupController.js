import Group from "../models/Group.js";

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    const group = await Group.create({
      name,
      createdBy: req.userId,
      members: [req.userId], // creator is first member
    });

    res.status(201).json({
      message: "Group created",
      group,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.userId,
    }).populate("members", "username email");

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
