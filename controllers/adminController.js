import Event from "../models/eventModel.js";
import isInsideAnyArea from "../utils/verifyLocation.js";

export const markAttendance = async (req, res) => {
  const teams = req.body;
  let notUpdatedTeams = [];
  try {
    const updatePromises = teams.map(async (team) => {
      const updatedEvent = await Event.findOneAndUpdate(
        { "registeredTeams.team_code": team.team_code },
        { $set: { "registeredTeams.$.is_present": team.present } },
        { new: true }
      );
      if (!updatedEvent) {
        notUpdatedTeams.push(team.team_name);
      }
    });
    await Promise.all(updatePromises);
    if (teams.length === notUpdatedTeams.length) {
      return res
        .status(404)
        .send({ message: "Invalid codes: Teams with these codes don't exist" });
    } else if (notUpdatedTeams.length === 0) {
      return res
        .status(201)
        .send({ message: "Attendance marked successfully" });
    } else {
      return res.status(201).send({
        notUpdatedTeams,
        message: "These teams were not marked present",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
export const getTeams = async (req, res) => {
  const eventId = req.params.eventId;
  try {
    const teams = await Event.find({ _id: eventId }, { title:1,registeredTeams: 1 });
    if (!teams || teams.length === 0) {
      return res.status(404).send({ message: "Teams not found" });
    }
    return res.json(teams);
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
export const getEvents = async (req, res) => {
  try {
    const Events = await Event.find(
      {},
      { title: 1, department: 1, eventStartTime: 1, eventEndTime: 1 }
    );
    return res.status(201).json(Events);
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
export const updateEventTime = async (req, res) => {
  const { eventId, eventStartTime, eventEndTime } = req.body;
  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId },
      { $set: { eventStartTime: eventStartTime, eventEndTime: eventEndTime } },
      { new: true }
    );
    if(!updatedEvent){
        return res.status(404).send({message:"Teams Not found"});
    }
    return res.json(updatedEvent);
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getAllTeams = async (req, res) => {
  try {
    const teams = await Event.find(
      {},
      {
        title: 1,
        "registeredTeams.team_name": 1,
        "registeredTeams.member.name": 1,
        "registeredTeams.is_present": 1,
      }
    );
    if (!teams || teams.length === 0) {
      return res.status(404).send({ message: "Teams not found" });
    }
    return res.json(teams);
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
