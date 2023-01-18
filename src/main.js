var MYCHAT = {
    user_id: "",
    base_room: "ALEXANDER_VERA_ROOM_",
    server: undefined,
    server_url: "wss://ecv-etic.upf.edu/node/9000/ws",
    base_css_class: ".my-chat",

    init: function() {
        MYCHAT.setUpListeners();

        MYCHAT.setUpServer();
    },

    setUpListeners: function () {
        let btn = document.querySelector(MYCHAT.base_css_class + " .chat-message-btn");
        btn.addEventListener("click", MYCHAT.onUserSendMessage);

        var input = document.querySelector(MYCHAT.base_css_class + " #message-id");
        input.addEventListener("keydown", MYCHAT.onKeyDown);
    },

    setUpServer: function () {
        MYCHAT.server = new SillyClient();
        MYCHAT.server.connect( MYCHAT.server_url, MYCHAT.base_room + "1234");

        MYCHAT.server.on_ready = MYCHAT.onReadyServer;
        MYCHAT.server.on_message = MYCHAT.onMessageServer;
    },

    onReadyServer: function (my_id) {
        MYCHAT.user_id = my_id;
        MYCHAT.showUserId(my_id);
    },

    onMessageServer: function( author_id, msg ){
        MYCHAT.showMessage(author_id, msg, "other");
    },

    showUserId: function (my_id) {
        var userIdContainer= document.querySelector(MYCHAT.base_css_class + " .chat-header-container > .chat-user");
        userIdContainer.innerText = "User id: " + my_id;
    },

    getUserInput: function () {
        // Get the message information from user input
        var user_input = document.querySelector(MYCHAT.base_css_class + " #message-id");

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

        var template = document.querySelector(MYCHAT.base_css_class + " #templates " + messageClass);
        var message = template.cloneNode(true);

        message.querySelector(".message-user-name").innerText = username;
        message.querySelector(".message-user-content").innerText = text;

        // Put the message container in the chat history container
        var chat = document.querySelector(MYCHAT.base_css_class + " .chat-history-container");

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

        MYCHAT.showMessage(MYCHAT.user_id, text, "user");

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
