import { Colors, Lightning, Utils, VideoPlayer, Router } from "@lightningjs/sdk";

export class MainContent extends Lightning.Component {

    public currentFocused = 0;
    public contentCount = 0;
    public movieList: any;

    static override _template() {
        return {}
    }

    override _init() {
        this.currentFocused = 0;
        this.contentCount = 0;
        this.movieList = this.fireAncestors('$getItemList');
        this.ImageLists = this.fireAncestors('$getItemList');
    }  

    update(list: any[]) {
        this.ImageLists = list;
    }

    get FullView() {
        return this.tag('FullView');
    }

    get SelectedImage() {
        return this.children[this.currentFocused]?.item || 'images/logo.png';
    }

    set ImageLists(items: any) {
        this.contentCount = items.length;
        this.children = items.map((item: any, index: number) => {
            return {
                type: ContentBuilder,
                item,
            }
        });
        this.fireAncestors('$setAllChildrenItems', this.children);
    } 

    override _handleRight() {
        if (this.currentFocused == this.contentCount -1) return;
        this.currentFocused += 1;
    }

    override _handleDown() {
        this.currentFocused += 7;
        if (this.children.length - 1 < this.currentFocused) {
            this.currentFocused = this.children.length - 1;
        }
    }

    override _handleUp() {
        this.currentFocused -= 7;
        if (this.currentFocused < 0) {
            this.currentFocused = 0;
            this.signal('changeToFilter', true);
            return;
        }  
    }

    override _handleLeft() {
        if (this.currentFocused == 0) {
            this.signal('callbackFn');
            return;
        };
        this.currentFocused -= 1;
    }

    override _getFocused() {
        return this.children[this.currentFocused];
    }

    override _handleEnter() {
        const movieId = this.children[this.currentFocused]?.item?.id;
        Router.navigate(`movieplayer/${movieId}`);
    }
}

class ContentBuilder extends Lightning.Component {

    static override _template(): Lightning.Component.Template<Lightning.Component.TemplateSpecLoose> {
        return {
            rect: true,
            y: 50,
            w: 230,
            h: 230,
            color: Colors('black').get(),
            flex: {direction: 'column' },
            flexItem: { margin: 10 },
            shader: {type: Lightning.shaders.RoundedRectangle, radius: 11},
            Images: {w: 230, h: 230},
        }
    }

    get Images() {
        return this.tag('Images');
    }

    override _init() {
        this.Images.patch({smooth: {src: Utils.asset(this.item.imgsrc)}});
    }

    override _focus() {
        this.patch({smooth: {
            alpha: 1,
            scale: 1.2
        }})
    }

    override _unfocus() {
        this.patch({smooth: {
            alpha: 1,
            scale: 1
        }})
    }
}