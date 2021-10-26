var uparrow = document.getElementById('degree--up-0');
var downarrow = document.getElementById('degree--down-0');
var menulist = document.getElementById("menu__listings");
var menutoggle = document.getElementById("menu__toggle");

var clickcnt = 0;
uparrow.addEventListener('click', function (e) {
    clickcnt += 1;
    switch (clickcnt) {
        case 1:
            menulist.style.transform = 'rotate(116deg) scale(0.95)';
            break;
        case 2:
            menulist.style.transform = 'rotate(224deg) scale(0.95)';
            break;
        case 3:
            menulist.style.transform = 'rotate(10deg) scale(0.95)';
            clickcnt = 0;
            break;
    }
});

downarrow.addEventListener('click', function (e) {
    switch (clickcnt) {
        case 0:
            menulist.style.transform = 'rotate(224deg) scale(0.95)';
            clickcnt = 3;
            break;
        case 2:
            menulist.style.transform = 'rotate(116deg) scale(0.95)';
            break;
        case 1:
            menulist.style.transform = 'rotate(10deg) scale(0.95)';
            break;
    }
    clickcnt -= 1;
});

m_up_arr = document.getElementById("m_arr_up");
m_down_arr = document.getElementById("m_arr_down");
var toggle = false;
menutoggle.addEventListener('click', function (e) {
    if (!toggle) {
        toggle = true;
        menulist.style.transform = 'rotate(10deg) scale(0.95)';
        m_up_arr.style.display = 'block';
        m_down_arr.style.display = 'block';
    } else {
        toggle = false;
        menulist.style.transform = 'rotate(10deg) scale(0.0)';
        m_up_arr.style.display = 'none';
        m_down_arr.style.display = 'none';
    }
});

logoutbtn = document.getElementById("logout_btn");
logoutbtn.addEventListener('click', function (e) {
    e.preventDefault();
    $.ajax({
        url: 'http://localhost:6006/logout',
        type: 'GET',
        success: function (msg) {
            //console.log('User logged out', msg);
            logout_user(msg)
        }
    });
});

var tcreate = document.getElementById('createh2');
var logsname = document.getElementById('logs-name');
$('#createh2').mouseenter(function (e) {
    tcreate.classList.add('headline', 'headline--flip');
    Splitting();
}).mouseleave(function (e) {
    //////console.log('left');
    tcreate.classList.remove('headline', 'headline--flip');
});

$('#logs-name').mouseenter(function (e) {
    logsname.classList.add('headline', 'headline--rock');
    Splitting();
}).mouseleave(function (e) {
    logsname.classList.remove('headline', 'headline--rock');
});

$(document).ready(function () {
    var icon = $('.play');
    icon.click(function () {
        icon.toggleClass('active');
        return false;
    });
});

$("#running_task").children().css('visibility', 'visible');

var create_form = document.getElementById('create_task_form');

var create_name = document.getElementById('createTaskName');
var create_desc = document.getElementById('createTaskDesc');

var runt_nameh = document.getElementById('runt_nameH');
var runt_desch = document.getElementById('runt_descH');
var runt_timeh = document.getElementById('runt_timeH');

var playbtn = document.getElementById('play-btn');
var stopbtn = document.getElementById('stop-btn');

var logsouter = document.getElementById('logs-outer');
var jqlogsouter = $("#logs-outer");


var myModalEl = document.getElementById('exampleModal')
myModalEl.addEventListener('hidden.bs.modal', function (event) {
    //console.log(event);
    setTimeout(function () {
        //$("#stop-btn").trigger('dblclick');
    }, 500);
});
var st_time = "", en_time = "";
var mytimer_arr = [];

function start_timer(ssbool) {
    var minutesLabel, secondsLabel, hoursLabel;
    var totalSeconds = 0, totalMinutes = 0, totalHours = 0;
    if (ssbool === true) {
        var new_timer = setInterval(setTime, 1000);
        mytimer_arr.push(new_timer);
        //console.log('timers', mytimer_arr, new_timer);
        var cur_time = runt_timeh.innerHTML;
        cur_time = (cur_time.replace(' ', '')).split(':');
        totalSeconds = Number(cur_time[2]);
        totalMinutes = Number(cur_time[1]);
        totalHours = Number(cur_time[0]);
    } else {
        stop_timer();
        en_time = new Date().toLocaleString("en-IN");
    }

    function setTime() {
        ++totalSeconds;
        secondsLabel = ("0" + (totalSeconds % 60)).slice(-2);
        if (totalSeconds >= 60) {
            totalMinutes++;
            totalSeconds = 0;
        }
        if (totalMinutes >= 60) {
            totalHours++;
            totalMinutes = 0;
        }
        minutesLabel = ("0" + totalMinutes).slice(-2);
        hoursLabel = ("0" + totalHours).slice(-2);

        runt_timeh.innerHTML = hoursLabel + ": " + minutesLabel + ": " + secondsLabel;
    }

    var mtarr = [];

    function stop_timer() {
        mytimer_arr.forEach(item => {
            //console.log('timers', item);
            clearInterval(item);
            clearTimeout(item);
            item = null;
        });
        mytimer_arr.splice(0, mytimer_arr.length);
    }

}

