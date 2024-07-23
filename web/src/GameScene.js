class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });

        this.cards = [];
        this.deckBuilder = null;
    }

    create() {
        backendController.startSession(
            function () {
                console.log("DONE");

                backendController.getCards(
                    function (data) {
                        console.log(data);

                        this.cards = data.cards;

                        this.deckBuilder = new DeckBuilder(
                            this,
                            this.cards,
                            this.startGame.bind(this)
                        );
                    }.bind(this)
                );
            }.bind(this)
        );
    }

    startGame() {
        this.deckBuilder.destroy();
        this.deckBuilder = null;

        this.currentTitle = null;

        this.ignoreButton = new Button(
            this,
            GAME_WIDTH * 0.25,
            GAME_HEIGHT * 0.4,
            "IGNORE",
            function () {
                if (this.canUseNextAction()) {
                    this.currentTitle.remove("left");
                    this.currentTitle = null;
                    this.waitingForTitle = true;
                    backendController.actionIgnore(
                        function (data) {
                            this.nextTitle(data.next_title);
                        }.bind(this)
                    );

                    this.deck.resetSelection();
                }
            }.bind(this)
        );

        this.postButton = new Button(
            this,
            GAME_WIDTH * 0.75,
            GAME_HEIGHT * 0.4,
            "POST",
            function () {
                if (this.canUseNextAction()) {
                    this.currentTitle.remove("right");
                    this.currentTitle = null;
                    this.waitingForTitle = true;
                    backendController.actionPost(
                        function (data) {
                            this.nextTitle(data.next_title);
                        }.bind(this)
                    );

                    this.deck.resetSelection();
                }
            }.bind(this)
        );

        this.waitingForTitle = true;
        this.waitingForCardsApply = false;

        backendController.startGame(
            function (data) {
                this.nextTitle(data.next_title);
            }.bind(this)
        );

        this.deck = new Deck(this, this.cards);
    }

    applyCards(cardIds) {
        this.currentTitle.startChangingText();

        this.waitingForCardsApply = true;

        backendController.applyCards(
            cardIds,
            function (data) {
                this.currentTitle.finishChangingText(data.modified_title);
                this.waitingForCardsApply = false;
            }.bind(this)
        );
    }

    canUseNextAction() {
        return (
            this.currentTitle &&
            this.currentTitle.ready &&
            !this.waitingForTitle &&
            !this.waitingForCardsApply
        );
    }

    canApplyCards() {
        return this.currentTitle && !this.waitingForCardsApply;
    }

    nextTitle(title) {
        this.waitingForTitle = false;
        this.currentTitle = new NewsTitle(this, title);
    }

    update(time, delta) {
        if (this.deckBuilder) {
            this.deckBuilder.update();
        }

        if (this.currentTitle) {
            this.currentTitle.update(time, delta);
        }
    }
}
