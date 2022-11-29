import { Colors, Lightning } from "@lightningjs/sdk";

export class FilterBy extends Lightning.Component {

    public currentIndex: number = 0;
    public buttonIndex: number = 0;
    public filters: any = [];
    public currentState: string = 'Options';

    static override _template(): Lightning.Component.Template<Lightning.Component.TemplateSpecLoose> {
        return {
            MyLabel: {
                rect: true,
                x: 0,
                y: 0,
                w: 200,
                h: 50,
                color: Colors('white').alpha(1).get(),
                Text: {
                  mount: -0.2,
                  color: Colors('black').get(),
                  text: {text: 'Filter by', textColor: Colors('black').alpha(1).get(), fontSize: 25}
                },
              },
              Options: {
                visible: false
              },
              Buttons: {
                rect: true,
                x: 0,
                y: 0,
                w: 200,
                h: 70,
                visible: false
              }
        }
    }

    override _init() {
        this.configureFilterOptions();
        this.tag('Buttons').patch({smooth: {y: (this.filters.length * 50) + 50 }});
        this.filterButtons = [
            {
                name: 'Apply',
                value: 'apply'
            },
            {
                name: 'Clear',
                value: 'clear'
            }
        ]
    }

    public configureFilterOptions() {
        const filterOptions = [
            {
                name: 'English',
                value: 'english',
                checked: false
            },
            {
                name: 'Hindi',
                value: 'hindi',
                checked: false
            },
            {
                name: 'Tamil',
                value: 'tamil',
                checked: false
            },
            {
                name: 'Telugu',
                value: 'telugu',
                checked: false
            },
            {
                name: 'Malyalam',
                value: 'malyalam',
                checked: false
            },
            {
                name: 'Kannada',
                value: 'kannada',
                checked: false
            }
        ];
        this.filters = filterOptions;
        this.filterOptions = filterOptions;
    }

    override _getFocused() {
        return this.tag('Options').children[this.currentIndex];
    }

    override _handleDown() {
        if (this.currentState == 'Options') {
            if (this.currentIndex == this.filterOptions.length - 1) {
                this.currentIndex = 0;
                this.resetState('Buttons');
                return;
            }
            this.currentIndex == this.filterOptions.length - 1 ? 0 : this.currentIndex++;
        } else {
            this.resetState('Options');
        }
    }

    override _handleRight() {
        this.buttonIndex == 1 ? 0 : this.buttonIndex++;
    }

    override _handleLeft() {
        this.buttonIndex == 0 ? 1 : this.buttonIndex--;
    }

    override _handleUp() {
        if (this.currentState == 'Options') {
            if (this.currentIndex == 0) {
                this.resetState('Buttons');
                this.currentIndex = this.filters.length - 1;
                return;
            }
            this.currentIndex == 0 ? this.filterOptions.length - 1 : this.currentIndex--;
        } else {
            this.resetState('Options');
        }
    }

    override _focus() {
        this.tag('Options').visible = true;
        this.tag('Buttons').visible = true;
    }

    override _unfocus() {
        this.tag('Options').visible = false;
        this.tag('Buttons').visible = false;
    }

    get filterOptions() {
        return this.filters;
    }

    set filterButtons(buttons: any) {
        this.tag('Buttons').children = buttons.map((button: any, index: number) => {
            return {
                type: FilterButtons,
                x: (index * 100) + 5,
                button,
                signals: {action: this.filterMovieList}
            }
        })
    }

    set filterOptions(options: any) {
        this.tag('Options').children = options.map((option: any, index: number) => {
            return {
                type: FilterBtn,
                y: (index * 50) + 50,
                option,
            }
        });
    }

    public filterMovieList = () => {
        if (this.buttonIndex==0) {
            const filterValues: string[] = [];
            this.tag('Options').children.forEach((options: any) => {
                if (options.option.checked) {
                     filterValues.push(options.option.value)
                }
            });
            this.signal('filterAction', filterValues)
        } else {
            this.configureFilterOptions();
            this.signal('filterAction', []);
        }
    }

    public resetState(state: string) {
        this.currentState = state;
        this._setState(state);
    }

    static override _states() {
        return [
            class Options extends this {
                override _getFocused() {
                    return this.tag('Options').children[this.currentIndex];
                }
            },
            class Buttons extends this {
                override _getFocused() {
                    return this.tag('Buttons').children[this.buttonIndex]
                }
            }
        ]
    }
}

class FilterBtn extends Lightning.Component {
    static override _template(): Lightning.Component.Template<Lightning.Component.TemplateSpecLoose> {
        return {
            FilterBtn: {
                rect: true,
                x:0,
                y:0,
                w: 200,
                h: 50,
                color: Colors('white').get(),
                Checkbox: {
                    rect: true,
                    h: 20,
                    w: 20,
                    mount: -0.5,
                    color: Colors('white').get(),
                    shader: {
                        type: Lightning.shaders.RoundedRectangle, 
                        radius: 2, stroke: 2, 
                        strokeColor: Colors('#cccccc').get()
                    }
                },
                Text: {
                    x: 40,
                    y: 5
                }
            }
        }
    }

    override _handleEnter() {
        if (!this.option.checked) {
            this.tag('Checkbox').patch({
                smooth: {
                    color: Colors('#043464').get(),
                    shader: {type: Lightning.shaders.Outline, color: Colors('#043464').get()}
                } 
            });
        } else {
            this.tag('Checkbox').patch({
                smooth: {
                    color: Colors('white').get(),
                    shader: {type: Lightning.shaders.Outline, stroke: 2, color: Colors('#cccccc').get()}
                } 
            });
        }
        this.option.checked = !this.option.checked;
        
    }

    override _focus() {
        this.tag('FilterBtn').patch({smooth: {color: Colors('#cccccc').get() }});
    }

    override _unfocus() {
        this.tag('FilterBtn').patch({smooth: {color: Colors('white').get() }});
    }

    override _init() {
        this.tag('Text').patch({smooth: {text: {text: this.option.name, textColor: Colors('black').get(), fontSize: 25},}})
    }
}

class FilterButtons extends Lightning.Component {
    static override _template(): Lightning.Component.Template<Lightning.Component.TemplateSpecLoose> {
        return {
            rect: true,
            h: 60,
            w: 90,
            x: 5,
            y: 5,
            color: Colors('#043464').get(),
            Text: {x: 10, y: 10}
        }
    }

    override _handleEnter() {
        this.signal('action');
    }

    override _focus() {
        this.patch({smooth: {color: Colors('black').get()} });
    }

    override _unfocus() {
        this.patch({smooth: {color: Colors('#043464').get()} });
    }

    override _init() {
        this.tag('Text').patch({smooth: {text: {text: this.button.name, textColor: Colors('white').get(), fontSize: 25} }})
    }
}