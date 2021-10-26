var form_login = document.getElementById('login');
var form_signup = document.getElementById('signup');

$(".log-in").click(function () {
    $(".signIn").addClass("active-dx");
    $(".signUp").addClass("inactive-sx");
    $(".signUp").removeClass("active-sx");
    $(".signIn").removeClass("inactive-dx");
});

$(".back").click(function () {
    $(".signUp").addClass("active-sx");
    $(".signIn").addClass("inactive-dx");
    $(".signIn").removeClass("active-dx");
    $(".signUp").removeClass("inactive-sx");
});

salert = document.getElementById('successalert');
stext = document.getElementById('succ_span');
sname = document.getElementById('alert_uname');
simg = document.getElementById('userimg');

document.getElementById('successcloser').addEventListener('click', function (e) {
    $("#successalert").fadeOut(3000);
});

/**
 * @desc To Activate Page Transition
 */
function pg_trans(idd) {
    var layerClass = "." + idd + "-layer";
    var layers = document.querySelectorAll(layerClass);
    for (const layer of layers) {
        layer.classList.toggle("active");
    }
}

var outer_container = document.getElementById("outer-container");
var mytimer = document.getElementById("mytimer");
var pgtrans = document.getElementById("pg_trans");
var pgtransbot = document.getElementById("pg_trans_bot");

/**
 * @desc After Successful Validation
 * @param user_name {String} User Name
 * @param olnw {String} Login/Signup
 */
function proceed_user(user_name, olnw) {
    pgtrans.style.visibility = 'visible';
    pgtrans.style.display = 'block';
    pgtransbot.style.visibility = 'hidden';
    if (olnw === 'login') {
        $('#userimg').attr("src", "img/cool.gif");
        stext.innerHTML = 'Welcome Back!';
        sname.innerHTML = user_name;
    } else if (olnw === 'signup') {
        $('#userimg').attr("src", "img/kiss.gif");
        stext.innerHTML = 'Hey New One!';
        sname.innerHTML = user_name;
    }
    salert.style.display = 'block';
    setTimeout(function () {
        $("#successalert").fadeOut(500);

        outer_container.style.background = "linear-gradient(45deg, #a770ef, #cf8bf3, #fdb99b)";
        outer_container.style.backgroundSize = "400% 400%";
        outer_container.style.animation = "gradient 2s infinite ease-in-out;"
        $('head').append('<link href="css/menu.css" media="all" rel="stylesheet">');
    }, 2000);
    setTimeout(function () {
        $('head').append('<link href="css/bground.css" media="all" rel="stylesheet">');
        mytimer.style.display = 'initial';
        pg_trans('top');
        pgtrans.style.visibility = 'hidden';
        pgtransbot.style.display = 'none';
        pgtrans.style.display = 'none';
        pgtransbot.style.visibility = 'hidden';
    }, 3000);
    var logtemp = $('#logs-outer #log-temp').detach();
    $('#logs-outer').empty().append(logtemp);

    $("#login-image").fadeOut(1000);
    $("#color-bg").fadeIn(1000);
    pg_trans('top');
}


function logout_user(user_name) {
    $("#menu__toggle").trigger('click');
    pgtransbot.style.visibility = 'visible';
    pgtrans.style.visibility = 'hidden';
    pgtransbot.style.display = 'block';
    stext.innerHTML = 'See You Soon!';
    sname.innerHTML = user_name;
    salert.style.display = 'block';
    setTimeout(function () {
        $("#successalert").fadeOut(500);

        outer_container.style.backgroundSize = "100%";
        outer_container.style.animation = "gradient 2s infinite ease-in-out;"

    }, 3000);
    outer_container.style.background = "radial-gradient(circle, rgba(36, 36, 110, 0.751), rgba(28, 113, 175, 0.751))";
    setTimeout(function () {
        pgtrans.style.visibility = 'hidden';
        pgtrans.style.display = 'none';
        pgtransbot.style.display = 'none';
        pgtransbot.style.visibility = 'hidden';
        pg_trans('bottom');
    }, 3000);
    mytimer.style.display = 'none';
    $('link[rel=stylesheet][href*="css/menu.css"]').remove();
    $('link[rel=stylesheet][href*="css/bground.css"]').remove();
    $('#availusr').css("display", "none");
    $('#availpass').css("display", "none");
    $('#availrepass').css("display", "none");
    $(".log-in").trigger('click');
    $("#login-image").fadeIn(1000);
    $("#color-bg").fadeOut(1000);
    pg_trans('bottom');

}

