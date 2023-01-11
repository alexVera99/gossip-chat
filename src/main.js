var btn = document.querySelector(".chat-message-btn");
btn.addEventListener("click", sendMessage);

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
}

customElements.define("message-user-name", 
                       MessageUsername, 
                       {extends: "div"});

customElements.define("message-user-content", 
                       MessageContent, 
                       {extends: "div"});

customElements.define("message-user", 
                       BaseMessage, 
                       {extends: "div"});


function createMessage(username, text) {
    var message = document.createElement("div",
                                        {is: "message-user"})
                                
    message.setAttribute('class', 'message-user')
    message.addMessageInfo(username, text);

    return message;
}


function sendMessage() {
    // Get the message information from user input
    var user_input = document.querySelector("#message-id");
    
    var username = "alexitu"; // HARDCODED!!!!!!!!!
    var message = user_input.value;

    // Create the message container with the data
    message_container = createMessage(username, message);

    // Put the message container in the chat history container
    var chat = document.querySelector(".chat-history-container");

    chat.appendChild(message_container);

    // Clear the input
    user_input.value = "";
    
}
