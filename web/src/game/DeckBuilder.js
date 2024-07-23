class DeckBuilder {
    constructor(scene, cardsData, onStart) {
        const columns = 4;

        let xx = 0;
        let yy = 0;

        this.onStart = onStart;

        this.startButton = new Button(
            scene,
            GAME_WIDTH / 2,
            GAME_HEIGHT * 0.9,
            getCaption("start"),
            onStart
        );

        this.introCards = [];

        for (let i = 0; i < cardsData.length; i++) {
            let sx = GAME_WIDTH / 2;
            let sy = 580 + 20 * i;

            let nx = (GAME_WIDTH / columns) * (xx + 0.5);
            let ny = 280 + 300 * yy;

            let introCard = new IntroCard(
                scene,
                cardsData[i].id,
                cardsData[i].name,
                sx,
                sy,
                (GAME_WIDTH / columns) * 0.9
            );

            scene.time.addEvent({
                delay: 100 + i * 100,
                callback: function () {
                    introCard.moveTo(nx, ny);
                },
                callbackScope: this,
            });

            this.introCards.push(introCard);

            xx += 1;

            if (xx >= columns) {
                xx = 0;
                yy += 1;
            }
        }
    }

    update() {}

    destroy() {
        if (this.startButton) this.startButton.destroy();

        this.startButton = null;

        for (let i = 0; i < this.introCards.length; i++) {
            this.introCards[i].destroy();
        }

        this.scene = null;
    }
}
