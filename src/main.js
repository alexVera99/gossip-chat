var user_id;
var base_room = "ALEXANDER_VERA_ROOM_"

var btn = document.querySelector(".chat-message-btn");
btn.addEventListener("click", onUserSendMessage);

var input = document.querySelector("#message-id");
input.addEventListener("keydown", onKeyDown);

var server = new SillyClient();
server.connect( "wss://ecv-etic.upf.edu/node/9000/ws", base_room + "1234");
server.on_ready = function( my_id )
{
    user_id = my_id;
    showUserId(my_id);
}
server.on_message = function( author_id, msg ){
    showMessage(author_id, msg, "other");
}

function showUserId(my_id) {
    document.querySelector(".chat-header-container > .chat-user").innerText = "User id: " + my_id;
}

function getUserInput() {
    // Get the message information from user input
    var user_input = document.querySelector("#message-id");

    var text = user_input.value.trim();

    if (!text) {
        return null;
    }

    // Clear the input
    user_input.value = "";

    return text;
}

function showMessage(username, text, messageType) {
    var messageClass = messageType == "user" ? ".message-user-container" : ".message-other-users-container";

    var template = document.querySelector("#templates " + messageClass);
    var message = template.cloneNode(true);

    message.querySelector(".message-user-name").innerText = username;
    message.querySelector(".message-user-content").innerText = text;

    // Put the message container in the chat history container
    var chat = document.querySelector(".chat-history-container");

    chat.appendChild(message);

    // Scroll to bottom of the chat
    scrollBottom(chat);
}

function sendMessageToServer(text) {
    server.sendMessage(text);
}

function onUserSendMessage() {
    var text = getUserInput();

    if (text == null){
        return;
    }

    showMessage(user_id, text, "user");

    sendMessageToServer(text);
}

function isCtrlOrCmdPressed(event) {
    var isPressed =  event.ctrlKey || // Windows Control
           event.metaKey; // Mac Command Key in Firefox

    return isPressed;
}

function onKeyDown( event ) {
    if (event.code == "Enter" && isCtrlOrCmdPressed(event)) {
        onUserSendMessage();
    }
}
