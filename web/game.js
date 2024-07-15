document.addEventListener("DOMContentLoaded", () => {
    let session_id = null;
    let cards = [];

    const newGameBtn = document.getElementById("newGameBtn");
    const startBtn = document.getElementById("startBtn");
    const titleDiv = document.getElementById("title");
    const cardsDiv = document.getElementById("cards");
    const actionsDiv = document.getElementById("actions");
    const ignoreBtn = document.getElementById("ignoreBtn");
    const postBtn = document.getElementById("postBtn");

    newGameBtn.addEventListener("click", startNewGame);
    startBtn.addEventListener("click", startGame);
    ignoreBtn.addEventListener("click", () => handleAction("ignore"));
    postBtn.addEventListener("click", () => handleAction("post"));



    async function apiCall(action, method = 'GET', body = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch('http://localhost:5000/api/'+action, options);
        return response.json();
    }


    async function startNewGame() {


        const data = await apiCall('new_game');
        session_id = data.session_id;

        const cardData = await apiCall('get_cards', 'POST', { session_id });
        cards = cardData.cards;

        displayCards();
        startBtn.style.display = 'inline';


    }

    function displayCards() {
        cardsDiv.innerHTML = '';
        cards.forEach(card => {
            const cardElement = document.createElement("div");
            cardElement.innerHTML = `
                <input type="checkbox" id="card-${card.id}" value="${card.id}">
                <label for="card-${card.id}">${card.name}: ${card.description}</label>
            `;
            cardsDiv.appendChild(cardElement);
            cardElement.addEventListener('change',handleSelect)
        });
    }

    async function startGame() {

        const data = await apiCall('start', 'POST', { session_id });
        titleDiv.innerHTML = data.next_title;
        actionsDiv.style.display = 'inline';

    }


    async function handleSelect() {
        const selectedCardIds = Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(checkbox => checkbox.value);
        
        const applyCardData = await apiCall('apply_cards', 'POST', { session_id, selected_card_ids: selectedCardIds });
        titleDiv.innerHTML = applyCardData.modified_title;
    }

    async function handleAction(action) {

        const actionData = await apiCall(`action_${action}`, 'POST', { session_id });
        titleDiv.innerHTML = actionData.next_title;

        document.querySelectorAll('input[type=checkbox]').forEach(checkbox => checkbox.checked = false);
    }
});
