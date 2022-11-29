import { Lightning, Utils, Colors } from "@lightningjs/sdk";

export class MoviePlayer extends Lightning.Component {

    public selectedMovie: any;
    public allMoviesList: any;

    static override _template(): Lightning.Component.Template<Lightning.Component.TemplateSpecLoose> {
        return {
            PlayerBackground: {
                w: 1920,
                h: 1080,
                src: Utils.asset('images/swirlBackground.jpg'),
                VideoContainer: {
                    rect: true,
                    x: 0,
                    y: 0,
                    w: 1920,
                    h: 600
                },
                Text: {
                    x: 20,
                    y: 650,
                    color: Colors('white').get()
                },
                Details: {
                    x: 20,
                    y: 700,
                    w: 600,
                    h: 300,
                },
            }
        }
    }

    public update() {
        this.tag('VideoContainer').patch({smooth: {src: Utils.asset(this.selectedMovie.imgsrc)}});
        this.tag('Text').patch({smooth: {text: {text: this.selectedMovie.name, fontSize: 40}}});
        this.tag('Details').patch({smooth: {text: {text: this.selectedMovie.description, fontSize: 20}}});
    }
}