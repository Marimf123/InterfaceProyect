//Login va cambiando de login a register
$(document).ready(function() {

    $('.login-info-box').fadeOut();
    $('.login-show').addClass('show-log-panel');

    $("#log-login-show").click(function() {

        $('.register-info-box').fadeOut();
        $('.login-info-box').fadeIn();

        $('.white-panel').addClass('right-log');
        $('.register-show').addClass('show-log-panel');
        $('.login-show').removeClass('show-log-panel');
    });

    $("#log-login-show-movil").click(function() {

        $('.register-info-box').fadeOut();
        $('.login-info-box').fadeIn();

        $('.white-panel').addClass('right-log');
        $('.register-show').addClass('show-log-panel');
        $('.login-show').removeClass('show-log-panel');

    });

    $("#log-reg-show").click(function() {

        $('.register-info-box').fadeIn();
        $('.login-info-box').fadeOut();

        $('.white-panel').removeClass('right-log');

        $('.login-show').addClass('show-log-panel');
        $('.register-show').removeClass('show-log-panel');

    });
    $("#log-reg-show-movil").click(function() {

        $('.register-info-box').fadeIn();
        $('.login-info-box').fadeOut();

        $('.white-panel').removeClass('right-log');

        $('.login-show').addClass('show-log-panel');
        $('.register-show').removeClass('show-log-panel');

    });

    $(document).keypress(function(e) {
        if (e.which == 13) {
            LoginFunction();
        }
    });


    /* initiate plugin */
    $(".holder").jPages({
        containerID: "itemContainer",
        perPage: 3
    });

    /* on select change */
    $("#paginate_show").change(function() {
        /* get new nº of items per page */
        var newPerPage = parseInt($(this).val());

        /* destroy jPages and initiate plugin again */
        $(".holder").jPages("destroy").jPages({
            containerID: "itemContainer",
            perPage: newPerPage
        });
    });

});

