import { Colors, Lightning, Router, Utils } from "@lightningjs/sdk";
import { MainContent } from './MainContents';

export class Home extends Lightning.Component {

    public MyImageLists: any = [];

    public duplicateList = [];    
    public menuIndex = 0;
    static override _template() {
        return {
            Widgets: {
                w: window.innerWidth,
                h: window.innerHeight,
                color: Colors('black').get(),
                Background: {
                    w: 1920,
                    h: 1080,
                    src: '../static/images/background.png',
                    shader: {type: Lightning.shaders.FadeOut, fade: 0},
                    Content: {
                        rect: true,
                        x: 100,
                        y: 100,
                        color: Colors('transperent').get(),
                        w: 1820,
                        h: 1080,
                        flex: {direction: 'row', wrap: true},
                        type: MainContent
                    },
                },
            }
        }
    }

    get Background() {
        return this.tag('Background');
    }

    get Menu() {
        return this.Background.getByRef('Menu');
    }

    get Content() {
        return this.Background.getByRef('Content');
    }

    $getItemList() {
        return this.MyImageLists;
    }

    $setAllChildrenItems(values: any) {
        this.duplicateList = JSON.parse(JSON.stringify(values));
    }

    $getFilterText(value: string) {
        const filtered = this.MyImageLists.filter((movies: any) => {
            if (movies.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())) {
                return movies
            }
        })
        this.Content.update(filtered);
    }

    override _init() {
        this.menuIndex = 0;
        console.log(this.widgets);

        this.widgets.menu.patch({
            signals: {
              resize: this.resizeMenu,
              filter: this.filterMovies
            }
        });

        this.widgets.filterby.patch({
            signals: {
                filterAction: this.filterMoviesByType
            }
        })
        
        this.Content.patch({ signals: { callbackFn: this.resetState, punchHole: this.isPunchHole, changeToFilter: this.changeToFilter }});
    }

    public changeToFilter = (isFocusing: boolean) => {
        console.log('coming here');
        if (isFocusing) {
            Router.focusWidget('FilterBy');
            this._setState('FilterBy');
        }
    }

    public getMovies() {
        fetch(Utils.asset('response.json'))
        .then(res => res.json())
        .then(res => {
            this.MyImageLists = res;
            this.Content.update(this.MyImageLists);
        })
        .catch(err => console.error(err));
    }

    public filterMoviesByType = (types: string[]) => {
        if (types.length==0) {
            this.Content.update(this.MyImageLists);
            return;
        }
        const filtered = this.MyImageLists.filter((movie: any) => {
            if (types.includes(movie.laguage)) {
                return movie;
            }
        });
        this.Content.update(filtered);
    }

    public filterMovies = (value: string) => {
        const filtered = this.MyImageLists.filter((movies: any) => {
            if (movies.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())) {
                return movies
            }
        })
        this.Content.update(filtered);
    }

    public resizeMenu = (isIncrease: boolean) => {
        if (isIncrease) {
            this.widgets.menu.patch({smooth: {w: 1000, h: window.innerHeight, color: Colors('black').alpha(1).get() }});
            this.Content.patch({smooth: {w: 900, x: 1100, h: window.innerHeight }});
            return;
          }
          this.Content.patch({smooth: {w: window.innerWidth - 100, x: 100, h: window.innerHeight }});
          this.widgets.menu.patch({smooth: {w: 80, color: Colors('black').alpha(0.1).get() }})
    }

    public isPunchHole = (isPuchHole: boolean) => {
        if (isPuchHole) {
            this.Background.shader = { type: Lightning.shaders.Hole, x: 100, y: 0, w: window.innerWidth - 150, h: 500 }
            //this.Background.patch({smooth: {shader: {type: Lightning.shaders.Hole, x: 100, y: 0, w: window.innerWidth - 150, h: 600}}});
        } else {
            this.Background.patch({ smooth: { shader: {type: Lightning.shaders.FadeOut, fade: 0} } });
        }

    }


    public resetState = () => {
        this._setState('Menu');
    }

    override _handleRight() {
        this._setState('Content');
    }

    override _handleLeft() {
        Router.focusWidget("Menu");
    }

    static override _states() {
        return [
            class Menu extends this {
                override _getFocused() {
                    return this.tag('Menu') //this.Menu;
                }
            },
            class Content extends this {
                override _getFocused() {
                    return this.tag('Content') //this.Content;
                }
            }
        ]
    }
}
