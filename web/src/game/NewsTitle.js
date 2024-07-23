class NewsTitle {
    constructor(scene, originalTitle) {
        this.scene = scene;

        this.text = scene.add.text(
            GAME_WIDTH / 2,
            -GAME_HEIGHT * 0.2,
            originalTitle,
            {
                color: "black",
                fontSize: "45px",
                align: "center",
                wordWrap: { width: GAME_WIDTH * 0.9 },
            }
        );

        this.text.setOrigin(0.5, 0.5);

        this.scene.tweens.add({
            targets: this.text,
            y: GAME_HEIGHT * 0.2,
            ease: "Power3",
            onComplete: function () {
                this.ready = true;
            }.bind(this),
        });

        this.ready = false;

        this.changing = false;
    }

    startChangingText() {
        this.changing = true;
    }

    finishChangingText(newText) {
        this.changing = false;

        this.text.text = newText;

        this.text.x = GAME_WIDTH / 2;
    }

    remove(direction) {
        let moveTo = null;

        switch (direction) {
            case "left":
                moveTo = -GAME_WIDTH / 2;
                break;
            case "right":
                moveTo = GAME_WIDTH * 1.5;
                break;
        }

        this.scene.tweens.add({
            targets: this.text,
            x: moveTo,
            ease: "Power3",
        });
    }

    destroy() {}

    update(time, delta) {
        if (this.changing) {
            this.text.x = GAME_WIDTH / 2 + Math.sin(time / 30) * 10;
        }
    }
}
