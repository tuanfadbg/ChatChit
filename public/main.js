var url = window.location.hostname + ":" + window.location.port;
var socket = io(url);
var myInfo;
var img = '<img src="data:image/jpeg;base64,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" alt="" />';
var user;

socket.on("NewMember", function(data) {
    if (myInfo == null) {
        myInfo = data;
    }
    $("#my_name").html(myInfo.name);
    $("#profile-img").attr('src', getImg(myInfo.img));
    $("#room_name").html(myInfo.room);
    $("#link").html(url + '/r/' + myInfo.room);
    console.log(data);
});

socket.on("Member", function(data) {
    console.log(data);
    $("#contacts_list").html("");
    for (let i = 0; i < data.length; i++) {
        var status = data[i].status;
        var avatar = getImg(data[i].img);
        if (status != null) {
            status = status.replace("status-", "");
        } else {
            status = "online";
        }
        $("#contacts_list").append('<li class="contact"><div class="wrap"><span class="contact-status ' + status + '"></span><img src="' + avatar + '"/><div class="meta">' +
            '<p class="name">' + data[i].name + '</p>' +
            '<p class="preview"></p>' +
            '</div>' +
            '</div>' +
            '</li>');
    }
});


// nhan tin nhan
socket.on("NewMessage", function(data) {
    console.log(data);
    data = data.dataNewMessage;
    $("#messages_list").append('<li class="sent"><img src="' + getImg(data.img) +'"/>' + 
        '<p>' + data.message + '</p>' +
        '</li>'
    );

    $(".messages").animate({
        scrollTop: $(document).height()*100
    }, "fast");
});

function newMessage() {
    message = $(".message-input input").val();
    if ($.trim(message) == '') {
        return false;
    }

    socket.emit("NewMessage", {
        message: message
    });
    $('<li class="replies"><img src="' + getImg(myInfo.img) + '"/><p>' + message + '</p></li>').appendTo($('.messages ul'));
    $('.message-input input').val(null);
    $('.contact.active .preview').html('<span>You: </span>' + message);
    $(".messages").animate({
        scrollTop: $(document).height()*100
    }, "fast");
};

$("#logout").click(function() {
    socket.disconnect();
    $.ajax({
        type: "POST",
        url: "/logout",
        data: {},
        success: function(data)
        {
          if (data == "success") {
            window.location.replace(window.location.href);
            return;
          }
        }
      });
});

$("#status-online").click(function() {
    socket.emit("UpdateStatus", {message: "status-online"});
});

$("#status-away").click(function() {
    socket.emit("UpdateStatus", {message: "status-away"});
});

$("#status-busy").click(function() {
    socket.emit("UpdateStatus", {message: "status-busy"});
});

$("#status-offline").click(function() {
    socket.emit("UpdateStatus", {message: "status-offline"});
});



$('.submit').click(function() {
    newMessage();
});

$(window).on('keydown', function(e) {
    if (e.which == 13) {
        newMessage();
        return false;
    }
});

function copyLink() {
    $("textarea").select();
    document.execCommand('copy');
    console.log("copy")
}

function getImg(name) {
    return "/img/" + name + ".jpg";
}