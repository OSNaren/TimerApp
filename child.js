const querystring = require("querystring");
const fs = require("fs");

/**
 * @desc To create New Task
 * @param redata {JSON} Received Data
 */
function new_tasker(redata) {
    console.log(redata);
    fs.readFile('public/js/current.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var obj = JSON.parse(data);
            obj["currUser"]["lastTask"] = redata['task'];
            obj["currUser"]["lastTaskdesc"] = redata['desc'];
            obj["currUser"]["running"] = true;
            var json = JSON.stringify(obj);
            fs.writeFile('public/js/current.json', json, 'utf8', function writeFileCallback() {
            });
            console.log({message: "Current User Updated"});
        }
    });
}

/**
 * @desc To Add TimeLogs
 * @param redata{JSON} Received Data
 */
function add_logs(redata) {
    fs.readFile('public/js/current.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var obj = JSON.parse(data);
            obj["currUser"]["running"] = false;
            var myobj = obj["currUser"];
            var tobj = redata.lid;
            //myobj["logs"][tobj] = redata;
            var temp = {};
            temp[tobj] = redata;
            console.log('temp', temp);
            //obj["currUser"]["logs"] = temp
            Object.assign(myobj['logs'], temp);
            console.log('upd obj', obj);
            var json = JSON.stringify(obj);
            fs.writeFile('public/js/current.json', json, 'utf8', function writeFileCallback() {
            });
            console.log({message: "Current User Updated"});
        }
    });
}

/**
 * @desc To Edit Timelogs
 * @param edata {JSON} Received Data
 */
function edit_log(edata) {
    console.log(edata);
    fs.readFile('public/js/current.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var obj = JSON.parse(data);
            var myobj = obj["currUser"];
            var tobj = (edata['lid']).replace('#', '');
            var eobj = myobj['logs'][tobj];
            var oobj = myobj['logs'];
            console.log('~~~', tobj, oobj, edata['lid'])
            eobj['task'] = edata.task;
            eobj['desc'] = edata.desc;
            eobj['oldtime'] = eobj['totaltime'];
            eobj['totaltime'] = edata['time'];
            eobj['updtime'] = edata['time'];
            for (var i in oobj) {
                var val = oobj[i];
                if (val['new'] === edata['lid']) {
                    delete oobj[i];
                }
            }
            console.log('upd obj', obj);
            var json = JSON.stringify(obj);
            fs.writeFile('public/js/current.json', json, 'utf8', function writeFileCallback() {
            });
            console.log({message: "Current Log Updated"});
        }
    });
}

/**
 * @desc To Delete Timelogs
 * @param ddata {JSON} Received Data
 */
function delete_log(ddata) {
    console.log(ddata);
    fs.readFile('public/js/current.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var obj = JSON.parse(data);
            var myobj = obj["currUser"];
            var tobj = (ddata['lid']).replace('#', '');
            var eobj = myobj['logs']
            delete eobj[tobj];
            for (var i in eobj) {
                var val = eobj[i];
                if (val['new'] === ddata['lid']) {
                    delete eobj[i];
                }
            }
            console.log('upd obj', obj);
            var json = JSON.stringify(obj);
            fs.writeFile('public/js/current.json', json, 'utf8', function writeFileCallback() {
            });
            console.log({message: "Current Log Updated"});
        }
    });
}

// Handle Fork Requests
process.on('message', (message) => {
    if (message.msg === 'createnew') {
        let data = (message.data);
        new_tasker(data);
        process.send("done");
    }
    if (message.msg === 'editlog') {
        let data = (message.data);
        edit_log(data);
        process.send("done");
    }
    if (message.msg === 'deletelog') {
        let data = (message.data);
        delete_log(data);
        process.send("done");
    }
    if (message.msg === 'addlog') {
        let data = (message.data);
        console.log('redata', data);
        add_logs(data);
        process.send("done");
    }
});