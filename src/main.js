var btn = document.querySelector(".chat-message-btn");
btn.addEventListener("click", onUserSendMessage);

var input = document.querySelector("#message-id");
input.addEventListener("keydown", onKeyDown);

function getUserInput() {
    // Get the message information from user input
    var user_input = document.querySelector("#message-id");

    var username = "alexitu"; // HARDCODED!!!!!!!!!
    var text = user_input.value.trim();

    if (!text) {
        return null;
    }

    // Clear the input
    user_input.value = "";

    return {
        "username": username,
        "text": text
    };
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

function sendMessageToServer(username, text) {
    // TO DO: Logic to send the message over the Intenet
    console.log(`Sending message with username: ${username} and text:\n
                ${text}`);
}

function onUserSendMessage() {
    var messageData = getUserInput();

    if (messageData == null){
        return;
    }

    var username = messageData["username"];
    var text = messageData["text"];

    showMessage(username, text, "user");

    sendMessageToServer(username, text);
}

function receiveMessageFromServer() {
    // TO DO: Logic to receive the message from the Internet
}

function receiveMessageFromServerSimulator() {
    // Toy function!!!

    // Generate random message
    const usernames = ["Pepe", "Maria", "Luis", "Pacoo23"];
    const messages = ["Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi optio voluptates unde magni voluptatem illum, \
                       enim porro iure quas fugiat eos cum iusto quidem labore tempore quos quasi! Repellendus, laborum!",
                      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti laborum accusamus est ullam sed corporis \
                      magni necessitatibus ut, illo labore architecto iste voluptas molestiae, eos id? Tenetur neque dolorum recusandae.",
                      "Fantástico!!",
                      "JAJAJAJAJ!!!",
                      "❤️❤️❤️❤️❤️❤️❤️",
                      "😂😂😂😂😂"];
    var u = Math.floor(Math.random()*usernames.length);
    var m = Math.floor(Math.random()*messages.length);
    var username = usernames[u];
    var text = messages[m];

    return {
        "username": username,
        "text": text
    };
}

function onServerSendsMessage() {
    //var messageData = receiveMessageFromServer();
    var messageData = receiveMessageFromServerSimulator();

    var username = messageData["username"];
    var text = messageData["text"];

    showMessage(username, text, "other");
}

// Call the receiveMessage() function to simulate receiving messages
const max = 6000; // Max time to receive a new message
const min = 2000; // Min time to receive a new message
setInterval(onServerSendsMessage, Math.random() * (max - min) + min);
// FINISH SIMULATION CODE
// TODO: Remove this piece of code

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
