import Invitation from "../models/Invitation.js";
import Group from "../models/Group.js";
import User from "../models/user.js";


export const inviteUser = async (req, res) => {
  try {
    const { groupId, toUserId } = req.body;

    // check group exists
    if (toUserId === req.userId)
  return res.status(400).json({ message: "Cannot invite yourself" });

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // only group member can invite
    if (!group.members.includes(req.userId)) {
      return res.status(403).json({ message: "Not a group member" });
    }

    // check if user exists
    const user = await User.findById(toUserId);
    if (!user) {
    return res.status(404).json({ message: "User not found" });
    }


    // prevent duplicate invite
    const existingInvite = await Invitation.findOne({
      groupId,
      toUserId,
      status: "pending",
    });

    if (existingInvite) {
      return res.status(400).json({ message: "Invitation already sent" });
    }

    const invite = await Invitation.create({
      groupId,
      fromUserId: req.userId,
      toUserId,
    });

    res.status(201).json({
      message: "Invitation sent",
      invite,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyInvitations = async (req, res) => {
  try {
    const invites = await Invitation.find({
      toUserId: req.userId,
      status: "pending",
    })
      .populate("groupId", "name")
      .populate("fromUserId", "username");  // ⭐ ADD THIS

    res.json(invites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const acceptInvitation = async (req, res) => {
  try {
    const { inviteId } = req.body;

    const invite = await Invitation.findById(inviteId);
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    // add user to group
    await Group.findByIdAndUpdate(invite.groupId, {
      $addToSet: { members: req.userId },
    });
    await Invitation.findByIdAndDelete(invite._id);
    res.json({ message: "Joined group successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectInvitation = async (req, res) => {
  try {
    const { inviteId } = req.body;

   await Invitation.findByIdAndDelete(inviteId);
   
    res.json({ message: "Invitation rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