var jqplay = $('.play');
jqplay.on('click', function (e) {
    if (jqplay.hasClass('active')) {
        //clearInterval(new_timer);
        //console.log('start');
        start_timer(false);
    } else {
        //console.log('stop');
        start_timer(true);
    }
});

var logtemp = document.getElementById('log-temp');
var jqlogtemp = $("#log-temp");
var logCount = 0;

function add_toLogs(tname, tdesc, ttime, tbool) {
    $("#empty-icon").fadeOut(500);
    logCount++;
    //console.log(tname + ": " + tdesc + ":" + ttime);
    if (tbool === true) {
        $.ajax({
            url: 'http://localhost:6006/addlog',
            type: 'POST',
            data: {
                lid: 'log' + logCount,
                new: tbool,
                task: tname,
                desc: tdesc,
                time: ttime,
                totaltime: ttime,
                start: st_time,
                end: en_time
            },
            success: function (msg) {
                //console.log('New Task', msg);
                if (msg) {

                }
            }
        });
        //console.log('New', tbool);
        var newlog = jqlogtemp.clone();
        newlog.attr('id', 'log' + logCount);
        newlog.css('display', 'flex');
        var nlchild = newlog.children();
        nlchild.eq(0).children()[0].innerHTML = tname;
        nlchild.eq(1).children()[0].innerHTML = tdesc;
        nlchild.eq(2).children()[0].innerHTML = ttime;
        jqlogsouter.prepend(newlog);
    } else {
        //console.log('Old', tbool);
        log_update(tname, tdesc, ttime, tbool);
    }
}

function post_addlogs(pjson) {
    var logs = pjson['logs'];
    for (var key in logs) {
        if (logs.hasOwnProperty(key)) {
            var val = logs[key];
            //console.log('post new', val);
            logCount++;
            if (val['new'] === "true") {
                var newlog = jqlogtemp.clone();
                newlog.attr('id', val['lid']);
                newlog.css('display', 'flex');
                var nlchild = newlog.children();
                nlchild.eq(0).children()[0].innerHTML = val['task'];
                nlchild.eq(1).children()[0].innerHTML = val['desc'];
                nlchild.eq(2).children()[0].innerHTML = val['totaltime'];
                jqlogsouter.prepend(newlog);
            } else {
                var tlog = $(val['new']);
                var tchild = newlog.children();
                tchild.eq(2).children()[0].innerHTML = val['totaltime'];
            }
        }
    }
}

function post_login_logs(name, tmod) {
    //console.log(name, tmod);
    var my_json;
    const remurl = 'http://localhost:6006/userdata';
    const options = {method: 'GET'};
    fetch(remurl, options)
        .then(async (res) => {
            res = (await res.text());
            my_json = JSON.parse(res);
            return my_json;
        })
        .then((res) => {
            //console.log(res);
            post_addlogs(res);
        })
        .catch((err) => console.error(err));

}

playbtn.addEventListener('dblclick', function (e) {
    //console.log('dblclick');
    var tname = runt_nameh.innerHTML;
    var tdesc = runt_desch.innerHTML;
    var ttime = runt_timeh.innerHTML;
    var tbool = runt_nameh.title;
    tbool = (tbool === 'NewTask') ? true : runt_nameh.title;
    $("#play-btn").removeClass('active');
    add_toLogs(tname, tdesc, ttime, tbool);
    playbtn.style.display = 'none';
    stopbtn.style.display = 'block';
    runt_nameh.innerHTML = 'Task X';
    runt_desch.innerHTML = 'Description X';
    start_timer(false);
    runt_timeh.innerHTML = '00: 00: 00';
    addlistener();
});

stopbtn.addEventListener('click', function (e) {
    stopbtn.style.display = 'none';
    playbtn.style.display = 'block';
    $("#create-img").trigger('click');
});

function newTask(tname, tdesc, tbool) {
    runt_nameh.innerHTML = tname;
    runt_desch.innerHTML = tdesc;
    st_time = new Date().toLocaleString("en-IN");
    if (tbool === 'Resume') {
        start_timer(true);
        $("#play-btn").addClass('active');
    } else {
        jqplay.trigger('click');
        create_form.reset();
    }
}

