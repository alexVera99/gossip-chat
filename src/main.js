class MessageType {
    static User = new MessageType("user");
    static Text = new MessageType("text");
    static History = new MessageType("history");
    static HistoryRequest = new MessageType("history-request");
    static Join = new MessageType("join");

    constructor(name) {
        this.name = name;
    }

    create(name) {
        let messageTypes = Object.values(MessageType);

            for (let i = 0; i < messageTypes.length; i++) {
                if (messageTypes[i].name == name) {
                    return messageTypes[i];
                }
            }

        return null;
    }
}

SillyClient.prototype.getBaseURL = function()
{
    var url = this.url;
    var protocol = location.protocol + "//";
    if( url.indexOf("wss://") != -1)
    {
        protocol = "https://";
        url = url.substr(6);
    }
    var index = url.indexOf("/");
    var host = url.substr(0,index);
    return protocol + host +  '/node/9000/';
}

var MYCHAT = {
    user_id: "",
    username: "",
    base_room: "GossipChat_",
    room: "",
    chatHistoryDB: [],
    server: undefined,
    server_url: "wss://ecv-etic.upf.edu/node/9000/ws",
    chat_container_elem: document.querySelector(".my-chat.main-container"),

    init: function() {
        // Show pop up
        let template = MYCHAT.chat_container_elem.querySelector("#templates .pop-up-container");
        let pop_up_container = template.cloneNode(true);

        MYCHAT.chat_container_elem.appendChild(pop_up_container);

        // Pop-up listeners
        var usernameAndRoomBtn = pop_up_container.querySelector("#pop-up-btn");
        usernameAndRoomBtn.addEventListener("click", MYCHAT.onUsernameAndRoomBtn);
    },

    onUsernameAndRoomBtn: function () {
        // Read input
        MYCHAT.username = MYCHAT.chat_container_elem.querySelector(":scope > .pop-up-container #username-input").value.trim();
        MYCHAT.room = MYCHAT.chat_container_elem.querySelector(":scope > .pop-up-container #room-input").value.trim();

        if (!MYCHAT.username) {
            alert("Please, provide a Username");
            return;
        }
        else if (!MYCHAT.room) {
            alert("Please, provide a Room");
            return;
        }

        MYCHAT.room = MYCHAT.base_room + MYCHAT.room;

        // Set up the chat
        MYCHAT.setUpChat();
    },

    setUpListeners: function () {
        let btn = MYCHAT.chat_container_elem.querySelector(".chat-message-btn");
        btn.addEventListener("click", MYCHAT.onUserSendMessage);

        var input = MYCHAT.chat_container_elem.querySelector("#message-id");
        input.addEventListener("keydown", MYCHAT.onKeyDown);
    },

    showUsername: function () {
        var userIdContainer = MYCHAT.chat_container_elem.querySelector(".chat-header-container > .chat-user > h2");
        userIdContainer.innerText = MYCHAT.username;
    },

    showRoom: function () {
        var userIdContainer = MYCHAT.chat_container_elem.querySelector(".chat-header-container > .chat-name > h1");
        userIdContainer.innerText = MYCHAT.room;
    },

    removeWelcomePopUp: function() {
        MYCHAT.chat_container_elem.querySelector(":scope > .pop-up-container").remove();
    },

    enableSendMessageBtn: function () {
        MYCHAT.chat_container_elem.querySelector(".chat-message-input").disabled = false;
    },

    setUpChat: function() {
        MYCHAT.removeWelcomePopUp();
        MYCHAT.showUsername();
        MYCHAT.showRoom();
        MYCHAT.setUpServer();
        MYCHAT.setUpListeners();
        MYCHAT.enableSendMessageBtn();
    },

    setUpServer: function () {
        MYCHAT.server = new SillyClient();
        MYCHAT.server.connect( MYCHAT.server_url, MYCHAT.room);

        MYCHAT.server.on_ready = MYCHAT.onReadyServer;
        MYCHAT.server.on_message = MYCHAT.onMessageServer;
    },

    onReadyServer: function (my_id) {
        MYCHAT.user_id = my_id;
        MYCHAT.sendUserInfo();
        MYCHAT.server.getRoomInfo(MYCHAT.room, MYCHAT.requestChatHistory);
    },

    onMessageServer: function( author_id, msg ){
        msg = JSON.parse(msg);
        let messageType = MessageType.prototype.create(msg["type"]);

        if (messageType == MessageType.History) {
            let db = msg["content"];
            MYCHAT.loadChatHistory(db);
            return;
        }

        else if (messageType == MessageType.HistoryRequest) {
            MYCHAT.sendChatHistory(author_id);
        }

        else if (messageType == MessageType.Join) {
            MYCHAT.showJoinUser(msg["username"]);
        }

        else {
            MYCHAT.showMessage(msg["username"], msg["content"], messageType);
            MYCHAT.updateChatHistory(msg);
        }
    },

    sendMessageToServer: function (text) {
        let msg = {
            type: MessageType.Text.name,
            username: MYCHAT.username,
            content: text
        };

        MYCHAT.server.sendMessage(msg);
        MYCHAT.updateChatHistory(msg);
    },

    requestChatHistory: function (room_info) {
        // Get all users connected
        let usrs = room_info["clients"];

        // Check if nobody else in the chat
        if (usrs.length == 1) {
            return;
        }
        // Remove current user id
        let i = usrs.indexOf(MYCHAT.user_id);
        usrs.splice(i, 1);

        // Obtain the user with the smallest ID
        usrs.sort();
        let oldestUser = usrs[0];

        // Request the chat history to that user
        let msg = {
            type: MessageType.HistoryRequest.name,
            username: MYCHAT.username,
            content: ""
        };

        MYCHAT.server.sendMessage(msg, [oldestUser]);

    },

    sendChatHistory: function (user_id) {
        let msg = {
            type: MessageType.History.name,
            content: MYCHAT.chatHistoryDB
        };

        MYCHAT.server.sendMessage(msg, [user_id]);
    },

    loadChatHistory: function (db) {
        if (!MYCHAT.chatHistoryDB.length == 0) {
            return;
        }

        MYCHAT.chatHistoryDB = db;

        for (let i = 0; i < MYCHAT.chatHistoryDB.length; i++) {
            let i_db_msg = MYCHAT.chatHistoryDB[i];
            let msg_type = MessageType.prototype.create(i_db_msg["type"]);
            MYCHAT.showMessage(i_db_msg["username"], i_db_msg["content"], msg_type);
        }
    },

    updateChatHistory: function (msg){
        if (!MYCHAT.isChatHistoryLoad) { // Condition for the first user in the chat
            MYCHAT.isChatHistoryLoad = true;
        }
        MYCHAT.chatHistoryDB.push(msg);
    },

    getUserInput: function () {
        // Get the message information from user input
        var user_input = MYCHAT.chat_container_elem.querySelector("#message-id");

        var text = user_input.value.trim();

        if (!text) {
            return null;
        }

        // Clear the input
        user_input.value = "";

        return text;
    },

    showMessage: function (username, text, messageType) {
        var messageClass = messageType == MessageType.User ?
                           ".message-user-container" : ".message-other-users-container";

        var template = MYCHAT.chat_container_elem.querySelector("#templates " + messageClass);
        var message = template.cloneNode(true);

        message.querySelector(".message-user-name").innerText = username;
        message.querySelector(".message-user-content").innerText = text;

        // Put the message container in the chat history container
        var chat = MYCHAT.chat_container_elem.querySelector(".chat-history-container");

        chat.appendChild(message);

        // Scroll to bottom of the chat
        MYCHAT.scrollToBottom(chat);
    },

    onUserSendMessage: function () {
        var text = MYCHAT.getUserInput();

        if (text == null){
            return;
        }

        MYCHAT.showMessage(MYCHAT.username, text, MessageType.User);

        MYCHAT.sendMessageToServer(text);
    },

    sendUserInfo: function () {
        var msg = {
            type: "join",
            username: MYCHAT.username,
            content: MYCHAT.user_id,
        }

        MYCHAT.server.sendMessage(msg);
    },

    showJoinUser: function (username) {
        let template = MYCHAT.chat_container_elem.querySelector("#templates .user-status");
        let user_join_container = template.cloneNode(true);

        user_join_container.children[0].innerText = `${username} has been connected`;

        // Put the message container in the chat history container
        var chat = MYCHAT.chat_container_elem.querySelector(".chat-history-container");

        chat.appendChild(user_join_container);

        // Scroll to bottom of the chat
        MYCHAT.scrollToBottom(chat);
    },

    isCtrlOrCmdPressed: function(event) {
        var isPressed =  event.ctrlKey || // Windows Control
                         event.metaKey; // Mac Command Key in Firefox

        return isPressed;
    },

    onKeyDown: function( event ) {
        if (event.code == "Enter" && MYCHAT.isCtrlOrCmdPressed(event)) {
            MYCHAT.onUserSendMessage();
        }
    },

    scrollToBottom: function(elem) {
        elem.scrollTo(0, elem.scrollHeight);
    }
}

MYCHAT.init();
