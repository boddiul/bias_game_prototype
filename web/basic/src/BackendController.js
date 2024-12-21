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

    async apiAction(actionType, actionData, onComplete) {

        await this.apiCall(
            "game_action",
            "POST",
            { session_id: this.id,
              action_type: actionType,
              action_data: actionData
            },
            onComplete
        )
    }

    async getCaptions(onComplete) {
        await this.apiCall("get_captions", "GET", null, onComplete);
    }

    async startSession(gameType, language, onComplete) {
        await this.apiCall(
            "new_game",
            "POST",
            { game_type : gameType,
              language: language },
            function (data) {
                this.id = data.session_id;
                if (onComplete) onComplete();
            }.bind(this)
        );
    }

    async getCards(onComplete) {
        await this.apiAction(
            "get_cards",
            {},
            onComplete
        );
    }

    async startGame(onComplete) {
        await this.apiAction(
            "start",
            {},
            onComplete
        );
    }

    async applyCards(selectedCardIds, onComplete) {
        
        await this.apiAction(
            "apply_cards",
            { selected_card_ids: selectedCardIds },
            onComplete
        );

    }

    async actionPost(onComplete) {
        await this.apiAction(
            "action_post",
            {  },
            onComplete
        );
    }

    async actionIgnore(onComplete) {
        await this.apiAction(
            "action_ignore",
            {  },
            onComplete
        );
    }

}