$("#create_task_form").submit(function (e) {
    var tname = create_name.value;
    var tdesc = create_desc.value;
    e.preventDefault();
    $.ajax({
        url: 'http://localhost:6006/createnew',
        type: 'POST',
        data: {
            task: tname,
            desc: tdesc
        },
        success: function (msg) {
            //console.log('New Task', msg);
            if (msg) {
                newTask(tname, tdesc, 'NewTask');
                runt_nameh.title = "NewTask";
                $("#createModalClose").trigger('click');
                stopbtn.style.display = 'none';
                playbtn.style.display = 'block';
                //$("#play-btn").trigger('click');
            } else {
                stop_user();
            }
        }
    });
    return false;
});

/*      --- Timelog Scripts ---     */

function log_update(tname, tdesc, ttime, tbool) {
    var uplog = $(tbool);
    var upchild = uplog.children();
    var intime = upchild.eq(2).children()[0];
    ttime = (ttime.replace(' ', '')).split(':');
    var extime = (intime.innerHTML.replace(' ', '')).split(':');
    ttime = ttime.map(i => Number(i));
    extime = extime.map(i => Number(i));
    var sum = ttime.map((v, i) => v + extime[i]);
    //console.log('sum: ' + sum);
    for (var i = sum.length - 1; i >= 0; i--) {
        if (sum[i] >= 60) {
            sum[i - 1] = sum[i - 1] + 1;
            sum[i] = sum[i] % 60;
        }
    }
    sum = sum.map(i => ("0" + i).slice(-2))
    sum = sum.join(': ');
    intime.innerHTML = sum;
    $.ajax({
        url: 'http://localhost:6006/addlog',
        type: 'POST',
        data: {
            lid: 'log' + logCount,
            new: tbool,
            task: tname,
            desc: tdesc,
            time: ttime.join(': '),
            totaltime: sum,
            start: st_time,
            end: en_time
        },
        success: function (msg) {
            //console.log('New Task', msg);
            if (msg) {
                //$("#play-btn").trigger('click');
            }
        }
    });
}

function resume_task(tid) {
    var relog = $(tid);
    //console.log("resumed");
    var rechild = relog.children();
    var tname = rechild.eq(0).children()[0].innerHTML;
    var tdesc = rechild.eq(1).children()[0].innerHTML;
    var ttime = rechild.eq(2).children()[0].innerHTML;
    newTask(tname, tdesc, 'Resume');
    runt_nameh.title = tid;
    stopbtn.style.display = 'none';
    playbtn.style.display = 'block';
    $.ajax({
        url: 'http://localhost:6006/createnew',
        type: 'POST',
        data: {
            task: tname,
            desc: tdesc
        }
    });
}

var modalbtn = document.getElementById('editModalbtn');
var edit_form = document.getElementById('edit_task_form');

var edit_name = document.getElementById('editTaskName');
var edit_desc = document.getElementById('editTaskDesc');
var edit_time = document.getElementById('editTaskTime');
var edit_id = '';

function addlistener() {
    jqtledit = [...document.querySelectorAll('.tlog_edit')];
    jqtlplay = [...document.querySelectorAll('.tlog_play')];
    tledit = document.getElementsByClassName('tlog_edit');
    tlplay = document.getElementsByClassName('tlog_play');

    for (var x of tlplay) {
        //console.log(x);
        x.addEventListener('click', (evt) => {
            var ele = evt.target;
            //console.log('Clicked', ele);
            var tid = (ele.parentElement.parentElement.id);
            resume_task("#" + tid);
        });
    }

    for (var y of tledit) {
        y.addEventListener('click', (evt) => {
            var ele = evt.target;
            //console.log('Clicked', ele);
            var tid = "#" + (ele.parentElement.parentElement.id);
            edit_id = tid;
            var relog = $(tid);
            var rechild = relog.children();
            var tname = rechild.eq(0).children()[0].innerHTML;
            var tdesc = rechild.eq(1).children()[0].innerHTML;
            var ttime = rechild.eq(2).children()[0].innerHTML;

            //console.log('Edit', tid, tname, tdesc, ttime);
            edit_name.value = tname;
            edit_desc.innerHTML = tdesc;
            edit_time.value = ttime;
            $("#editModalbtn").trigger('click');
        });
    }
}

//addlistener();

function update_edit(tname, tdesc, ttime) {
    var elog = $(edit_id);

    var echild = elog.children();
    echild.eq(0).children()[0].innerHTML = tname;
    echild.eq(1).children()[0].innerHTML = tdesc;
    echild.eq(2).children()[0].innerHTML = ttime;
}

