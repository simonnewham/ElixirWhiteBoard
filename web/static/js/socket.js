//Code to handle a socket drawing on the canvas
//SIMON NEWHAM
//March 2017

import {Socket} from "phoenix"
import "phoenix_html";

//VARIABLES
let socket = new Socket("/socket", {params: {token: window.userToken}})
socket.connect()

let channel = socket.channel("room:lobby", {})

var canvas = document.getElementById("canvas");
var draw = false; //only draw when mouse clicked
var ctx = canvas.getContext("2d"); //drawing object
var clearBut = document.getElementById("clear");
var black = document.getElementById("black");
var red = document.getElementById("red");
var blue = document.getElementById("blue");

var startXY = [];
var lines= [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//COLOUR METHODS
black.addEventListener("click", function(event){
	//console.log("black clicked")
	//channel.push("color_change", {color: "#555555"})
	ctx.strokeStyle = "#000000";
});
blue.addEventListener("click", function(event){
	//console.log("blue clicked")
	//channel.push("color_change", {color: "#008CBA"})
	ctx.strokeStyle = "#008CBA";
});
red.addEventListener("click", function(event){
	//console.log("red clicked")
	ctx.strokeStyle = "#FF0000";
	//channel.push("color_change", {color: "#FF0000"})
});

channel.on("color_change", payload =>{
	//ctx.strokeStyle = payload.color;
});

//CLEAR METHOD
clearBut.addEventListener("click", function(event){
	//console.log("Clear clicked");
	channel.push("clear_canvas", ctx);
	
});

channel.on("clear_canvas", _payload=>{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();

});

//MOUSE METHODS
canvas.addEventListener("mousemove", function(event) {

	if(draw == true){
		var end =getXY(event);
		drawAll(startXY, end);
	}
});

canvas.addEventListener("mousedown", function(event){
	//console.log("Mouse Clicked");
	draw = true;
	startXY = getXY(event); //start point
});

canvas.addEventListener("mouseup", function(event){
	//console.log("Mouse Unclicked");
	draw = false;
});

function getXY(e) {
		var rect = canvas.getBoundingClientRect(); //get canvas co-ords
		//INCREASE PRECISION OF MOUSE CLICK
		var x =(e.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    	var y = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height

    	var XY = new Array()
    	XY[0] =x;
    	XY[1] =y;
    	var coor = "Coordinates: (" + XY[0] + "," + XY[1] + ")";
    	//console.log(coor);
   		return XY;
}

//DRAWING METHODS
function drawAll(start, end){
	var current_color = ctx.strokeStyle;
	//console.log(current_color);
	drawTo(start, end, current_color);
	channel.push("update_draw", {from: start, to: end, color: current_color});
	startXY[0]=end[0];
    startXY[1]= end[1];
	//console.log("sent starting "+start[0]+" "+start[1]);
	//console.log("Pushed to channel");

}
function drawTo(from, to, color){  //send this to RoomChannel
		var prev_c = ctx.strokeStyle;
		ctx.beginPath();
		ctx.strokeStyle = color;
    	ctx.moveTo(from[0],from[1]);
		ctx.lineTo(to[0],to[1]);
		ctx.stroke();
		ctx.closePath();
		
		ctx.strokeStyle = prev_c;
}

channel.on("update_draw", payload =>{
	//console.log("received broadcast");
	var sent_color = payload.color;
	var start = payload.from;
	var end=  payload.to;
	drawTo(start, end, sent_color);

});


//CHAT ROOM ADDED FUNCTIONALITY 
var message = $("#message"); 
var name = $("#name");
var display = $("#display");

message.on("keypress", event => { //act accordingly if enter is pressed 
  if (event.keyCode == 13 && message.val() !="") {
  	console.log("ENTER");
    channel.push("post", { name: name.val(), message: message.val() });
    message.val('');
  }
});

channel.on("update_post", details  => {
 	//display.append(`<b>${details.name || 'Anonymous'}:</b> ${details.message}<br>`);
 	var str =details.name;
 	if(str ==""){
 		str = 'Anonymous';
 	}
 	display.append("\n"+str.toUpperCase()+": "+details.message);
  	display.prop({scrollTop: display.prop("scrollHeight")}); 
});

//JOIN METHOD
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

export default socket