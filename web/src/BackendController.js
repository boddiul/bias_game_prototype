class BackendController {
    constructor(url) {
        this.url = url;
        this.id = 0;
    }

    async apiCall(action, method = "GET", body = null, onComplete = null) {
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

    async getCaptions(onComplete) {
        await this.apiCall("get_captions", "GET", null, onComplete);
    }

    async startSession(language, onComplete) {
        await this.apiCall(
            "new_game",
            "POST",
            { language: language },
            function (data) {
                this.id = data.session_id;
                if (onComplete) onComplete();
            }.bind(this)
        );
    }

    async getCards(onComplete) {
        await this.apiCall(
            "get_cards",
            "POST",
            { session_id: this.id },
            onComplete
        );
    }

    async startGame(onComplete) {
        await this.apiCall(
            "start",
            "POST",
            { session_id: this.id },
            onComplete
        );
    }

    async applyCards(selectedCardIds, onComplete) {
        await this.apiCall(
            "apply_cards",
            "POST",
            { session_id: this.id, selected_card_ids: selectedCardIds },
            onComplete
        );
    }

    async actionPost(onComplete) {
        await this.apiCall(
            "action_post",
            "POST",
            { session_id: this.id },
            onComplete
        );
    }

    async actionIgnore(onComplete) {
        await this.apiCall(
            "action_ignore",
            "POST",
            { session_id: this.id },
            onComplete
        );
    }

    async actionIgnore(onComplete) {
        await this.apiCall(
            "action_ignore",
            "POST",
            { session_id: this.id },
            onComplete
        );
    }
}
