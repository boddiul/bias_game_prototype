class Card {
    constructor(scene, deck, id, name, x, y, width) {
        this.container = scene.add.container();

        this.deck = deck;

        this.startX = x;
        this.startY = y;

        this.container.x = x;
        this.container.y = y;

        this.container.setScale(width / 400);

        this.id = id;

        this.scene = scene;

        let img = scene.add.image(0, 0, "card");

        let txt = scene.add.text(0, 0, name.replaceAll(" ", "\n"), {
            color: "black",
            fontSize: "45px",
            align: "center",
        });

        img.setOrigin(0.5, 0.5);
        txt.setOrigin(0.5, 0.5);

        this.container.add(img);
        this.container.add(txt);

        img.setInteractive();
        img.on("pointerdown", this.click, this);

        this.moving = false;
        this.selected = false;

        this.slot = null;
    }

    click() {
        if (this.moving) return;

        if (this.deck.canChangeCards()) {
            if (!this.selected) {
                let freeSlot = this.deck.getFreeSlot();

                if (freeSlot != -1) {
                    this.select(freeSlot);
                }
            } else {
                this.unselect();
            }
        }
    }

    moveTo(x, y) {
        if (this.scene) {
            this.moving = true;
            this.scene.tweens.add({
                targets: this.container,
                x: x,
                y: y,
                ease: "Power3",
                onComplete: function () {
                    this.moving = false;
                }.bind(this),
            });
        }
    }

    select(slot) {
        this.slot = slot;

        this.deck.addCard(this, this.slot);

        let pos = this.deck.getSlotPosition(this.slot);

        this.moveTo(pos.x, pos.y);

        this.selected = true;
    }

    unselect() {
        this.deck.removeCard(this, this.slot);

        this.selected = false;
        this.slot = null;

        this.moveTo(this.startX, this.startY);
    }
}
