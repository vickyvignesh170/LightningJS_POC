import { Colors, Lightning, Router } from "@lightningjs/sdk";

export class Dialog extends Lightning.Component {

    public index = 0;

    static override _template(): Lightning.Component.Template<Lightning.Component.TemplateSpecLoose> {
        return {
            Overlay: {
                rect: true,
                zIndex: 2000,
                w: 1920,
                h: 1080,
                color: Colors('black').alpha(0.8).get(),
                MyPopup: {
                    rect: true,
                    x: 400,
                    y: 300,
                    h: 400,
                    w: 1000,
                    color: Colors('white').alpha(1).get(),
                    Heading: {text: {text: '', textColor: Colors('black').get() }, x: 350, y: 100 },
                    Message: {text: {text: '', textColor: Colors('black').get() }, x: 100, y: 200 },
                    Buttons: {
                        rect: true,
                        x: 100,
                        y: 200,
                    }
                }
            }
        }
    }

    get Buttons() {
        return this.tag('Buttons');
    }

    override _getFocused() {
        return this.Buttons.children[this.index];
    }

    override _handleRight() {
        if (this.index==1) return;
        this.index += 1;
    }

    override _handleLeft() {
        if (this.index==0) return;
        this.index -= 1;
    }

    override _handleEnter() {
        this.Buttons.children[this.index].btn.action();
    }

    public open = (options: any) => {
        Router.focusWidget('Dialog');
        this.tag('Heading').patch({smooth: {text: options.heading}});
        this.tag('Message').patch({smooth: {text: options.message}});
        this.dialogButtons = options.actions;
    }

    set dialogButtons(items: any) {
        this.tag('Buttons').children = items.map((btn: any, index: number) => {
            return {
                type: DialogButtons,
                x: index * 250 + 100,
                y: 100,
                zIndex: 4000,
                btn
            }
        })
    }

    public close = () =>{
        Router.focusPage();
    }
}

class DialogButtons extends Lightning.Component {
    static override _template(): Lightning.Component.Template<Lightning.Component.TemplateSpecLoose> {
        return {
            Wrapper: {
                rect: true,
                x: ((x: number) => x + 100),
                y: ((y: number) => y + 10),
                w: 200,
                h: 70,
                color: Colors('#043464').get(),
                Text: {
                    x: 20,
                    text: {text: '', fontSize: 45, textAlign: 'center', textColor: Colors('white').get() }
                }
            }
        }
    }

    override _focus() {
        this.tag('Wrapper').patch({smooth: {color: Colors('black').get()}});
    }

    override _unfocus() {
        this.tag('Wrapper').patch({smooth: {color: Colors('#043464').get()}});
    }

    override _init() {
        this.tag('Text').patch({smooth: {text: {text: this.btn.label}}});
    }
}