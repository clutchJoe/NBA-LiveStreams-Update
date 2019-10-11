const express = require("express");
const schedule = require("node-schedule");
// const fetchData = require("./nbaStreamCrawling.js");
const fetchData = require("./crawlAllPages.js");
const app = express();
const rule = new schedule.RecurrenceRule();
rule.second = 0;
rule.minute = [49, 17];

let source = [{ head: "Updating..." }];
app.use("/archive", express.static(__dirname + "/archive/"));
app.get("/live", (req, res) => {
    res.json(source);
});

const job = schedule.scheduleJob(rule, async () => {
    source = await fetchData();
});

const PORT = process.env.PORT || 4444;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