//Operaciones para entrar en la pagina
//Registrarse en la pagina web
function RegisterFunction() {
    var $registerForm = $("#register_form");
    if ($registerForm.valid()) {

        //Se crea el array de JSON
        var all_people = [];
        var all_subject = [];
        var new_subject = [];

        //Se copian las asignaturas guardadas
        if (document.cookie.indexOf("_subjects") != -1) {
            all_subject = $.parseJSON(getCookie("_subjects"));
            new_subject = Object.values(all_subject);
        }

        var number_elem = 0;
        var array = [];
        if (document.getElementById("rol").value == "student") {
            array = new_subject;
            //Elegir numero aleatorio entre 1 y 6
            number_elem = Math.floor(Math.random() * 6) + 1;
        } else {
            array = ["IS", "IU", "AC", "RO", "Prog", "EC"];
            //Elegir numero aleatorio entre 3 y 6
            number_elem = Math.floor(Math.random() * 4) + 3;
        }

        //Se selecciona las asignaturas aleatorias
        var shuffled = array.sort(function() { return .5 - Math.random() });
        var selected = shuffled.slice(0, number_elem);

        //Se guarda el objeto del usuario reegistrandose
        var people = {
            'user': document.getElementById("register_user").value,
            'name': document.getElementById("register_first_name").value,
            'last_name': document.getElementById("register_last_name").value,
            'password': document.getElementById("register_password").value,
            'email': document.getElementById("register_email").value,
            'rol': document.getElementById("rol").value,
            'subject': selected,
        };

        for (i = 0; i < selected.length; i++) {
            var check = true;
            for (j = 0; j < new_subject.length; j++) {
                if (selected[i] == new_subject[j]) {
                    check = false;
                }
            }
            if (check) {
                new_subject.push(selected[i]);
            }
        }

        var arrayToString = JSON.stringify(Object.assign({}, new_subject)); // convert array to string
        var stringToJsonObject = JSON.parse(arrayToString); // convert string to json object

        var date = new Date();
        date.setTime(date.getTime() + (4 * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();

        //Si no existe el objeto se añade people al array
        if (document.cookie.indexOf("_people") == -1) {
            all_people.push(people);
        } else {
            //Si existe el objeto se copia lo que tenga y luego se añade people
            all_people = $.parseJSON(getCookie("_people"));
            all_people.push(people);
        }

        //Se guardan las dos cookies
        cookieString = "_people" + "=" + JSON.stringify(all_people) + expires + "; path=/";
        cookieString_usuario = "_usuario_actual" + "=" + JSON.stringify(people) + expires + "; path=/";
        cookieString_subjects = "_subjects" + "=" + JSON.stringify(stringToJsonObject) + expires + "; path=/";

        document.cookie = cookieString;
        document.cookie = cookieString_usuario;
        document.cookie = cookieString_subjects;

        UsernameFunction();
        RolFunction();
        SubjectShow();
        UpdateActivities();
        PutCalifications();
        document.getElementById("log-login-show").checked = true;
        document.getElementById("login_page").style.display = "none";
        document.getElementById("main_page").style.display = "block";
        document.getElementById("footer_main").style.display = "flex";

    }
}

//Entrar en la pagina por el login
function LoginFunction() {
    var $loginForm = $("#login_form");
    if ($loginForm.valid()) {
        if (checkLogin()) {
            document.getElementById("login_page").style.display = "none";
            document.getElementById("main_page").style.display = "block";
            document.getElementById("footer_main").style.display = "flex";
            UsernameFunction();
            RolFunction();
            SubjectShow();
            UpdateActivities();
            PutCalifications();
        }

    }
}


//Comprobar que el login es correcto
function checkLogin() {
    var newemail = document.getElementById("login_email").value;
    var newpassword = document.getElementById("login_password").value;

    //Se crea un array de json vacio
    var all_people = [];
    //Se compruba que exista la cookie de personas
    if (document.cookie.indexOf("_people") == -1) {
        document.getElementById("user_confirmation").innerHTML = "Email " + newemail + " is not registered";
        return false;

    } else {
        all_people = $.parseJSON(getCookie("_people"));
        //Si hay personas refistradas se hace un for comprobando a los usuarios
        for (x of all_people) {
            if (x.email == newemail && x.password == newpassword) {
                var people = {
                    'user': x.user,
                    'name': x.name,
                    'last_name': x.last_name,
                    'password': x.password,
                    'email': x.email,
                    'rol': x.rol,
                    'subject': x.subject,
                };
                //Si se encuentra se crea la cookie de usuario actual
                var date = new Date();
                date.setTime(date.getTime() + (4 * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
                cookieString_usuario = "_usuario_actual" + "=" + JSON.stringify(people) + expires + "; path=/";
                document.cookie = cookieString_usuario;
                return true;
            } else if (x.email == newemail && x.password != newpassword) {
                document.getElementById("user_confirmation").innerHTML = "Wrong password";
                return false;
            }
        }
        //Si no se encuentra el usuario es que no existe
        document.getElementById("user_confirmation").innerHTML = "Email " + newemail + " is not registered";
        return false;
    }
}

//Salir de la pagina al formulario
function LogOutFunction() {
    if (confirm('¿Esta seguro/a de que desea abandonar sesion?')) {
        window.location.reload();
    }
}

function DisplaySubmenu() {
    $(".submenu").fadeToggle();
}


//Saber que rol es
function RolFunction() {

    if (document.cookie.indexOf("_usuario_actual") != -1) {
        usuario_actual = $.parseJSON(getCookie("_usuario_actual"));

        var student = "student";
        if (student == usuario_actual.rol) {
            My_studentGrade();
            $(".just_profesor").hide();
            $(".just_student").show();
        } else {
            All_studentGrade();
            $(".just_student").hide();
            $(".just_profesor").show();
        }
    }

};

//Poner el nombre del usuario en el menu 
function UsernameFunction() {
    if (document.cookie.indexOf("_usuario_actual") != -1) {
        usuario_actual = $.parseJSON(getCookie("_usuario_actual"));
        var username = usuario_actual.name + ' ' + usuario_actual.last_name;
        document.getElementById("user_name_menu").innerHTML = username;
        // document.getElementById("user_grade").innerHTML = username;
    }
};


function SubjectShow() {
    if (document.cookie.indexOf("_usuario_actual") != -1) {
        usuario_actual = $.parseJSON(getCookie("_usuario_actual"));
        for (i in usuario_actual.subject) {
            $("." + usuario_actual.subject[i] + "_subjects").show();
        }
    }
};

function SaveMaterial() {
    if (confirm('¿Esta seguro/a de que desea subir el material?')) {
        //Se crea el array de JSON
        var all_Material = [];
        var subject = document.getElementById("material_title").innerHTML;
        // var subjectq = $(this).closest('[id]').attr('id');
        var subject_cookie;
        switch (subject) {
            case "Ingenieria del Software":
                subject_cookie = "IS";
                showIS();
                break;
            case "Interfaces de usuario":
                subject_cookie = "IU";
                showIU();
                break;
            case "Arquitectura de computadores":
                subject_cookie = "AC";
                showAC();
                break;
            case "Programacion":
                subject_cookie = "Prog";
                showProg();
                break;
            case "Estructura de computadores":
                subject_cookie = "EC";
                showEC();
                break;
            default:
                subject_cookie = "RO";
                showRO();
        }

        //Se guarda el objeto del usuario reegistrandose
        var material = {
            'subject': subject_cookie,
            'name': document.getElementById("material_name").value,
            'text': document.getElementById("textarea_material").value,
        };

        //Se copian las asignaturas guardadas
        if (document.cookie.indexOf("_material") != -1) {
            all_Material = $.parseJSON(getCookie("_material"));
            all_Material.push(material);
        } else {
            all_Material.push(material);
        }

        var date = new Date();
        date.setTime(date.getTime() + (4 * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();

        //Se guardan las dos cookies
        cookieString = "_material" + "=" + JSON.stringify(all_Material) + expires + "; path=/";
        document.cookie = cookieString;
        var html_to_inyect = '<div class = "material_message"><h4 class="title_new_material">' + material.name + '<i class="fas fa-book-open"></i></h4> <p> ' + material.text + '</p></div>';
        var object_topic_message = "#all_material_inside_clases_" + material.subject;
        $(object_topic_message).append(html_to_inyect);
        $("#form_material").trigger("reset");
    }
    alert("El material ha sido subido con exito");
};



function SaveActivities() {
    if (confirm('Estas seguro/a de que desea subir la Actividad?')) {
        //Se crea el array de JSON
        var all_Activities = [];
        var subject = document.getElementById("Activity_title").innerHTML;
        //  console.log(subject);
        // var subjectq = $(this).closest('[id]').attr('id');
        var subject_cookie;
        switch (subject) {
            case "Ingenieria del Software":
                subject_cookie = "IS";
                showIS();
                break;
            case "Interfaces de usuario":
                subject_cookie = "IU";
                showIU();
                break;
            case "Arquitectura de computadores":
                subject_cookie = "AC";
                showAC();
                break;
            case "Programacion":
                subject_cookie = "Prog";
                showProg();
                break;
            case "Estructura de computadores":
                subject_cookie = "EC";
                showEC();
                break;
            default:
                subject_cookie = "RO";
                showRO();
        }

        //Se guarda el objeto del usuario reegistrandose
        var activity = {
            'subject': subject_cookie,
            'name': document.getElementById("name_activity_input").value,
            'text': document.getElementById("textarea_activity").value,
            'date': document.getElementById("date_activity").value + "," + document.getElementById("time_activity").value,
        };

        //Se copian las actividades guardadas
        if (document.cookie.indexOf("_activity") != -1) {
            all_Activities = $.parseJSON(getCookie("_activity"));
            all_Activities.push(activity);
        } else {
            all_Activities.push(activity);
        }

        var date = new Date();
        date.setTime(date.getTime() + (4 * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();

        //Se guardan las dos cookies
        cookieString = "_activity" + "=" + JSON.stringify(all_Activities) + expires + "; path=/";
        document.cookie = cookieString;
        var html_to_inyect = '<div class = "activity_message"><button class="title_new_act"><i class="fas fa-file"></i><span>' + activity.name + '</span></button> <p> ' + activity.text + '</p></div>';
        var object_topic_message = "#all_activities_inside_clases_" + activity.subject;
        $(object_topic_message).append(html_to_inyect);

        $('#calendar_general').evoCalendar('addCalendarEvent', {     
            id: subject_cookie + document.getElementById("name_activity_input").value,
                 name: subject_cookie + " " + document.getElementById("name_activity_input").value + " " + document.getElementById("time_activity").value,
                 description: document.getElementById("textarea_activity").value,
                 date: SaveDAteCalendar(document.getElementById("date_activity").value),
                 type: 'event'
        });

        $('#calendar_' + subject_cookie).evoCalendar('addCalendarEvent', {     
            id: subject_cookie + document.getElementById("name_activity_input").value,
                 name: document.getElementById("name_activity_input").value + " " + document.getElementById("time_activity").value,
                 description: document.getElementById("textarea_activity").value,
                 date: SaveDAteCalendar(document.getElementById("date_activity").value),
                 type: 'event'
        });

        $("#form_activity").trigger("reset");
    }
};



function SaveDAteCalendar(date) {
    var fechaArr = date.split('-');
    var i_mes = parseInt(fechaArr[1], 10) - 1;
    monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var mes = monthsShort[i_mes];
    var date = mes + " " + fechaArr[fechaArr.length - 1] + ", " + fechaArr[0];
    return date;
};


function SaveActivity_Response() {
    if (confirm('Estas seguro/a de que desea subir la tarea?')) {

        //Se crea el array de JSON
        var all_Responses = [];
        var user_act = [];
        var subject = document.getElementById("activity_response_subject").innerHTML;
        var title_activity = document.getElementById("activity_response_title").innerHTML;
        // var subjectq = $(this).closest('[id]').attr('id');
        var subject_cookie;
        switch (subject) {
            case "Ingenieria del Software":
                subject_cookie = "IS";
                showIS();
                break;
            case "Interfaces de usuario":
                subject_cookie = "IU";
                showIU();
                break;
            case "Arquitectura de computadores":
                subject_cookie = "AC";
                showAC();
                break;
            case "Programacion":
                subject_cookie = "Prog";
                showProg();
                break;
            case "Estructura de computadores":
                subject_cookie = "EC";
                showEC();
                break;
            default:
                subject_cookie = "RO";
                showRO();
        }

        if (document.cookie.indexOf("_usuario_actual") != -1) {
            user_act = $.parseJSON(getCookie("_usuario_actual"));
        }

        var date = new Date($.now());
        //date format example MON, october 5th 2020, 19:40
        var formatted_date = getCorrectFormat(date);

        //Se guarda el objeto del usuario reegistrandose
        var act_response = {
            'subject': subject_cookie,
            'title_act': title_activity,
            'email_st': user_act.email,
            'date': formatted_date,
            'name': document.getElementById("response_act_name").value,
            'text': document.getElementById("textarea_response_act").value,
            'rev': "no",
        };

        //Se copian las asignaturas guardadas
        if (document.cookie.indexOf("_upload_act") != -1) {
            all_Responses = $.parseJSON(getCookie("_upload_act"));
            all_Responses.push(act_response);
        } else {
            all_Responses.push(act_response);
        }

        var date = new Date();
        date.setTime(date.getTime() + (4 * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();

        //Se guardan las dos cookies
        cookieString = "_upload_act" + "=" + JSON.stringify(all_Responses) + expires + "; path=/";
        document.cookie = cookieString;
        //  $("#form_act_response").trigger("reset");
    }
    alert("La tarea ha sido subida con exito");
};

function showGraphs() {
    $("#itemContainer").hide();
    $(".asignaturas").hide();
    $("#miDiv").show();
    $(".Upload_content").hide();
    $(".Upload_activity").hide();
    $(".Upload_activity_response").hide();

    grades = [5, 6, 2, 7, 8, 9, 3, 2, 5, 4, 6];
    var x = [];

    for (var i = 1; i <= grades.length; i++) {
        x[i] = grades[i - 1];
    }
    var trace = {
        x: x,
        type: 'histogram',
        marker: {
            opacity: 0.8,
            color: "rgb(236,191,23)",
            line: {
                color: "rgb(236,191,23)",
                width: 1
            }
        },
        xbins: {
            end: 10,
            size: 1.5,
            start: 0
        },
    };
    var layout = {
        bargap: 0.05,
        bargroupgap: 0.2,
        barmode: "overlay",
        title: "NOTAS",
        xaxis: { title: "notas" },
        yaxis: { title: "número de alumnos" }
    };
    var data = [trace];
    Plotly.newPlot('myDiv', data, layout);
}

function UpdateActivities() {
    //Se crea el array de JSON
    var all_Activities = [];
    var usuario_actual;

    if (document.cookie.indexOf("_usuario_actual") != -1) {
        usuario_actual = $.parseJSON(getCookie("_usuario_actual"));
    }

    //Se copian las actividades guardadas
    if (document.cookie.indexOf("_activity") != -1) {
        all_Activities = $.parseJSON(getCookie("_activity"));
        for (let i = 0; i < all_Activities.length; i++) {
            var html_to_inyect = '<div class = "activity_message"><button class="title_new_act"><i class="fas fa-file"></i><span>' + all_Activities[i].name + '</span></button> <p> ' + all_Activities[i].text + '</p></div>';
            var object_topic_message = "#all_activities_inside_clases_" + all_Activities[i].subject;
            $(object_topic_message).append(html_to_inyect);

            for (j in usuario_actual.subject) {
                if (usuario_actual.subject[j] == all_Activities[i].subject) {
                    var datesssA = all_Activities[i].date.split(',');

                    $('#calendar_general').evoCalendar('addCalendarEvent', {     
                        id: all_Activities[i].subject + all_Activities[i].name,
                             name: all_Activities[i].subject + " " + all_Activities[i].name + " " + datesssA[datesssA.length - 1],
                             description: all_Activities[i].text,
                             date: SaveDAteCalendar(datesssA[0]),
                             type: 'event'
                    });

                    $('#calendar_' + all_Activities[i].subject).evoCalendar('addCalendarEvent', {     
                        id: all_Activities[i].subject + all_Activities[i].name,
                             name: all_Activities[i].name + " " + datesssA[datesssA.length - 1],
                             description: all_Activities[i].text,
                             date: SaveDAteCalendar(datesssA[0]),
                             type: 'event'
                    });

                }
            }
        }
    }
};

$(document).ready(function() {
    //Se crea el array de JSON
    var all_Material = [];
    var all_Act_Uploads = [];
    var all_Forums = [];

    //Se copia el material guardado
    if (document.cookie.indexOf("_material") != -1) {
        all_Material = $.parseJSON(getCookie("_material"));
        for (let i = 0; i < all_Material.length; i++) {
            var html_to_inyect = '<div class = "material_message"><h4 class="title_new_material">' + all_Material[i].name + '<i class="fas fa-book-open"></i></h4> <p> ' + all_Material[i].text + '</p></div>';
            var object_topic_message = "#all_material_inside_clases_" + all_Material[i].subject;
            $(object_topic_message).append(html_to_inyect);
        }
    }

    //Se copia las act subidas
    if (document.cookie.indexOf("_upload_act") != -1) {
        all_Act_Uploads = $.parseJSON(getCookie("_upload_act"));
        for (let i = 0; i < all_Act_Uploads.length; i++) {
            var html_to_inyect = '<tr><td  id="check_Act_' + i + '_title">' + all_Act_Uploads[i].title_act + '</td><td  id="check_Act_' + i + '_email">' + all_Act_Uploads[i].email_st + '</td><td  id="check_Act_' + i + '_date">' + all_Act_Uploads[i].date + '</td><td class="put_grade" id="check_Act_' + i + '_grade"></td> <td id="check_Act_' + i + '_revision">' + all_Act_Uploads[i].rev + '</td><td class="check_Activity" id="check_Act_' + i + '"><button><i class="fas fa-edit"></i></button></td></tr>';
            var object_topic_message = "#Calificate_act_" + all_Act_Uploads[i].subject + " table tbody";
            $(object_topic_message).append(html_to_inyect);
            //  $(object_topic_message).append(html_to_inyect);
        }
    }

    var image_source = "./images/default-user.png";
    //Se copia el material guardado
    if (document.cookie.indexOf("_forum") != -1) {
        all_Forums = $.parseJSON(getCookie("_forum"));
        for (let i = 0; i < all_Forums.length; i++) {
            var html_to_inyect = '<div class = "topic_message ' + all_Forums[i].subject + '_messages_forum"><p>' + all_Forums[i].message + '</p><img class = "author_pic" src="' + image_source + '" alt="Imagen de DEFAULT"/><h3 class = "author">' + all_Forums[i].author + '</h3><h3 class = "date">' + all_Forums[i].date + '</h3></div>';
            $(".form").after(html_to_inyect);
            console.log(html_to_inyect);
        }
    }

});

function PutCalifications() {
    var all_grades = [];
    var all_Act_Uploads = [];
    var usuario_actual = $.parseJSON(getCookie("_usuario_actual"));

    if (document.cookie.indexOf("_grades") != -1) {
        all_grades = $.parseJSON(getCookie("_grades"));

        if (document.cookie.indexOf("_upload_act") != -1) {
            all_Act_Uploads = $.parseJSON(getCookie("_upload_act"));
        }

        for (let i = 0; i < all_grades.length; i++) {
            if (usuario_actual.email == all_grades[i].email) {
                var html_to_inyect = '<tr><td  id="grade_' + i + '_title">' + all_grades[i].title + '</td><td  id="grade_' + i + '_nota">' + all_grades[i].grade + '</td><td class="grade_revision_button" id="grade_' + i + '"><button><i  id="grade_' + i + '_edit" class="fas fa-edit"style="color:white"></i><i id="grade_' + i + '_check" class="fas fa-check-square"></i></button></td></tr>';
                var object_topic_message = "#Cal_act_" + all_grades[i].subject + " table tbody";
                $(object_topic_message).append(html_to_inyect);

                for (let j = 0; j < all_Act_Uploads.length; j++) {

                    if (usuario_actual.email == all_Act_Uploads[j].email_st && all_grades[i].title == all_Act_Uploads[j].title_act && all_grades[i].subject == all_Act_Uploads[j].subject) {
                        if (all_Act_Uploads[i].rev == "no") {
                            $("#grade_" + i + "_check").hide();
                            $("#grade_" + i + "_edit").show();
                        } else {
                            $("#grade_" + i + "_check").show();
                            $("#grade_" + i + "_edit").hide();
                        }
                    }

                }
            }
        }
    }

};

function All_studentGrade() {
    var all_grades = [];
    var usuario_actual = $.parseJSON(getCookie("_usuario_actual"));

    if (document.cookie.indexOf("_grades") != -1) {
        all_grades = $.parseJSON(getCookie("_grades"));
    }
    for (j in usuario_actual.subject) {

        var asignatura;
        switch (usuario_actual.subject[j]) {
            case "IS":
                asignatura = "Ingenieria del Software";
                break;
            case "IU":
                asignatura = "Interfaces de usuario";
                break;
            case "AC":
                asignatura = "Arquitectura de computadores";
                break;
            case "Prog":
                asignatura = "Programacion";
                break;
            case "EC":
                asignatura = "Estructura de computadores";
                break;
            default:
                asignatura = "Redes de ordenadores";
        }

        for (let i = 0; i < all_grades.length; i++) {
            if (usuario_actual.subject[j] == all_grades[i].subject) {
                var html_to_inyect = '<tr><td>' + asignatura + '</td><td>' + all_grades[i].title + '</td><td>' + all_grades[i].email + '</td><td>' + all_grades[i].grade + '</td></tr>';
                var object_topic_message = ".calification_all_students table tbody";
                $(object_topic_message).append(html_to_inyect);

            }
        }
    }
};



function My_studentGrade() {
    var all_grades = [];
    var usuario_actual = $.parseJSON(getCookie("_usuario_actual"));

    if (document.cookie.indexOf("_grades") != -1) {
        all_grades = $.parseJSON(getCookie("_grades"));
    }
    for (j in usuario_actual.subject) {

        var asignatura;
        switch (usuario_actual.subject[j]) {
            case "IS":
                asignatura = "Ingenieria del Software";
                break;
            case "IU":
                asignatura = "Interfaces de usuario";
                break;
            case "AC":
                asignatura = "Arquitectura de computadores";
                break;
            case "Prog":
                asignatura = "Programacion";
                break;
            case "EC":
                asignatura = "Estructura de computadores";
                break;
            default:
                asignatura = "Redes de ordenadores";
        }

        for (let i = 0; i < all_grades.length; i++) {
            if (usuario_actual.subject[j] == all_grades[i].subject && usuario_actual.email == all_grades[i].email) {
                var html_to_inyect = '<tr><td>' + asignatura + '</td><td>' + all_grades[i].title + '</td><td>' + all_grades[i].grade + '</td></tr>';
                var object_topic_message = ".calification_my_students table tbody";
                $(object_topic_message).append(html_to_inyect);

            }
        }
    }
};




//El burguer para el movil
function MenuMovil() {
    var hamburger = document.querySelector(".hamburger");
    var x = document.getElementById("nav-bar-movil");

    if (hamburger.classList.contains('is-active')) {
        x.style.display = "none";
        hamburger.classList.remove('is-active');
    } else {
        hamburger.classList.add("is-active");
        x.style.display = "block";
    }

};

/*Si se selecciona la pantalla desaparece el menu*/
window.addEventListener('click', function(e) {
    var nav_movil = document.getElementById("nav-bar-movil");
    var elements_in_nav_movil = $("#nav-bar-movil").find('*');
    var hamburger = document.querySelector(".hamburger");
    var hamburger_inner = document.querySelector(".hamburger-inner");

    if ((e.target.parentNode != hamburger) && (e.target != hamburger) && (e.target != hamburger_inner) && ($.inArray(e.target.parentNode, elements_in_nav_movil) == -1)) {
        nav_movil.style.display = "none";
        hamburger.classList.remove('is-active');
    }
});

/*Si se agranda la pantalla con el menu movil abierto este desaparece*/
window.addEventListener('resize', function(e) {
    var w = document.documentElement.clientWidth;
    var nav_movil = document.getElementById("nav-bar-movil");
    var hamburger = document.querySelector(".hamburger");
    if (w >= "601") {
        nav_movil.style.display = "none";
        hamburger.classList.remove('is-active');
    }

});

//Operaciones de cookie
var myCookies = {};

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//Calendario
$(document).ready(function() {
    $('#calendar_general').evoCalendar({
        format: 'MM dd yyyy',
        language: 'es',
        theme: 'Midnight Blue',
        titleFormat: 'MM',
        eventHeaderFormat: 'MM dd',
        firstDayOfWeek: 0, // Sun//
        todayHighlight: true,
        sidebarDisplayDefault: true,
        sidebarToggler: true,
        eventDisplayDefault: true,
        eventListToggler: true,
    })


    $('#calendar_AC').evoCalendar({
        format: 'MM dd yyyy',
        language: 'es',
        theme: 'Midnight Blue',
        titleFormat: 'MM',
        eventHeaderFormat: 'MM dd',
        firstDayOfWeek: 0, // Sun//
        todayHighlight: true,
        sidebarDisplayDefault: true,
        sidebarToggler: true,
        eventDisplayDefault: true,
        eventListToggler: true,
    })

    $('#calendar_EC').evoCalendar({
        format: 'MM dd yyyy',
        language: 'es',
        theme: 'Midnight Blue',
        titleFormat: 'MM',
        eventHeaderFormat: 'MM dd',
        firstDayOfWeek: 0, // Sun//
        todayHighlight: true,
        sidebarDisplayDefault: true,
        sidebarToggler: true,
        eventDisplayDefault: true,
        eventListToggler: true,
    })

    $('#calendar_IU').evoCalendar({
        format: 'MM dd yyyy',
        language: 'es',
        theme: 'Midnight Blue',
        titleFormat: 'MM',
        eventHeaderFormat: 'MM dd',
        firstDayOfWeek: 0, // Sun//
        todayHighlight: true,
        sidebarDisplayDefault: true,
        sidebarToggler: true,
        eventDisplayDefault: true,
        eventListToggler: true,
    })

    $('#calendar_IS').evoCalendar({
        format: 'MM dd yyyy',
        language: 'es',
        theme: 'Midnight Blue',
        titleFormat: 'MM',
        eventHeaderFormat: 'MM dd',
        firstDayOfWeek: 0, // Sun//
        todayHighlight: true,
        sidebarDisplayDefault: true,
        sidebarToggler: true,
        eventDisplayDefault: true,
        eventListToggler: true,
    })

    $('#calendar_RO').evoCalendar({
        format: 'MM dd yyyy',
        language: 'es',
        theme: 'Midnight Blue',
        titleFormat: 'MM',
        eventHeaderFormat: 'MM dd',
        firstDayOfWeek: 0, // Sun//
        todayHighlight: true,
        sidebarDisplayDefault: true,
        sidebarToggler: true,
        eventDisplayDefault: true,
        eventListToggler: true,
    })

    $('#calendar_Prog').evoCalendar({
        format: 'MM dd yyyy',
        language: 'es',
        theme: 'Midnight Blue',
        titleFormat: 'MM',
        eventHeaderFormat: 'MM dd',
        firstDayOfWeek: 0, // Sun//
        todayHighlight: true,
        sidebarDisplayDefault: true,
        sidebarToggler: true,
        eventDisplayDefault: true,
        eventListToggler: true,
    })


});

//Modal Calendar
$(document).ready(function() {

    $("#myBtn1,#myBtn1_movil").click(function() {
        $("#calendar_general").show();
        $("#myModal1").show();
        $("#calendar_AC").hide();
        $("#calendar_EC").hide();
        $("#calendar_IS").hide();
        $("#calendar_IU").hide();
        $("#calendar_RO").hide();
        $("#calendar_Prog").hide();

    });

    $("#calendario_AC,#calendario_AC_movil").click(function() {
        $("#calendar_general").hide();
        $("#myModal1").show();
        $("#calendar_AC").show();
        $("#calendar_EC").hide();
        $("#calendar_IS").hide();
        $("#calendar_IU").hide();
        $("#calendar_RO").hide();
        $("#calendar_Prog").hide();

    });
    $("#calendario_EC,#calendario_EC_movil").click(function() {
        $("#calendar_general").hide();
        $("#myModal1").show();
        $("#calendar_AC").hide();
        $("#calendar_EC").show();
        $("#calendar_IS").hide();
        $("#calendar_IU").hide();
        $("#calendar_RO").hide();
        $("#calendar_Prog").hide();

    });

    $("#calendario_IS,#calendario_IS_movil").click(function() {
        $("#calendar_general").hide();
        $("#myModal1").show();
        $("#calendar_AC").hide();
        $("#calendar_EC").hide();
        $("#calendar_IS").show();
        $("#calendar_IU").hide();
        $("#calendar_RO").hide();
        $("#calendar_Prog").hide();

    });

    $("#calendario_IU,#calendario_IU_movil").click(function() {
        $("#calendar_general").hide();
        $("#myModal1").show();
        $("#calendar_AC").hide();
        $("#calendar_EC").hide();
        $("#calendar_IS").hide();
        $("#calendar_IU").show();
        $("#calendar_RO").hide();
        $("#calendar_Prog").hide();

    });

    $("#calendario_RO,#calendario_RO_movil").click(function() {
        $("#calendar_general").hide();
        $("#myModal1").show();
        $("#calendar_AC").hide();
        $("#calendar_EC").hide();
        $("#calendar_IS").hide();
        $("#calendar_IU").hide();
        $("#calendar_RO").show();
        $("#calendar_Prog").hide();

    });

    $("#calendario_Prog,#calendario_Prog_movil").click(function() {
        $("#calendar_general").hide();
        $("#myModal1").show();
        $("#calendar_AC").hide();
        $("#calendar_EC").hide();
        $("#calendar_IS").hide();
        $("#calendar_IU").hide();
        $("#calendar_RO").hide();
        $("#calendar_Prog").show();

    });


    document.getElementsByClassName("close_calendar")[0].addEventListener("click", function() {
        document.getElementById("myModal1").style.display = "none"
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", function(event) {
        if (event.target == document.getElementById("myModal1")) {
            document.getElementById("myModal1").style.display = "none";

        }
    });

});





//Validacion del form Jquery

$().ready(function() {

    var $registerForm = $("#register_form");

    $.validator.addMethod("lettersonly", function(value, element) {
        return this.optional(element) || /^[a-z]+$/i.test(value);
    });

    $.validator.addMethod("alphanumeric", function(value, element) {
        return this.optional(element) || /^[0-9a-z]+$/i.test(value);
    });

    $.validator.addMethod("iquallength", function(value, element, param) {
        var length = $.isArray(value) ? value.length : this.getLength(value, element);
        return this.optional(element) || length == param;
    });

    $.validator.addMethod("nia_start", function(value, element) {
        return this.optional(element) || /^100.*$/i.test(value);
    });

    $.validator.addMethod("dnivalid", function(value, element) {
        return this.optional(element) || /^[0-9]{8}[A-Z]{1}$/i.test(value);
    });


    $.validator.addMethod("email_register", function(value) {
        var check = true;
        if (document.cookie.indexOf("_people") != -1) {
            all_people = $.parseJSON(getCookie("_people"));
            for (x of all_people) {
                if (x.email == value) {
                    check = false;
                }
            }
        }
        //  var length = $.isArray(value) ? value.length : this.getLength(value, element);
        return check;
    });

    $.validator.addMethod("rol_student", function(value) {
        // Comprueba que halla algun profesor resgistrado en la pagina
        var check = true;
        if ((document.cookie.indexOf("_people") == -1) && value == "student") {
            check = false;
        }
        return check;
    });

    if ($registerForm.length) {

        $registerForm.validate({
            rules: {
                user: "required",

                password: {
                    required: true,
                    alphanumeric: true,
                    maxlength: 8
                },

                confirm_password: {
                    required: true,
                    alphanumeric: true,
                    maxlength: 8,
                    equalTo: "#register_password"
                },

                first_name: {
                    required: true,
                    lettersonly: true
                },

                last_name: {
                    required: true,
                    lettersonly: true
                },

                email: {
                    required: true,
                    email: true,
                    email_register: true
                },

                rol: {
                    required: true,
                    rol_student: true
                },

                university: "required",

                terms: "required"
            },
            messages: {
                user: "User is required",

                password: {
                    required: "Password is required",
                    alphanumeric: "Letters and numbers only please",
                    maxlength: "Please enter VALID Password, max 8 characters"
                },

                confirm_password: {
                    required: "Password is required",
                    alphanumeric: "Letters and numbers only please",
                    maxlength: "Please enter VALID Password, max 8 characters",
                    equalTo: "Please enter the same password as above"
                },

                first_name: {
                    required: "First name is required",
                    lettersonly: "Letters only please"
                },

                last_name: {
                    required: "Last name is required",
                    lettersonly: "Letters only please"
                },

                email: {
                    required: "Email address is required",
                    email: "Your email address must be in the format of name@domain.extension",
                    email_register: "Email is already registered"
                },

                rol: {
                    required: "Select a Rol is required",
                    rol_student: "There is no registered teachers and any courses available"
                },

                university: "University Name is required",

                terms: "Please accept our Terms and Conditions"
            },
        })
    };

    var $loginForm = $("#login_form");

    if ($loginForm.length) {
        $loginForm.validate({
            rules: {
                password: {
                    required: true,
                    alphanumeric: true,
                    maxlength: 8
                },

                email: {
                    required: true,
                    email: true
                },
            },
            messages: {
                password: {
                    required: "Password is required",
                    alphanumeric: "Letters and numbers only please",
                    maxlength: "Please enter VALID Password, max 8 characters"
                },

                email: {
                    required: "Email address is required",
                    email: "Enter a VALID email address"
                },
            }
        });

    };

});

function hideForAsignatura() {
    $(".Upload_activity").hide();
    $(".Upload_content").hide();
    $(".Upload_activity_response").hide();
    $(".calificate_inside_subject").hide();
    $(".principal_page").hide();
    $(".cal_inside_subject").hide();
    $(".asignatura").hide();
    $(".cabecera").show();
    $(".temario").show();
    $(".forum_topic").hide();
    $(".calification_all_students").hide();
    $(".calification_my_students").hide();
}

function showIS() {
    hideForAsignatura();
    $("#I_Soft").show();
}

function showEC() {
    hideForAsignatura();
    $("#E_comp").show();
}

function showProg() {
    hideForAsignatura();
    $("#Prog_subject").show();
}

function showRO() {
    hideForAsignatura();
    $("#R_Ord").show();
}

function showAC() {
    hideForAsignatura();
    $("#A_Comp").show();
}

function showIU() {
    hideForAsignatura();
    $("#I_User").show();
}

//Main que va cambiando segun los botones de la pagina
$(document).ready(function() {
    $("header").mouseleave(function() {
        $(".submenu").hide();
    });

    $(".my_courses_list_stud").click(function() {
        var subject = $(this).closest('[id]').attr('id');
        switch (subject) {
            case "IS":
                showIS();
                break;
            case "IS_movil":
                showIS();
                break;
            case "IU":
                showIU();
                break;
            case "IU_movil":
                showIU();
                break;
            case "AC":
                showAC();
                break;
            case "AC_movil":
                showAC();
                break;
            case "Prog":
                showProg();
                break;
            case "Prog_movil":
                showProg();
                break;
            case "EC":
                showEC();
                break;
            case "EC_movil":
                showEC();
                break;
            default:
                showRO();
        }
        $(".cabecera").hide();
        $(".temario").hide();
        $(".cal_inside_subject").show();
    });

    $(".forum_topic_back").click(function() {
        var subject = $(this).siblings("h2").html();
        switch (subject) {
            case "Foro de Ingenieria del Software":
                showIS();
                break;
            case "Foro de Interfaces de usuario":
                showIU();
                break;
            case "Foro de Arquitectura de computadores":
                showAC();
                break;
            case "Foro de Programacion":
                showProg();
                break;
            case "Foro de Estructura de computadores":
                showEC();
                break;
            case "Foro de Redes de ordenadores":
                showRO();
                break;
            default:
                $(".main_button").click();
        }


    });


    $(".main_button,.mycourses_button,.logo,.return_home").click(function() {
        $(".asignatura").hide();
        $(".Upload_content").hide();
        $(".Upload_activity").hide();
        $(".Upload_activity_response").hide();
        $(".principal_page").show();
        $(".container").show();
        $(".contact-main").hide();
        $(".copyright-main").hide();
        $(".privacy-main").hide();
        $(".cal_inside_subject").hide();
        $(".calification_all_students").hide();
        $(".forum_topic").hide();
        $(".calificate_inside_subject").hide();
        $(".calification_all_students").hide();
        $(".calification_my_students").hide();
    });



    $(".contact_button").click(function() {
        $(".contact-main").show();
        $(".container").hide();
        $(".copyright-main").hide();
        $(".privacy-main").hide();
        $(".cal_inside_subject").hide();
        $(".calificate_inside_subject").hide();
        $(".calification_all_students").hide();
        $(".calification_my_students").hide();
    });

    $(".copyright_button").click(function() {
        $(".copyright-main").show();
        $(".container").hide();
        $(".contact-main").hide();
        $(".privacy-main").hide();
        $(".calificate_inside_subject").hide();
        $(".cal_inside_subject").hide();

    });

    $(".privacy_button").click(function() {
        $(".privacy-main").show();
        $(".container").hide();
        $(".contact-main").hide();
        $(".calificate_inside_subject").hide();
        $(".cal_inside_subject").hide();
        $(".copyright-main").hide();
    });

    $(".button_IS,.RM_IS").click(function() {
        showIS();
    });

    $(".button_IU,.RM_IU").click(function() {
        showIU();
    });

    $(".button_AC,.RM_AC").click(function() {
        showAC();
    });

    $(".button_RO,.RM_RO").click(function() {
        showRO();
    });

    $(".button_Prog,.RM_Prog").click(function() {
        showProg();
    });

    $(".RM_EC,.button_EC").click(function() {
        showEC();
    });

    $(".forum_topic_back").click(function() {
        var subject = $(this).siblings("h2").html();
        switch (subject) {
            case "Foro de Ingenieria del Software":
                subject_cookie = "IS";
                showIS();
                break;
            case "Foro de Interfaces de usuario":
                subject_cookie = "IU";
                showIU();
                break;
            case "Foro de Arquitectura de computadores":
                subject_cookie = "AC";
                showAC();
                break;
            case "Foro de Programacion":
                subject_cookie = "Prog";
                showProg();
                break;
            case "Foro de Estructura de computadores":
                subject_cookie = "EC";
                showEC();
                break;
            case "Foro de Redes de ordenadores":
                subject_cookie = "RO";
                showRO();
                break;
            default:
                $(".main_button").click();
        }

    });

    $(".all_calification_button").click(function() {
        $(".calification_all_students").show();
        $(".Upload_content").hide();
        $(".calificate_inside_subject").hide();
        $(".temario").hide();
        $(".asignatura").hide();
        $(".Upload_activity").hide();
        $(".Upload_activity_response").hide();
        $(".principal_page").hide();
        $(".forum_topic").hide();
    });


    $(".my_calification_button").click(function() {
        $(".calification_my_students").show();
        $(".Upload_content").hide();
        $(".asignatura").hide();
        $(".calificate_inside_subject").hide();
        $(".Upload_activity").hide();
        $(".Upload_activity_response").hide();
        $(".principal_page").hide();
        $(".forum_topic").hide();
    });



    $(".btn_upload").click(function() {
        var subject = $(this).closest('[id]').attr('id');
        switch (subject) {
            case "IS":
                document.getElementById("material_title").innerHTML = "Ingenieria del Software";
                break;
            case "IS_movil":
                document.getElementById("material_title").innerHTML = "Ingenieria del Software";
                break;
            case "IU":
                document.getElementById("material_title").innerHTML = "Interfaces de usuario";
                break;
            case "IU_movil":
                document.getElementById("material_title").innerHTML = "Interfaces de usuario";
                break;
            case "AC":
                document.getElementById("material_title").innerHTML = "Arquitectura de computadores";
                break;
            case "AC_movil":
                document.getElementById("material_title").innerHTML = "Arquitectura de computadores";
                break;
            case "Prog":
                document.getElementById("material_title").innerHTML = "Programacion";
                break;
            case "Prog_movil":
                document.getElementById("material_title").innerHTML = "Programacion";
                break;
            case "EC":
                document.getElementById("material_title").innerHTML = "Estructura de computadores";
                break;
            case "EC_movil":
                document.getElementById("material_title").innerHTML = "Estructura de computadores";
                break;
            default:
                document.getElementById("material_title").innerHTML = "Redes de ordenadores";
        }
        $(".Upload_content").show();
        $(".Upload_activity").hide();
        $(".asignatura").hide();
        $(".Upload_activity_response").hide();
        $(".cal_inside_subject").hide();
        $(".calification_all_students").hide();
        $(".calification_my_students").hide();
        $(".forum_topic").hide();
        $(".calificate_inside_subject").hide();
    });

    $(".calificate_activity").click(function() {
        var subject = $(this).closest('[id]').attr('id');
        switch (subject) {
            case "IS":
                showIS();
                break;
            case "IS_movil":
                showIS();
                break;
            case "IU":
                showIU();
                break;
            case "IU_movil":
                showIU();
                break;
            case "AC":
                showAC();
                break;
            case "AC_movil":
                showAC();
                break;
            case "Prog":
                showProg();
                break;
            case "Prog_movil":
                showProg();
                break;
            case "EC":
                showEC();
                break;
            case "EC_movil":
                showEC();
                break;
            default:
                showRO();
        }
        $(".cabecera").hide();
        $(".temario").hide();
        $(".calificate_inside_subject").show();
    });



    $(".btn_activity").click(function() {
        var subject = $(this).closest('[id]').attr('id');

        switch (subject) {
            case "IS":
                document.getElementById("Activity_title").innerHTML = "Ingenieria del Software";
                break;
            case "IS_movil":
                document.getElementById("Activity_title").innerHTML = "Ingenieria del Software";
                break;
            case "IU":
                document.getElementById("Activity_title").innerHTML = "Interfaces de usuario";
                break;
            case "IU_movil":
                document.getElementById("Activity_title").innerHTML = "Interfaces de usuario";
                break;
            case "AC":
                document.getElementById("Activity_title").innerHTML = "Arquitectura de computadores";
                break;
            case "AC_movil":
                document.getElementById("Activity_title").innerHTML = "Arquitectura de computadores";
                break;
            case "Prog":
                document.getElementById("Activity_title").innerHTML = "Programacion";
                break;
            case "Prog_movil":
                document.getElementById("Activity_title").innerHTML = "Programacion";
                break;
            case "EC":
                document.getElementById("Activity_title").innerHTML = "Estructura de computadores";
                break;
            case "EC_movil":
                document.getElementById("Activity_title").innerHTML = "Estructura de computadores";
                break;
            default:
                document.getElementById("Activity_title").innerHTML = "Redes de ordenadores";
        }
        $(".Upload_content").hide();
        $(".Upload_activity").show();
        $(".Upload_activity_response").hide();
        $(".calification_all_students").hide();
        $(".calification_my_students").hide();
        $(".forum_topic").hide();
        $(".asignatura").hide();
        $(".cal_inside_subject").hide();
        $(".calificate_inside_subject").hide();
    });

    $(".foro_subjects").click(function() {
        var subject = $(this).closest('[id]').attr('id');
        var asignatura;
        switch (subject) {
            case "IS":
                asignatura = "IS";
                $(".forum_topic > h2").html("Foro de Ingenieria del Software");
                break;
            case "IS_movil":
                asignatura = "IS";
                $(".forum_topic > h2").html("Foro de Ingenieria del Software");
                break;
            case "IU":
                asignatura = "IU";
                $(".forum_topic > h2").html("Foro de Interfaces de usuario");
                break;
            case "IU_movil":
                asignatura = "IU";
                $(".forum_topic > h2").html("Foro de Interfaces de usuario");
                break;
            case "AC":
                asignatura = "AC";
                $(".forum_topic > h2").html("Foro de Arquitectura de computadores");
                break;
            case "AC_movil":
                asignatura = "AC";
                $(".forum_topic > h2").html("Foro de Arquitectura de computadores");
                break;
            case "Prog":
                asignatura = "Prog";
                $(".forum_topic > h2").html("Foro de Programacion");
                break;
            case "Prog_movil":
                asignatura = "Prog";
                $(".forum_topic > h2").html("Foro de Programacion");
                break;
            case "EC":
                asignatura = "EC";
                $(".forum_topic > h2").html("Foro de Estructura de computadores");
                break;
            case "EC_movil":
                asignatura = "EC";
                $(".forum_topic > h2").html("Foro de Estructura de computadores");
                break;
            default:
                asignatura = "RO";
                $(".forum_topic > h2").html("Foro de Redes de ordenadores");
        }

        switch (asignatura) {
            case "IS":
                $(".AC_messages_forum").hide();
                $(".EC_messages_forum").hide();
                $(".IU_messages_forum").hide();
                $(".Prog_messages_forum").hide();
                $(".RO_messages_forum").hide();
                break;
            case "IU":
                $(".AC_messages_forum").hide();
                $(".EC_messages_forum").hide();
                $(".IS_messages_forum").hide();
                $(".Prog_messages_forum").hide();
                $(".RO_messages_forum").hide();
                break;
            case "AC":
                $(".IU_messages_forum").hide();
                $(".EC_messages_forum").hide();
                $(".IS_messages_forum").hide();
                $(".Prog_messages_forum").hide();
                $(".RO_messages_forum").hide();
                break;
            case "Prog":
                $(".AC_messages_forum").hide();
                $(".EC_messages_forum").hide();
                $(".IS_messages_forum").hide();
                $(".IU_messages_forum").hide();
                $(".RO_messages_forum").hide();
                break;
            case "EC":
                $(".AC_messages_forum").hide();
                $(".Prog_messages_forum").hide();
                $(".IS_messages_forum").hide();
                $(".IU_messages_forum").hide();
                $(".RO_messages_forum").hide();
                break;
            default:
                $(".AC_messages_forum").hide();
                $(".EC_messages_forum").hide();
                $(".IS_messages_forum").hide();
                $(".IU_messages_forum").hide();
                $(".Prog_messages_forum").hide();
        }

        $(".Upload_content").hide();
        $(".Upload_activity").hide();
        $(".Upload_activity_response").hide();
        $(".calification_all_students").hide();
        $(".cal_inside_subject").hide();
        $(".calification_my_students").hide();
        $(".calificate_inside_subject").hide();
        $(".asignatura").hide();
        $(".forum_topic").show();
    });


    //EMAIL STUDENT
    $(".student .message i").unbind().click(function() {
        var email = $(this).parent().prev().text();
        var emailto = "mailto:" + email;
        window.location = emailto;
    });
});

//Hay que ponerlo separado ya que es un div que se crea de forma dianmica y no esta al incio del load
$(document).on('click', '.title_new_act', function() {


    usuario_actual = $.parseJSON(getCookie("_usuario_actual"));

    if (usuario_actual.rol == "student") {

        var subject = $(this).closest('[id]').attr('id');
        var title = $(this)[0].childNodes[1].innerHTML;
        document.getElementById("activity_response_title").innerHTML = title;

        //  console.log(title);
        switch (subject) {
            case "all_activities_inside_clases_IS":
                document.getElementById("activity_response_subject").innerHTML = "Ingenieria del Software";
                break;
            case "all_activities_inside_clases_IU":
                document.getElementById("activity_response_subject").innerHTML = "Interfaces de usuario";
                break;
            case "all_activities_inside_clases_AC":
                document.getElementById("activity_response_subject").innerHTML = "Arquitectura de computadores";
                break;
            case "all_activities_inside_clases_Prog":
                document.getElementById("activity_response_subject").innerHTML = "Programacion";
                break;
            case "all_activities_inside_clases_EC":
                document.getElementById("activity_response_subject").innerHTML = "Estructura de computadores";
                break;
            default:
                document.getElementById("activity_response_subject").innerHTML = "Redes de ordenadores";
        }

        $(".asignatura").hide();
        $(".Upload_content").hide();
        $(".Upload_activity").hide();
        $(".calification_all_students").hide();
        $(".calification_my_students").hide();
        $(".Upload_activity_response").show();

    }
});



//Hay que ponerlo separado ya que es un div que se crea de forma dianmica y no esta al incio del load
$(document).on('click', '.Calificate_act', function() {
    var subject = $(this).closest('[id]').attr('id');
    var title = $(this)[0].childNodes[1].innerHTML;
    document.getElementById("activity_response_title").innerHTML = title;

    //  console.log(title);
    switch (subject) {
        case "all_activities_inside_clases_IS":
            document.getElementById("activity_response_subject").innerHTML = "Ingenieria del Software";
            break;
        case "all_activities_inside_clases_IU":
            document.getElementById("activity_response_subject").innerHTML = "Interfaces de usuario";
            break;
        case "all_activities_inside_clases_AC":
            document.getElementById("activity_response_subject").innerHTML = "Arquitectura de computadores";
            break;
        case "all_activities_inside_clases_Prog":
            document.getElementById("activity_response_subject").innerHTML = "Programacion";
            break;
        case "all_activities_inside_clases_EC":
            document.getElementById("activity_response_subject").innerHTML = "Estructura de computadores";
            break;
        default:
            document.getElementById("activity_response_subject").innerHTML = "Redes de ordenadores";
    }

    $(".asignatura").hide();
    $(".Upload_content").hide();
    $(".Upload_activity").hide();
    $(".Upload_activity_response").show();
    $(".calification_all_students").hide();
    $(".calification_my_students").hide();
});




$(document).on('click', '.check_Activity', function() {


    var id_value = $(this).prop('id');
    var title = id_value + "_title";
    var date_entrega = id_value + "_date";
    var email = id_value + "_email";
    var grade = id_value + "_grade";
    var rev = id_value + "_revision";


    var subject = $(this).parent().closest('[id]').attr('id');

    document.getElementsByClassName("fondo_transparente")[0].style.display = "block"

    document.getElementsByClassName("modal_cerrar")[0].addEventListener("click", function() {
        document.getElementsByClassName("fondo_transparente")[0].style.display = "none"
    })
    window.addEventListener("click", function(event) {
        if (event.target == document.getElementsByClassName("modal_grade")) {
            document.getElementsByClassName("fondo_transparente")[0].style.display = "none"

        }
    });

    //Se crea el array de JSON
    var all_Act_Uploads = [];

    //Se copia las act subidas
    if (document.cookie.indexOf("_upload_act") != -1) {
        all_Act_Uploads = $.parseJSON(getCookie("_upload_act"));
        for (let i = 0; i < all_Act_Uploads.length; i++) {

            if (all_Act_Uploads[i].title_act == document.getElementById(title).innerHTML && all_Act_Uploads[i].date == document.getElementById(date_entrega).innerHTML && all_Act_Uploads[i].email_st == document.getElementById(email).innerHTML) {

                document.getElementById("modal_titulo").innerHTML = all_Act_Uploads[i].name;
                document.getElementById("modal_mensaje").innerHTML = all_Act_Uploads[i].text;
            }

        }
    }

    $("#sumbit_grade").click(function() {
        var grade_activity = document.getElementById("number_put_grade").value;
        document.getElementById(grade).innerHTML = grade_activity;
        document.getElementById(rev).innerHTML = "no";


        document.getElementsByClassName("fondo_transparente")[0].style.display = "none";

        //Se crea el array de JSON
        var all_grades_put = [];
        var subject_cookie;
        switch (subject) {
            case "Calificate_act_IS":
                subject_cookie = "IS";
                break;
            case "Calificate_act_IU":
                subject_cookie = "IU";
                break;
            case "Calificate_act_AC":
                subject_cookie = "AC";
                break;
            case "Calificate_act_Prog":
                subject_cookie = "Prog";
                break;
            case "Calificate_act_EC":
                subject_cookie = "EC";
                break;
            default:
                subject_cookie = "RO";
        }

        //Se guarda el objeto del usuario reegistrandose
        var new_grade = {
            'subject': subject_cookie,
            'title': document.getElementById(title).innerHTML,
            'grade': document.getElementById(grade).innerHTML,
            'email': document.getElementById(email).innerHTML,
        };


        var asignatura;
        switch (subject_cookie) {
            case "IS":
                asignatura = "Ingenieria del Software";
                break;
            case "IU":
                asignatura = "Interfaces de usuario";
                break;
            case "AC":
                asignatura = "Arquitectura de computadores";
                break;
            case "Prog":
                asignatura = "Programacion";
                break;
            case "EC":
                asignatura = "Estructura de computadores";
                break;
            default:
                asignatura = "Redes de ordenadores";
        }

        all_Act_Uploads = $.parseJSON(getCookie("_upload_act"));
        for (let i = 0; i < all_Act_Uploads.length; i++) {
            if (all_Act_Uploads[i].title_act == document.getElementById(title).innerHTML &&
                all_Act_Uploads[i].date == document.getElementById(date_entrega).innerHTML &&
                all_Act_Uploads[i].email_st == document.getElementById(email).innerHTML) {

                all_Act_Uploads[i].rev = "no";
            }
        }


        //Se copian las asignaturas guardadas
        if (document.cookie.indexOf("_grades") != -1) {
            all_grades_put = $.parseJSON(getCookie("_grades"));
            var check_if_existe = true;
            for (let i = 0; i < all_grades_put.length; i++) {

                if (new_grade.subject == all_grades_put[i].subject && new_grade.title == all_grades_put[i].title &&
                    new_grade.email == all_grades_put[i].email) {
                    all_grades_put[i].grade = document.getElementById(grade).innerHTML;
                    check_if_existe = false;
                }
            }
            if (check_if_existe) {
                all_grades_put.push(new_grade);
                var html_to_inyect = '<tr><td>' + asignatura + '</td><td>' + new_grade.title + '</td><td>' + new_grade.email + '</td><td>' + new_grade.grade + '</td></tr>';
                var object_topic_message = ".calification_all_students table tbody";
                $(object_topic_message).append(html_to_inyect);
            }
        } else {
            all_grades_put.push(new_grade);
        }


        var date = new Date();
        date.setTime(date.getTime() + (4 * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();

        //Se guardan las dos cookies
        cookieString = "_upload_act" + "=" + JSON.stringify(all_Act_Uploads) + expires + "; path=/";
        document.cookie = cookieString;
        cookieString = "_grades" + "=" + JSON.stringify(all_grades_put) + expires + "; path=/";
        document.cookie = cookieString;
        $("#form_put_grade").trigger("reset");

    })

});


$(document).on('click', '.grade_revision_button', function() {

    var id_value = $(this).prop('id');
    var check = "#" + id_value + "_check";
    var edit = "#" + id_value + "_edit";
    var title = id_value + "_title";
    var usuario_actual = $.parseJSON(getCookie("_usuario_actual"));
    var all_Act_Uploads = [];


    var subject = $(this).parent().closest('[id]').attr('id');
    var subject_cookie;
    switch (subject) {
        case "Cal_act_IS":
            subject_cookie = "IS";
            break;
        case "Cal_act_IU":
            subject_cookie = "IU";
            break;
        case "Cal_act_AC":
            subject_cookie = "AC";
            break;
        case "Cal_act_Prog":
            subject_cookie = "Prog";
            break;
        case "Cal_act_EC":
            subject_cookie = "EC";
            break;
        default:
            subject_cookie = "RO";
    }


    //Se copian las act guardadas
    if (document.cookie.indexOf("_upload_act") != -1) {
        all_Act_Uploads = $.parseJSON(getCookie("_upload_act"));
        for (let i = 0; i < all_Act_Uploads.length; i++) {
            if (all_Act_Uploads[i].title_act == document.getElementById(title).innerHTML && all_Act_Uploads[i].email_st == usuario_actual.email && all_Act_Uploads[i].subject == subject_cookie) {

                if ($(edit).css('display') == 'none') {
                    if (confirm('Estas seguro/a de que desea quitar la solicitud de revision?')) {
                        $(check).hide();
                        $(edit).show();
                        all_Act_Uploads[i].rev = "no";
                    }
                } else {
                    $(check).show();
                    $(edit).hide();
                    all_Act_Uploads[i].rev = "si";
                }
            }
        }

        var date = new Date();
        date.setTime(date.getTime() + (4 * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();

        //Se guardan las dos cookies
        cookieString = "_upload_act" + "=" + JSON.stringify(all_Act_Uploads) + expires + "; path=/";
        document.cookie = cookieString;

    }


});

//Menu desplegable de la izquierda
$(document).ready(function() {
    $("#menu_izquierda button").click(function() {
        var link = $(this);
        var closest_ul = link.closest("ul");
        var parallel_active_links = closest_ul.find(".active")
        var closest_li = link.closest("li");
        var link_status = closest_li.hasClass("active");
        var count = 0;

        closest_ul.find("ul").prev().css("color", "white");
        link.parent().siblings().children("button").css("color", "white");

        closest_ul.find("ul").slideUp(function() {
            if (++count == closest_ul.find("ul").length) {
                parallel_active_links.removeClass("active");
            }
        });

        if (!link_status) {
            closest_li.children("ul").slideDown();
            closest_li.addClass("active");
            link.css("color", "#ecbf17");
        }
    });

    $("#menu_izquierda_mov button").click(function() {
        var link = $(this);
        var closest_ul = link.closest("ul");
        var parallel_active_links = closest_ul.find(".active")
        var closest_li = link.closest("li");
        var link_status = closest_li.hasClass("active");
        var count = 0;

        closest_ul.find("ul").prev().css("color", "white");
        link.parent().siblings().children("button").css("color", "white");

        closest_ul.find("ul").slideUp(function() {
            if (++count == closest_ul.find("ul").length) {
                parallel_active_links.removeClass("active");
            }
        });

        if (!link_status) {
            closest_li.children("ul").slideDown();
            closest_li.addClass("active");
            link.css("color", "#ecbf17");
        }
    })



    $(".return_home, .logo").click(function() {
        var link = $("#menu_izquierda .students_button");
        var closest_ul = link.closest("ul");
        var parallel_active_links = closest_ul.find(".active")
        var closest_li = link.closest("li");
        var count = 0;

        if (++count == closest_ul.find("ul").length) {
            closest_ul.find("ul").prev().css("color", "white");
            --count;
        }

        closest_ul.find("ul").slideUp(function() {
            if (++count == closest_ul.find("ul").length) {
                parallel_active_links.removeClass("active");
            }
        });
    });

    $(".right-text button").click(function() {
        //Abrir Asignaturas
        var link = $(".mycourses_button");
        var closest_ul = link.closest("ul");
        var parallel_active_links = closest_ul.find(".active");
        var closest_li = link.closest("li");
        var link_status = closest_li.hasClass("active");
        var count = 0;

        if (++count == closest_ul.find("ul").length) {
            closest_ul.find("ul").prev().css("color", "white");
            --count;
        }

        closest_ul.find("ul").slideUp(function() {
            if (++count == closest_ul.find("ul").length) {
                parallel_active_links.removeClass("active");
            }
        });

        if (!link_status) {
            closest_li.children("ul").slideDown();
            closest_li.addClass("active");
            link.css("color", "#ecbf17");
        }

        //Abrir asignatura
        var nombre_asignatura = $(this).parent().children("h4").html();
        var link = $(".contenedor-menu ul button span:contains('" + nombre_asignatura + "')").parent();
        var closest_ul = link.closest("ul");
        var parallel_active_links = closest_ul.find(".active");
        var closest_li = link.closest("li");
        var link_status = closest_li.hasClass("active");
        var count = 0;

        if (++count == closest_ul.find("ul").length) {
            closest_ul.find("ul").prev().css("color", "white");
        }

        closest_ul.find("ul").slideUp(function() {
            if (++count == closest_ul.find("ul").length) {
                parallel_active_links.removeClass("active");
                --count;
            }
        });

        if (!link_status) {
            closest_li.children("ul").slideDown();
            closest_li.addClass("active");
            link.css("color", "#ecbf17");
        }
    })


    //FORO
    $(".forum_topic .new_post").unbind().click(function() {
        $(this).parent().children("div.topic_discussion").children("div.form").fadeToggle();
    });

    //post message
    $(".forum_topic .topic_discussion .form button").unbind().click(function() {
        var message = $(this).prev().val();
        var date = new Date($.now());
        //date format example MON, october 5th 2020, 19:40
        var formatted_date = getCorrectFormat(date);
        var image_source = "./images/default-user.png";

        //Ver la asignatura
        var subject = document.getElementById("topic_subject").innerHTML;
        var the_subject;

        switch (subject) {
            case "Foro de Ingenieria del Software":
                the_subject = "IS";
                break;
            case "Foro de Interfaces de usuario":
                the_subject = "IU";
                break;
            case "Foro de Arquitectura de computadores":
                the_subject = "AC";
                break;
            case "Foro de Programacion":
                the_subject = "Prog";
                break;
            case "Foro de Estructura de computadores":
                the_subject = "EC";
                break;
            default:
                the_subject = "RO";
        }

        var usuario_actual;
        if (document.cookie.indexOf("_usuario_actual") != -1) {
            usuario_actual = $.parseJSON(getCookie("_usuario_actual"));
        }
        var author = usuario_actual.name.toUpperCase() + " " + usuario_actual.last_name.toUpperCase();
        var html_to_inyect = '<div class = "topic_message ' + the_subject + '_messages_forum"><p>' + message + '</p><img class = "author_pic" src="' + image_source + '" alt="Imagen de DEFAULT"/><h3 class = "author">' + author + '</h3><h3 class = "date">' + formatted_date + '</h3></div>';

        var object_topic_message = $(this).parent();
        $(this).prev().val("");

        $(object_topic_message).after(html_to_inyect);

        //Se crea el array de JSON
        var all_Formun = [];

        //Se guarda el objeto del usuario reegistrandose
        var new_forum = {
            'subject': the_subject,
            'author': author,
            'message': message,
            'date': formatted_date,
        };

        //Se copian las asignaturas guardadas
        if (document.cookie.indexOf("_forum") != -1) {
            all_Formun = $.parseJSON(getCookie("_forum"));
            all_Formun.push(new_forum);
        } else {
            all_Formun.push(new_forum);
        }
        var date = new Date();
        date.setTime(date.getTime() + (4 * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();

        //Se guardan las dos cookies
        cookieString = "_forum" + "=" + JSON.stringify(all_Formun) + expires + "; path=/";
        document.cookie = cookieString;
    });

    $(".export_grades_student").unbind().click(function() {
        console.log($(this).parent().prev());
        $(this).parent().prev().table2excel({
            exclude: ".noExl",
            name: "Worksheet Name",
            filename: "califications",
            fileext: ".xlsx"
        });
    });
});



//FUNCIONES PARA EL FORMATO DE LA FECHA
function getCorrectFormat(date) {
    var day_of_week = getWeekDay(date);
    var month = getMonth(date);
    var day_of_month = date.getDate();
    var ordinal = getOrdinal(day_of_month);
    var year = date.getFullYear();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    if (parseInt(minutes) < 10) {
        minutes = "0" + minutes;
    }
    var result = day_of_week + ", " + month + " " + day_of_month + ordinal + " " + year + ", " + hour + ":" + minutes;
    return result;
}

function getOrdinal(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

function getWeekDay(date) {
    var weekdays = new Array(
        "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"
    );
    var day = date.getDay();
    return weekdays[day];
}

function getMonth(date) {
    var months = new Array(
        "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"
    );
    var month = date.getMonth();
    return months[month];
}

// FIN FUNCIONES PARA EL FORMATO DE LA FECHA