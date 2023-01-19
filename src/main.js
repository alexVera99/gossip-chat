var MYCHAT = {
    user_id: "",
    username: "",
    base_room: "GossipChat_",
    room: "",
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

    setUpChat: function() {
        MYCHAT.removeWelcomePopUp();
        MYCHAT.showUsername();
        MYCHAT.showRoom();
        MYCHAT.setUpServer();
        MYCHAT.setUpListeners();
    },

    setUpServer: function () {
        MYCHAT.server = new SillyClient();
        MYCHAT.server.connect( MYCHAT.server_url, MYCHAT.room);

        MYCHAT.server.on_ready = MYCHAT.onReadyServer;
        MYCHAT.server.on_message = MYCHAT.onMessageServer;
    },

    onReadyServer: function (my_id) {
        MYCHAT.user_id = my_id;
    },

    onMessageServer: function( author_id, msg ){
        MYCHAT.showMessage(author_id, msg, "other");
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
        var messageClass = messageType == "user" ?
                           ".message-user-container" :
                           ".message-other-users-container";

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

    sendMessageToServer: function (text) {
        MYCHAT.server.sendMessage(text);
    },

    onUserSendMessage: function () {
        var text = MYCHAT.getUserInput();

        if (text == null){
            return;
        }

        MYCHAT.showMessage(MYCHAT.username, text, "user");

        MYCHAT.sendMessageToServer(text);
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
