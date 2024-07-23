class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: "LoadingScene" });
    }

    preload() {
        // Create loading bar
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0x000000,
            },
        });

        this.load.on("progress", (percent) => {
            loadingBar.fillRect(
                0,
                this.game.renderer.height / 2,
                this.game.renderer.width * percent,
                50
            );
            console.log(percent);
        });

        this.load.on("complete", () => {
            this.scene.start("MenuScene");
        });

        // Load assets
        this.load.image("card", "assets/card.png");
        this.load.image("button", "assets/button.png");

        this.load.plugin('rextagtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextagtextplugin.min.js', true);
    }
}
