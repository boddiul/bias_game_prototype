GAME_WIDTH = 720;
GAME_HEIGHT = 1280;

const backendController = new BackendController("http://localhost:5000");

let languages = null;
let captions = null;

let lang = null;

function getCaption(id) {
    return captions[id][lang];
}

window.onload = function () {
    backendController.getCaptions(function (data) {
        captions = data.captions;
        languages = data.languages;

        const config = {
            type: Phaser.AUTO,
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            backgroundColor: "#f1f5ff",
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            scene: [LoadingScene, MenuScene, GameScene],
        };

        const game = new Phaser.Game(config);
    });
};
