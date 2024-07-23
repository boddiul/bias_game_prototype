class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: "MenuScene" });
    }

    create() {
        let playButton = new Button(
            this,
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            "Play",
            function () {
                this.scene.start("GameScene");
            }.bind(this)
        );
    }

    update() {}
}
