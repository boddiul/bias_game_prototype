const mainDiv = document.getElementById("main");

const statusDiv = document.createElement("textarea");

statusDiv.disabled = true;

mainDiv.appendChild(statusDiv);

const messageDiv = document.createElement("textarea");

messageDiv.disabled = true;

mainDiv.appendChild(messageDiv);

const optionsDiv = document.createElement("div");
optionsDiv.classList.add('checklist-container')
mainDiv.appendChild(optionsDiv);

const buttonsDiv = document.createElement("div");

buttonsDiv.classList.add('button-container')
mainDiv.appendChild(buttonsDiv);




function setStatus(text) {
    statusDiv.innerText = text;

    statusDiv.style.height = "5px";
    statusDiv.style.height = (statusDiv.scrollHeight) + "px";

}

function setMessage(text) {
    messageDiv.innerText = text;
    
    messageDiv.style.height = "5px";
    messageDiv.style.height = (messageDiv.scrollHeight) + "px";
}

function setButtons(buttons) {
    buttonsDiv.innerHTML = "";

    buttons.forEach((data) => {
        const button = document.createElement("button");

        button.textContent = data.caption;

        button.onclick = data.onClick;

        buttonsDiv.appendChild(button);
    });
}

function setOptions(options, onUpdate, maxSelected) {
    
    let selectedIds = [];

    options.forEach(option => {
        const item = document.createElement('div');
        item.className = 'checklist-item';
        item.textContent = option.caption;
        item.dataset.id = option.id;

        item.addEventListener('click', () => {
            const id = option.id;

            if (selectedIds.includes(id)) {
                selectedIds = selectedIds.filter(selectedId => selectedId !== id);
                item.classList.remove('selected');
            } else if (selectedIds.length < maxSelected) {
                selectedIds.push(id);
                item.classList.add('selected');
                }

                onUpdate(selectedIds);
            });

            optionsDiv.appendChild(item);
    });

}

async function apiCall(action, method = "GET", body = null, onComplete = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(this.url + "/api/" + action, options);
    const result = await response.json();

    if (onComplete) onComplete(result);

    return result;
}
