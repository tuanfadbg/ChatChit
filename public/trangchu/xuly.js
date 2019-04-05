var socket = io("http://localhost:3000");
var room_name = "room";
    


    socket.on("Message_sent",function(data){
      var message = data;
      $(".msg_history").append("<div class='outgoing_msg1'><div class='sent_msg1'>"+"<p>"+message+"</p> "+"    </div></div>");
      
      
    });


  
    $(document).ready(function(){
        
        
        
          
        socket.emit("Joinroom",room_name);
       

        $(".msg_send_btn").click(function(){
          
          var message = $("#message").val();
          if(message=="" || message == null){
          return ;
          }
          var date= new Date();
          var d1 =date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear() +" " +date.getHours()+":" +date.getMinutes();
          $(".msg_history").append("<div class='outgoing_msg'><div class='sent_msg'>"+"<p>"+message+"</p> "+"<span class='time_date'>" + d1+"    </span> </div></div>");          
          var height1;
          $(".msg_history").scrollTop($('#msg_history').height() + 1500);
  
  
          socket.emit("Client_send_message",$("#message").val());
          $("#message").val("");
        
      });
       

    });
 