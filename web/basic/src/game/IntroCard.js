class IntroCard {
    constructor(scene, id, name, x, y, width) {
        this.container = scene.add.container();

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
    }

    moveTo(x, y) {
        if (this.scene)
            this.scene.tweens.add({
                targets: this.container,
                x: x,
                y: y,
                ease: "Power3",
            });
    }

    destroy() {
        if (this.container) this.container.destroy();

        this.container = null;

        this.scene = null;
    }
}
