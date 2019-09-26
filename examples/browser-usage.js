// Startup
void function() {

    if (!window) {
        console.log("This is only suitable for use in a web page.");
        return void 0;
    }
    
    if (!Mutex) {
        window.alert("Mutex class not found. Be sure to include the script in your page.");
        return void 0;
    }
    
}();

const state = {
    one: null,
    two: null,
    counter: 0,
};

const defaults = {
    time: 1500,
    readyMessage: "Ready. Click a button to commit an asynchronous action on the counter.",
};

const element = {
    main: document.createElement("main"),
    message: document.querySelector("#message"),
    controls: document.createElement("div"),
    buttonOne: document.createElement("button"),
    buttonTwo: document.createElement("button"),
    spacer: document.createElement("span"),
    counter: document.createElement("section"),
};

const method = {
    update() {
        element.counter.innerText = state.counter;
        method.setMessage(defaults.readyMessage);
    },
    asyncAction(newValue, fn, time = defaults.time, field = "one") {
        method.setMessage("Working...");
        if (newValue) {
            setTimeout(() => {
                state[field] = newValue;
                this.update();
            }, time)
        } else if (typeof fn === "function") {
            setTimeout(() => {
                fn();
                this.update();
            }, time);
        }
    },
    increaseCount() {
        state.counter += 1;
    },
    decreaseCount() {
        state.counter -= 1;
    },
    setMessage(message = "") {
        element.message.innerText = message;
    },
}

function setupDom() {
    const {
        buttonOne,
        buttonTwo,
        spacer,
        controls,
        counter,
        main,
    } = element;
    const { body } = document;

    buttonOne.innerText = "Async Action 1";
    buttonTwo.innerText = "Async Action 2";
    spacer.innerHTML = "&nbsp;";
    controls.appendChild(buttonOne);
    controls.appendChild(spacer);
    controls.appendChild(spacer);
    controls.appendChild(buttonTwo);
    controls.style.border = "1px double #444";
    controls.style.padding = "0.5em";
    controls.style.textAlign = "center";
    counter.style.fontSize = "3em";
    counter.style.textAlign = "center";
    
    buttonOne.onclick = e => method.asyncAction(null, method.increaseCount);
    buttonTwo.onclick = e => method.asyncAction(null, method.decreaseCount);

    main.appendChild(counter);
    main.appendChild(controls);
    body.appendChild(main);

    method.setMessage(defaults.readyMessage);
    method.update();
}

function startup(e) {
    element.main.innerHTML = '';    
    method.setMessage("Loading...");


    setTimeout(() => {
        setupDom();
    }, defaults.time);
}

window.onload = startup;
