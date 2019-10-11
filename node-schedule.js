const schedule = require('node-schedule');
const fs = require("fs");

const rule = new schedule.RecurrenceRule();
rule.second = 0;
// rule.minute = [45,47];
const job = schedule.scheduleJob(rule, () => {
	fs.writeFile(
		"./static/list.json", 
		JSON.stringify(new Date(), null, "  "), 
		err => {
            if (err) throw err;
            console.log("File created and data written...");
        });
});

module.exports = job;