$("#edit_task_form").submit(function (e) {
    var tname = edit_name.value;
    var tdesc = edit_desc.value;
    var ttime = edit_time.value;
    e.preventDefault();
    $.ajax({
        url: 'http://localhost:6006/editlog',
        type: 'POST',
        data: {
            lid: edit_id,
            task: tname,
            desc: tdesc,
            time: ttime
        },
        success: function (msg) {
            //console.log('Edit Task', msg);
            if (msg) {
                update_edit(tname, tdesc, ttime);
                $("#editModalClose").trigger('click');
            }
        }
    });
    return false;
});

var delbtn = document.getElementById("del-btn");
delbtn.addEventListener('click', function (e) {
    //console.log(e);
    $.ajax({
        url: 'http://localhost:6006/deletelog',
        type: 'POST',
        data: {
            lid: edit_id
        },
        success: function (msg) {
            //console.log('Delete Task', msg);
            if (msg) {
                $(edit_id).remove();
            }
        }
    });

});

/*      --- Import - Export ---     */

var exportbtn = document.getElementById('export-btn');
var exportbtn2 = document.getElementById('export-btn2');

exportbtn.addEventListener('click', (evt) => {
    $("#menu__active").prop('checked', true);
    const remurl = 'http://localhost:6006/export';
    const options = {method: 'GET'};
    fetch(remurl, options)
        .then(async (res) => {
            res = (await res.text());
            return (res);
        })
        .then((res) => {
            //console.log(res);
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(res);
            hiddenElement.target = '_blank';

            //provide the name for the CSV file to be downloaded
            hiddenElement.download = 'sample.csv';
            hiddenElement.click();
        })
        .catch((err) => console.error(err));
});

exportbtn2.addEventListener('mousedown', (evt) => {
    $("#menu__active").prop('checked', true);
    const remurl = 'http://localhost:6006/export';
    const options = {method: 'GET'};
    fetch(remurl, options)
        .then(async (res) => {
            res = (await res.text());
            return (res);
        })
        .then((res) => {
            //console.log(res);
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + escape(res);
            hiddenElement.target = '_blank';

            //provide the name for the CSV file to be downloaded
            hiddenElement.download = 'sample.csv';
            hiddenElement.click();
        })
        .catch((err) => console.error(err));
});

function post_import(jdata) {
    var nlid = {};
    for (var key in jdata) {
        var val = jdata[key];
        var lid = val['lid'];
        if (lid !== '') {
            var tm = {};
            logCount++;
            tm[val['lid']] = '#log' + logCount;
            nlid = Object.assign(nlid, tm);
            //console.log(logCount, nlid);
            if (val['new'] === "true") {
                var newlog = jqlogtemp.clone();
                newlog.attr('id', 'log' + logCount);
                newlog.css('display', 'flex');
                var nlchild = newlog.children();
                nlchild.eq(0).children()[0].innerHTML = val['task'];
                nlchild.eq(1).children()[0].innerHTML = val['desc'];
                nlchild.eq(2).children()[0].innerHTML = val['totaltime'];
                jqlogsouter.prepend(newlog);
            } else {
                var nid = nlid[(val['new'].replace('#', ''))];
                //console.log(nid, val['new']);
                var tlog = $(nid);
                var tchild = tlog.children();
                tchild.eq(2).children()[0].innerHTML = val['totaltime'];
            }
        }
    }
    addlistener();
}

var importbtn = document.getElementById('import-btn');
var importbtn2 = document.getElementById('import-btn2');
var importbtnarr = [importbtn, importbtn2];

importbtnarr.forEach(function (btn) {
    btn.addEventListener('click', (evt) => {

        $("#menu__active").prop('checked', false);

        const fileSelector = document.getElementById('file-selector');
        fileSelector.click();

        fileSelector.addEventListener('change', (event) => {
            const fileList = event.target.files;
            var myFile = fileList[0];
            //console.log(myFile.text());
            var reader = new FileReader();
            reader.addEventListener('load', function (e) {
                //console.log(e.target.result);
                var mycsv = e.target.result;
                const remurl = 'http://localhost:6006/import';
                const options = {method: "POST", body: mycsv};
                fetch(remurl, options)
                    .then(async (res) => {
                        res = (await res.text());
                        return (res);
                    })
                    .then((res) => {
                        //console.log(JSON.parse(res));
                        menulist.style.transform = 'rotate(10deg) scale(0.0)';
                        $("#menu__toggle").trigger('click');
                        post_import(JSON.parse(res));
                    })
                    .catch((err) => console.error(err));
            });
            reader.readAsBinaryString(myFile);

        });
    });
})
