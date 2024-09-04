class MainGame extends Phaser.Scene {
    constructor() {
        super('MainGame');
    }

    preload() {
        // Carregamento da imagem permanece o mesmo
        this.load.image('bird', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8zp9ScNTdBIYQK9ylaXP2tEuuJl3JaQ29dss0BooUw7Aj0Sl0ThJNrZYBIRnGt1C-woI&usqp=CAU');
        this.load.image('pipe', 'assets/pipe.png');
    }

    create() {
        // Crie o sprite do pássaro
        this.bird = this.add.sprite(
            this.sys.game.config.width * 0.1,
            this.sys.game.config.height / 2,
            'bird'
        );
        
        // Ajuste o tamanho do pássaro
        this.adjustBirdSize();
        
        // Adicione física ao sprite do pássaro
        this.physics.add.existing(this.bird);
        this.bird.body.setCollideWorldBounds(true);

        this.pipes = this.physics.add.group();

        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Pontuação: 0', { fontSize: '32px', fill: '#fff'});

        this.input.on('pointerdown', this.flap, this);
        
        this.time.addEvent({ delay: 1500, callback: this.addPipe, callbackScope: this, loop: true });

        this.physics.add.collider(this.bird, this.pipes, this.hitPipe, null, this);
    }

    adjustBirdSize() {
        // Defina o tamanho desejado para o pássaro (em pixels)
        const desiredWidth = 50; // Ajuste este valor conforme necessário
        
        // Calcule a escala baseada no tamanho desejado
        const scale = desiredWidth / this.bird.width;
        
        // Aplique a escala ao pássaro
        this.bird.setScale(scale);
    }

    update() {
        if (this.bird.y > this.sys.game.config.height || this.bird.y < 0) {
            this.gameOver();
        }
    }

    flap() {
        this.bird.body.setVelocityY(-200);
    }

    addPipe() {
        const hole = Math.floor(Math.random() * 5) + 1;
        const pipeHeight = this.sys.game.config.height / 8;
        
        for (let i = 0; i < 8; i++) {
            if (i !== hole && i !== hole + 1) {
                const pipe = this.pipes.create(this.sys.game.config.width, i * pipeHeight, 'pipe');
                pipe.body.allowGravity = false;
                pipe.setVelocityX(-300);
                pipe.setDisplaySize(pipe.width, pipeHeight);
            }
        }
        
        this.score += 1;
        this.scoreText.setText('Pontuação: ' + this.score);
    }

    hitPipe() {
        this.gameOver();
    }

    gameOver() {
        this.scene.start('GameOver', { score: this.score });
    }
}

class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.score = data.score;
    }

    create() {
        const { width, height } = this.sys.game.config;

        this.add.text(width / 2, height / 2 - 50, 'Game Over', {
            fontSize: '48px',
            fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2, `Pontuação: ${this.score}`, {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);

        const newGameButton = this.add.text(width / 2, height / 2 + 50, 'Novo Jogo', {
            fontSize: '32px',
            fill: '#0f0'
        }).setOrigin(0.5).setInteractive();

        newGameButton.on('pointerdown', () => {
            this.scene.start('MainGame');
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [MainGame, GameOver]
};

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
