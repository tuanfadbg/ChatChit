var socket = io("http://localhost:3000");

var senter = "Tung";
var receiver = "Tuan"
var date = "";
var content = "hdhdhdhs";
var currentRoom = "room2";
var myInfo;


      socket.on("current_room",function(data){
        currentRoom = data;
      });

    // nhan tin nhan
      socket.on("Message_sent",function(data){
        console.log(data);
        $(".msg_history").append('<div class="incoming_msg"><div class="incoming_msg_img">'
        +'<img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">' + 
        '</div><div class="received_msg"><div class="received_withd_msg"><p>' + data.message + '</p></div></div></div>');
      });


      socket.on("groups_info",function(groupchats){
        $(".inbox_chat").empty();
        for( let i = 0; i < groupchats.length; i++){
          if (i == 0) {
            joinroom(groupchats[i].groupID);
          }
          let groupID = groupchats[i].groupID;
          $(".inbox_chat").append('<div class="chat_list" id="group_' + groupID + '" onclick="joinroom(' + groupID + ')">'
          + '<div class="chat_people"><div class="chat_img"><img src="https://ptetutorials.com/images/user-profile.png"></div>'
          + '<div class="chat_ib">'
              +' <h5>'+groupchats[i].group_name+'</h5>'
              +'<p id="message_' + groupID + '>'+(groupchats[i].last_message_string == null ? "" : groupchats[i].last_message_string)+'</p>'
            +'</div></div></div>');
        }
      });

      socket.on("message_info",function(messageList, senderId){
      
        $(".msg_history").empty();
        for( let i = 0; i < messageList.length; i++){
          let data = messageList[i];
          

          var date= new Date(data.time);
          var dateInString =date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear() +" " +date.getHours()+":" +date.getMinutes();
        


          if (data.userID != senderId) {
        
            $(".msg_history").append('<div class="incoming_msg"><div class="incoming_msg_img">'
            +'<img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">' + 
            '</div><div class="received_msg"><div class="received_withd_msg"><p>' + data.content + '</p></div></div></div>');
          } else {
            $(".msg_history").append('<div class="outgoing_msg">'
            + '<div class="sent_msg"><p>' + data.content + '</p> <span class="time_date"> ' + dateInString + '</span> </div></div></div>');
    
          }
        }
        $(".msg_history").scrollTop($('.msg_history').height() + 1500);
      });

      socket.on("new_message",function(data){
        // $('"#message_' + data.currentRoom + '"').empty();
        // $('"#message_' + data.currentRoom + '"').append(data.message);
        
      });


      $("#btn_send_msg").click(() => {
        // alert("ee");
            var message = $("#message").val();
            // alert(mes);
          if(message=="" || message == null){
          return ;
          }
          // alert(message);
          var date= new Date();
          var d1 =date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear() +" " +date.getHours()+":" +date.getMinutes();
          let messageObj = {};
          messageObj = {message, currentRoom};
          socket.emit("Client_send_message", messageObj);

          $(".msg_history").append("<div class='outgoing_msg'><div class='sent_msg'>"+"<p>"+message+"</p> "+"<span class='time_date'>" + d1+"    </span> </div></div>");          
          var height1;
          $(".msg_history").scrollTop($('.msg_history').height() + 1500);

          $("#message").val("");
      });

      $("#btn_create_chat").click(() => {
        socket.emit("list_friend", {});
      });


      socket.on("list_friend",function(friends){
      
        $(".friends").empty();
        for( let i = 0; i < friends.length; i++){
  
          let friendID = friends[i].userID;
          $(".friends").append('<div class="friend_list" id="friend_' + friendID + '" onclick="addid(' + friendID + ')">'
          + '<div class="chat_people"><div class="chat_img"><img src="https://ptetutorials.com/images/user-profile.png"></div>'
          + '<div class="chat_ib">'
              +' <h5>'+friends[i].fullname+'</h5>'
              +'<p>@'+friends[i].username+'</p>'
            +'</div></div></div>');
        }
      });
       
      $("#create_chat").click(() => {
        var data ={};
        data.user = arr_id;
        socket.emit("create_chat", data);
      });

 

    function joinroom(room) {
      socket.emit("Joinroom","group_" + room);
      currentRoom = room;
      $(".chat_list").removeClass("active_chat");
      $("#group_" + room).addClass("active_chat");
    }




  var arr_id=[];
  var i;
  var key = -1;

  function addid(iduser){
    for(i=0;i<arr_id.length;i++){
      if(arr_id[i]==iduser){
          key=i;
          arr_id.splice(i,1);
          document.getElementById("friend_" + iduser).style.backgroundColor="white";
      }
    }

    if(key == -1){
        arr_id.push(iduser);
        document.getElementById("friend_" + iduser).style.backgroundColor="lightblue";
    }
    key = -1;
    
    console.log(key);
    console.log(arr_id);
  }