class WebsocketService {
    constructor() {
        this.URL = 'wss://wiki-meta-explorer.herokuapp.com/';
        this.ws           = new WebSocket(this.URL);

        this.initWs();
    }

    initWs = () => {
        this.ws.onmessage = (e) => {
            this.onMessage(e);
        };
        this.ws.onclose   = (e) => {
            console.log(e);
            this.onClose(e);
            this.ws = new WebSocket(this.URL);
            this.initWs();
        };
        this.ws.onerror   = (e) => {
            this.onError(e);
            console.log(e);
        };
        this.ws.onopen    = (e) => {
            this.onOpen(e);
        };
    };

    // default event handlers
    onOpen    = (e) => {};
    onMessage = (e) => {};
    onError   = (e) => {};
    onClose   = (e) => {};

    Close     = () => {
        this.ws.close();
    };

    Send      = (msg) => {
        console.debug(msg);
        switch (this.ws.readyState) {
            case 1: this.ws.send(JSON.stringify(msg));
                break;
            case 0:
            case 2:
                // in case coket is opening, closing or closed, try again.
            case 3: setTimeout((msg) => this.Send(msg), 200);
                break;
        }
    }
}

export default WebsocketService;