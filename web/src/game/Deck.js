class Deck {
    constructor(scene, cardsData) {
        this.scene = scene;

        this.maxSelect = 3;

        this.freeSlots = Array(this.maxSelect).fill(true);

        this.cards = [];

        this.selectedCards = [];

        const rows = 2;

        const rowSize = Math.floor(cardsData.length / rows + 0.5);
        let xx = 0;
        let yy = 0;

        let sz = GAME_WIDTH / rowSize;
        if (sz > GAME_WIDTH / (this.maxSelect + 0.5))
            sz = GAME_WIDTH / (this.maxSelect + 0.5);

        for (let i = 0; i < cardsData.length; i++) {
            let c = new Card(
                this.scene,
                this,
                cardsData[i].id,
                cardsData[i].name,
                (GAME_WIDTH / rowSize) * (xx + 0.5),
                GAME_HEIGHT * 1.01 + (-rows + yy + 1) * sz * 0.8,
                sz
            );

            this.cards.push(c);

            xx += 1;
            if (xx >= rowSize) {
                xx = 0;
                yy += 1;

                if (yy == rows - 1) {
                    xx = (1 + rowSize - (cardsData.length - i)) / 2;
                    console.log(xx);
                }
            }
        }

        this.reseting = false;
    }

    canChangeCards() {
        return this.scene.canApplyCards();
    }

    getFreeSlot() {
        const center = Math.floor(this.maxSelect / 2);

        for (let i = 0; i < this.maxSelect; i++) {
            const offset = Math.floor((i + 1) / 2) * (i % 2 === 0 ? 1 : -1);
            const index = center + offset;
            if (
                index >= 0 &&
                index < this.maxSelect &&
                this.freeSlots[index] === true
            ) {
                return index;
            }
        }

        return -1;
    }

    getSlotPosition(slot) {
        return {
            x: (GAME_WIDTH / this.maxSelect) * (slot + 0.5),
            y: GAME_HEIGHT * 0.6,
        };
    }

    addCard(card, slot) {
        this.selectedCards.push(card);
        this.freeSlots[slot] = false;

        this.scene.applyCards(this.getSelectedCardIds());
    }

    removeCard(card, slot) {
        this.selectedCards.splice(this.selectedCards.indexOf(card), 1);
        this.freeSlots[slot] = true;

        if (!this.reseting) this.scene.applyCards(this.getSelectedCardIds());
    }

    resetSelection() {
        this.reseting = true;
        while (this.selectedCards.length > 0) this.selectedCards[0].unselect();

        this.reseting = false;
    }

    getSelectedCardIds() {
        return this.selectedCards.map((card) => card.id);
    }
}
