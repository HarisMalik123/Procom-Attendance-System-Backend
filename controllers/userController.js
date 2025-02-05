import Event from "../models/eventModel.js";
import isInsideAnyArea from "../utils/verifyLocation.js";

export const verify = async (req, res) => {
  const { teamcode, longitude, latitude } = req.body;

  try {
    const currentTime = new Date();
    const event = await Event.findOne({
      "registeredTeams.team_code": teamcode,
      
    })
  // console.log(event)
    if (!event) {
      return res
        .status(400)
        .json({ message: "Invalid Team Code or event is not started yet" });
    }
    const teamIndex = event.registeredTeams.findIndex(
      (team) => team.team_code === teamcode
    )
    if (teamIndex === -1) {
      return res.status(404).json({ message: "Team Not Found" });
    }
    if (!isInsideAnyArea(longitude, latitude)) {
      return res
        .status(403)
        .json({ message: "You are not inside the valid event location" })
    }
    event.registeredTeams[teamIndex].is_present = true;
    await event.save(); 
    return res
      .status(200)
      .json({ message: "Team marked as present successfully" })
  } catch (error) {
    console.error("Error verifying team presence:", error);
    return res.status(500).json({ message: "Internal Server Error" })
  }
};
