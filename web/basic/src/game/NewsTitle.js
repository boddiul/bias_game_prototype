class NewsTitle {
    constructor(scene, originalTitle) {
        this.scene = scene;

        this.originalText = originalTitle;
        this.currentText = originalTitle;

        this.container = scene.add.container();

        this.container.x = GAME_WIDTH / 2;
        this.container.y = -GAME_HEIGHT * 0.2;

        this.originalTextObject = scene.add.text(0, 0, this.originalText, {
            color: "black",
            fontSize: "45px",
            align: "center",
            wordWrap: { width: GAME_WIDTH * 0.9 },
        });

        this.currentTextObject = scene.add.rexTagText(0, 0, this.currentText, {
            backgroundColor: "#f1f5ff",
            color: "black",
            fontSize: "45px",
            align: "center",
            wordWrap: { width: GAME_WIDTH * 0.9 },
        });

        this.originalTextObject.setVisible(false);

        this.originalTextObject.setOrigin(0.5, 0.5);
        this.currentTextObject.setOrigin(0.5, 0.5);

        this.container.add(this.originalTextObject);
        this.container.add(this.currentTextObject);

        this.scene.tweens.add({
            targets: this.container,
            y: GAME_HEIGHT * 0.2,
            ease: "Power3",
            onComplete: function () {
                this.ready = true;
            }.bind(this),
        });

        this.ready = false;

        this.changing = false;

        this.holdingClick = false;
        this.currentTextOpacity = 1;

        this.currentTextObject.setInteractive();
        this.currentTextObject.on(
            "pointerdown",
            function () {
                this.holdingClick = true;
            },
            this
        );
        this.currentTextObject.on(
            "pointerup",
            function () {
                this.holdingClick = false;
            },
            this
        );
    }

    startChangingText() {
        this.changing = true;
    }

    finishChangingText(newText) {
        this.changing = false;

        this.currentText = newText;

        const cleanWordFunc = (word) =>
            word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"«»]/g, "").toLowerCase();

        const currentCleanWords = this.currentText.split(" ").map(cleanWordFunc);
        const originalCleanWords = this.originalText.split(" ").map(cleanWordFunc);

        const diffWords = currentCleanWords.filter((word) => !originalCleanWords.includes(word));

        const highlightedText = this.currentText
            .split(" ")
            .map((word, i) => {
                const cleanWord = currentCleanWords[i];
                return diffWords.includes(cleanWord)
                    ? `<style='color:red'>${word}</style>`
                    : word;
            })
            .join(" ");

        this.currentTextObject.text = highlightedText;

        this.container.x = GAME_WIDTH / 2;
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
            targets: this.container,
            x: moveTo,
            ease: "Power3",
        });
    }

    destroy() {}

    update(time, delta) {
        if (this.changing) {
            this.container.x = GAME_WIDTH / 2 + Math.sin(time / 30) * 10;
        }

        if (this.holdingClick) {
            if (this.currentTextOpacity > 0.1) this.currentTextOpacity -= 0.05;
            this.originalTextObject.setVisible(true);
        } else {
            this.currentTextOpacity = 1;
            this.originalTextObject.setVisible(false);
        }
        this.currentTextObject.setAlpha(this.currentTextOpacity);
    }
}
