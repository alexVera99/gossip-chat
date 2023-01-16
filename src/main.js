var btn = document.querySelector(".chat-message-btn");
btn.addEventListener("click", sendMessage);

var input = document.querySelector("#message-id");
input.addEventListener("keydown", onKeyDown);

function createMessage(username, text) {
    var template = document.querySelector("#templates .message-user-container");
    var message = template.cloneNode(true);

    message.querySelector(".message-user-name").innerText = username;
    message.querySelector(".message-user-content").innerText = text;

    return message;
}


function sendMessage() {
    // Get the message information from user input
    var user_input = document.querySelector("#message-id");

    var username = "alexitu"; // HARDCODED!!!!!!!!!
    var message = user_input.value.trim();

    if (!message) {
        return;
    }

    // Create the message container with the data
    var message_container = createMessage(username, message);

    // Put the message container in the chat history container
    var chat = document.querySelector(".chat-history-container");

    chat.appendChild(message_container);

    // Clear the input
    user_input.value = "";

    // Scroll to bottom of the chat
    scrollBottom(chat);

}

function createReceivedMessage(username, text) {
    var template = document.querySelector("#templates .message-other-users-container");
    var message = template.cloneNode(true);

    message.querySelector(".message-user-name").innerText = username;
    message.querySelector(".message-user-content").innerText = text;

    return message;
}

function receiveMessage() {
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
    var message = messages[m];

    // Create message container
    var message_container = createReceivedMessage(username, message);

    // Put the message container in the chat history container
    var chat = document.querySelector(".chat-history-container");

    chat.appendChild(message_container);

    // Scroll to bottom of the chat
    scrollBottom(chat);
}

// Call the receiveMessage() function to simulate receiving messages
const max = 6000; // Max time to receive a new message
const min = 2000; // Min time to receive a new message
setInterval(receiveMessage, Math.random() * (max - min) + min);
// FINISH SIMULATION CODE
// TODO: Remove this piece of code

function isCtrlOrCmdPressed(event) {
    var isPressed =  event.ctrlKey || // Windows Control
           event.keyCode == 224 || // Mac Command Key in Firefox
           event.keyCode == 91 || // Mac left Command Key in Safari/Chrome
           event.keyCode == 93; // Mac Right Command Key in Safari/Chrome

    return isPressed;
}

function onKeyDown( event ) {
    if (event.code == "Enter" && isCtrlOrCmdPressed(event)) {
        sendMessage();
    }
}
