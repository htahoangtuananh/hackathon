var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server for Messenger');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'nopassword') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
			 if (!social(event.sender.id, event.message.text)) {
				sendMessage(event.sender.id, {text: event.message.text});
			 }
        }
		if (event.message.attachments) {
		//Checking if there are any image attachments 
			if(event.message.attachments[0].type === "image"){
			 var imageURL = event.message.attachments[0].payload.url;
			 if(imageURL=="https://scontent.xx.fbcdn.net/t39.1997-6/851557_369239266556155_759568595_n.png?_nc_ad=z-m"){
			sendMessage(event.sender.id,{text:"Thank you!"});	
			}else{
				 sendMessage(event.sender.id,{text:imageURL});
				 var interval = setTimeout(function() {
				 sendMessage(event.sender.id, {text:"This is transitory yellowing decease!"});
				 }, 12000);
				}
			}
	   }
	}
    res.sendStatus(200);
});


const token = process.env.TOKEN;

function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
		
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
		
	});
};

function parseToStringType(text) {
	var stringType = ["SOCIAL", "DIAGNOSE", "SOLUTION", "GOSSIP","HARD"];
	var lowerCase=text.toLowerCase();
	switch(true) {
    case lowerCase.indexOf("hi")==0||lowerCase.indexOf("hey")==0||lowerCase.indexOf("hello")==0||lowerCase.indexOf("good afternoon")==0||lowerCase.indexOf("good evening")==0||lowerCase.indexOf("good morning")==0:
        return stringType[0]; 
        break;
    case text.toLowerCase().indexOf("help")!=-1||text.toLowerCase().indexOf("problem")!=-1||text.toLowerCase().indexOf("decease")!=-1||text.toLowerCase().indexOf("diagnose")!=-1||lowerCase.indexOf("I don't know what to do")!=-1:
        return stringType[1]; 
        break;
	case text.toLowerCase().indexOf("solution")!=-1||text.toLowerCase().indexOf("fix")!=-1||lowerCase.indexOf("show me what to do")!=-1||lowerCase.indexOf("can you show me what to do")!=-1||lowerCase.indexOf("some ways")!=-1:
        return stringType[2]; 
        break;
	case lowerCase.indexOf("hurry")!=-1||lowerCase.indexOf("you are the best")!=-1||lowerCase.indexOf("you the best")!=-1||lowerCase.indexOf("bless")!=-1||lowerCase.indexOf("thank you")==0||lowerCase.indexOf("thanks")==0||lowerCase.indexOf("cannot wait")!=-1||lowerCase.indexOf("take too long")!=-1||lowerCase.indexOf("how are you")!=-1||lowerCase.indexOf("Are you good")!=-1||lowerCase.indexOf("Are feeling ok")!=-1||lowerCase.indexOf("wtf")!=-1||lowerCase.indexOf("fuck")!=-1||lowerCase.indexOf("hell")!=-1||lowerCase.indexOf("shit")!=-1:
        return stringType[3]; 
        break;
	default:
		return stringType[4]; 
		break;
} 
}

function getinfo(uid){
	request("https://graph.facebook.com/v2.6/"+uid+"?fields=first_name,last_name&access_token="+token, function(error, response, body) {
        if(error){
        return console.log('Error:', error);
    }

    //Check for right status code
    if(response.statusCode !== 200){
        return console.log('Invalid Status Code Returned:', response.statusCode);
    }

    //All is good. Print the body
   // Show the HTML for the Modulus homepage.
	
});
}

function social(recipientId, text) {
	var uid=recipientId;
    var type = parseToStringType(text);
	var lowerCase=text.toLowerCase();
    if (type==="SOCIAL") {
			//var gender=getinfo(uid);
			var stringg="Hello , how may I be of any assistance? ";
            message = {
               "text":stringg,
            };
            sendMessage(recipientId, message);
            return true;
        
    }
	if(type==="GOSSIP"){
		if(lowerCase.indexOf("how are you")!=-1||lowerCase.indexOf("Are you good")!=-1||lowerCase.indexOf("Are feeling ok")!=-1){
			message = {
               "text":"I am fully functional, thank you"
            };
		}
		if(lowerCase.indexOf("hurry")!=-1||lowerCase.indexOf("cannot wait")!=-1||lowerCase.indexOf("take too long")!=-1){
			message = {
               "text":"Please be patient, I am doing the best I can to help you"
            };
		}if(lowerCase.indexOf("wtf")!=-1||lowerCase.indexOf("fuck")!=-1||lowerCase.indexOf("hell")!=-1||lowerCase.indexOf("shit")!=-1){
			message = {
               "text":"Please calm down, I am doing the best I can"
            };
		}if(lowerCase.indexOf("bless")!=-1||lowerCase.indexOf("thank you")==0||lowerCase.indexOf("thanks")==0){
			message = {
               "text":"Thank you, It is my pleasure"
            };
		}
		
        sendMessage(recipientId, message);
        return true;
		}
		if(type==="DIAGNOSE"){
		message = {
               "text":"Please upload a picture as clear as possible about your problem here in order for me to assist you !"
            };
            sendMessage(recipientId, message);
            return true;
		}
		if(type==="SOLUTION"){
		message = {
               "text":"Firstly: you have to actively harvest the crop that is ready in the right time. Secondly: Be mindful of the fertilizer at all time. For further information, you can contact our specialists."
            };
            sendMessage(recipientId, message);
            return true;
	}if(type==="HARD"){
		message = {
               "text":"I am not sure what are you want to say, could you explain your question?"
            };
            sendMessage(recipientId, message);
            return true;
	}
	
    return false;
    
    
};




