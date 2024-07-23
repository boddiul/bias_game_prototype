class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: "MenuScene" });
    }

    create() {
        for (let i = 0; i < languages.length; i++) {
            let playButton = new Button(
                this,
                GAME_WIDTH / 2,
                GAME_HEIGHT / 2 + i * 200,
                captions["language"][languages[i]],
                function () {
                    lang = languages[i];
                    this.scene.start("GameScene");
                }.bind(this)
            );
        }
    }

    update() {}
}