ualert = document.getElementById('useralert');
document.getElementById('alertcloser').addEventListener('click', function (e) {
    $("#useralert").fadeOut(3000);
});

/**
 * @desc If unsuccessful Validation
 */

function stop_user() {
    ualert.style.display = 'block';
    setTimeout(function () {
        $("#useralert").fadeOut(3000);
    }, 5000);
}

/**
 * @desc Handle Login Form Submission
 */

$("#login").submit(function (e) {
    var log_name = document.getElementById('log-name').value;
    var log_pass = document.getElementById('log-pass').value;
    e.preventDefault();
    form_login.reset();
    $.ajax({
        url: 'http://localhost:6006/login',
        type: 'POST',
        data: {
            user: log_name,
            password: log_pass
        },
        success: function (msg) {
            //console.log('User logged in', msg);
            if (msg) {
                proceed_user(log_name, 'login');
                post_login_logs(log_name, 'login');
                setTimeout(addlistener, 3000);
            } else {
                stop_user();
            }
        }
    });
    return false;
});

/**
 * To get the Users from DB
 */

var my_json;
const remurl = 'http://localhost:6006/json';
const options = {method: 'GET'};
fetch(remurl, options)
    .then(async (res) => {
        //console.log(res);
        res = (await res.text());
        my_json = JSON.parse(res);
    })
    .catch((err) => console.error(err));

/**
 * @desc Handle Signup Form Submission
 */
$("#signup").submit(function (e) {
    var sign_name = document.getElementById('sign-name').value;
    var sign_pass = document.getElementById('sign-pass').value;
    var sign_repass = document.getElementById('sign-repass').value;
    //console.log(document.getElementById('sign-name').value);
    e.preventDefault();
    form_signup.reset();
    if (sign_pass === sign_repass) {
        //console.log(sign_name, sign_pass, sign_repass);
        $.ajax({
            url: 'http://localhost:6006/signup',
            type: 'POST',
            data: {
                user: sign_name,
                password: sign_pass
            },
            success: function (msg) {
                //console.log('User Created', msg);
                if (msg) {
                    proceed_user(sign_name, 'signup');
                } else {
                    stop_user();
                }
            }
        });
    }
    return false;
});

var signup_name = document.getElementById('sign-name')
var signup_pass = document.getElementById('sign-pass');
var signup_repass = document.getElementById('sign-repass');

/**
 * Event Listeners for Signup Page Elements
 */

signup_name.addEventListener('keyup', function (e) {
    $('#availusr').css("display", "initial");
    var tname = signup_name.value;
    if (tname in my_json) {
        //console.log(tname, "Not Available");
        $('#availusr').attr("src", "img/red.png");
    } else {
        //console.log("Available");
        $('#availusr').attr("src", "img/green.png");
    }
});

signup_pass.addEventListener('keyup', function (e) {
    $('#availpass').css("display", "initial");
    var tpass = signup_pass.value;
    if (tpass.length >= 4) {
        $('#availpass').attr("src", "img/green.png");
    } else {
        $('#availpass').attr("src", "img/red.png");
    }
});

signup_repass.addEventListener('keyup', function (e) {
    $('#availpass').css("display", "initial");
    $('#availrepass').css("display", "initial");
    var tpass = signup_pass.value;
    var trepass = signup_repass.value;
    //console.log(tpass, trepass);
    if (tpass === trepass) {
        $('#availrepass').attr("src", "img/green.png");
    } else {
        $('#availrepass').attr("src", "img/red.png");
    }
});

// To Focus Initial Input Box
window.addEventListener('load', (event) => {
    //console.log('page is fully loaded');
    setTimeout(function () {
        document.getElementById("log-name").focus();
    }, 4000);
});

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()

//proceed_user("hi", 'login');
//post_login_logs("hi", 'login');