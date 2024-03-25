#!/usr/bin/env node
import { Toggl } from "toggl-track";
import { Duration } from "luxon";

const toggl = new Toggl({
  auth: {
    token: process.env.TOGGL_TRACK_API_TOKEN,
  },
});

const tagsDurations = {};

const entries = await toggl.timeEntry.list({
    startDate: "2024-03-23",
    endDate: "2024-03-24"
});

entries.forEach((timeEntry) => {
    timeEntry.tags.forEach((tagName) => {
        tagsDurations[tagName] ??= 0;
        tagsDurations[tagName] += timeEntry.duration;
    });
});

function durationToHuman(seconds) {
    const duration = Duration.fromObject({ seconds });
    const roundedMinutes = Math.ceil(duration.as('minutes'));
    const hours = Math.floor(roundedMinutes / 60);
    const minutes = roundedMinutes % 60;
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
}

// Sort tags from longest to shortest duration
const tagNames = Object.keys(tagsDurations);
tagNames.sort((a, b) => tagsDurations[b] - tagsDurations[a]);

tagNames.forEach((key) => {
    console.log(`- ${key} ${durationToHuman(tagsDurations[key])}`);
});
/*
Object.entries(tagsDurations).forEach(([key, value]) => {
    console.log(`- ${key} ${durationToHuman(value)}`);
});
*/
