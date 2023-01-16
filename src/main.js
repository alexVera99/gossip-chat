var btn = document.querySelector(".chat-message-btn");
btn.addEventListener("click", sendMessage);

var input = document.querySelector("#message-id");
input.addEventListener("keydown", onKeyDown);
class MessageUsername extends HTMLDivElement {
    constructor() {
        var self = super();
        self.setAttribute('class', 'message-user-name');
    }

    addText = function (username) {
        var p = document.createElement('p');
        p.textContent = username;
        this.appendChild(p);
    }
}

class MessageContent extends HTMLDivElement {
    constructor() {
        var self = super();
        self.setAttribute('class', 'message-user-content');
    }

    addText = function (content) {
        var p = document.createElement('p');
        p.textContent = content;
        this.appendChild(p);
    }
}

class MessageType {
    static User = new MessageType("user");
    static OtherUser = new MessageType("otheruser");

    constructor(name) {
        this.name = name;
    }
}

class BaseMessage extends HTMLDivElement {
    constructor() {
        var self = super();

        var message_username_container = document.createElement("div",
                                                            {is: "message-user-name"})
        var message_content_container = document.createElement('div',
                                                                {is: "message-user-content"});
        //message_content_container.addText(text);

        self.appendChild(message_username_container);
        self.appendChild(message_content_container);

    }

    addMessageInfo = function (username, text) {
        this.querySelector(".message-user-name").addText(username);
        this.querySelector(".message-user-content").addText(text);
    }

    addTypeOfMessage(type) {
        if (type === MessageType.User){
            this.setAttribute("class", "message-user");
        }
        else if (type == MessageType.OtherUser) {
            this.setAttribute("class", "message-other-users");
        }
    }
}

/* Template of the message container
<div class="message-user-container|message-other-users-container">
    <div class="message-user|message-other-users">
        <div class="message-user-name">
            <p>Username</p>
        </div>
        <div class="message-user-content">
            <p>My super beautiful message :)</p>
        </div>
    </div>
</div>
*/
class UserMessageContainer extends HTMLDivElement {
    constructor() {
        var self = super();

        var baseMessage = document.createElement("div",
                                                 {is: "base-message"});

        self.appendChild(baseMessage);
    }

    addMessageInfo = function (username, text) {
        this.children[0].addMessageInfo(username, text);
    }

    addTypeOfMessage(type) {
        // Set base message type
        this.children[0].addTypeOfMessage(type);

        if (type === MessageType.User) {
            // Set container type
            this.setAttribute("class", "message-user-container");
        }
        else if (type === MessageType.OtherUser) {
            // Set container type
            this.setAttribute("class", "message-other-users-container");
        }
    }
}

customElements.define("message-user-name",
                       MessageUsername,
                       {extends: "div"});

customElements.define("message-user-content",
                       MessageContent,
                       {extends: "div"});

customElements.define("base-message",
                       BaseMessage,
                       {extends: "div"});

customElements.define("message-user-container",
                      UserMessageContainer,
                      {extends: "div"});

function createMessage(username, text) {
    var messageContainer = document.createElement("div",
                                                  {is: "message-user-container"})

    messageContainer.addTypeOfMessage(MessageType.User);
    messageContainer.addMessageInfo(username, text);

    return messageContainer;
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
    var messageContainer = document.createElement("div",
                                                  {is: "message-user-container"})

    messageContainer.addTypeOfMessage(MessageType.OtherUser);
    messageContainer.addMessageInfo(username, text);

    return messageContainer;
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
