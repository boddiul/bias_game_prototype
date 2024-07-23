class Button {
    constructor(scene, x, y, text, onClick) {
        this.container = scene.add.container();

        let back = scene.add.image(0, 0, "button").setInteractive();
        back.setScale(0.7);
        back.setOrigin(0.5, 0.5);
        back.on("pointerdown", onClick);

        this.container.add(back);

        this.container.x = x;
        this.container.y = y;

        let caption = scene.add.text(0, 0, text, {
            color: "black",
            fontSize: "45px",
            align: "center",
        });

        caption.setOrigin(0.5, 0.5);

        this.container.add(caption);
    }

    destroy() {
        if (this.container) this.container.destroy();

        this.container = null;

        this.scene = null;
    }
}
