import dbConnect from "../../../../middlewares/db.connect";
import verifiedUser from "../../../../middlewares/verifiedUser";
import InterviewSlot from "../../../../models/InterviewSlot";

async function handler(req, res) {
  const {
    query: { userId, interviewSlotId },
    method,
  } = req;
  const { partner } = req.body;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const interviewSlot = await InterviewSlot.findOne({
          "slots._id": interviewSlotId,
        });
        if (!interviewSlot) {
          return res.status(200).json({
            success: true,
            message: "Scheduled interview not found",
          });
        } else {
          interviewSlot.slots.id(interviewSlotId).partner = partner;
          const updatedInterviewSlot = await interviewSlot.save();
          const normalizedData = await updatedInterviewSlot
            .populate({
              path: "userId",
              select: "username fullName",
            })
            .populate({
              path: "slots.partner",
              select: "username fullName",
            })
            .execPopulate();
          res.status(200).json({
            success: true,
            data: normalizedData,
            message: "Successful",
          });
        }
      } catch (error) {
        res.status(400).json({ success: false, errorMessage: "Error" });
      }
      break;
    case "DELETE":
      try {
        const interviewSlots = await InterviewSlot.findOne({
          userId: userId,
        }).exec();
        if (!interviewSlots) {
          return res.status(200).json({
            success: true,
            message: "User's scheduled interviews not found",
          });
        } else {
          const interviewSlot = await InterviewSlot.findOne({
            "slots._id": interviewSlotId,
          });
          if (!interviewSlot) {
            return res.status(200).json({
              success: true,
              message: "Scheduled interview not found",
            });
          }
          interviewSlots.slots.pull({ _id: interviewSlotId });
          await interviewSlots.save();
          res.status(200).json({
            success: true,
            data: interviewSlotId,
            message: "Successful",
          });
        }
      } catch (error) {
        res.status(400).json({ success: false, errorMessage: "Error" });
      }
      break;
    default:
      res.status(400).json({ success: false, errorMessage: "Invalid" });
      break;
  }
}

export default verifiedUser(handler);
