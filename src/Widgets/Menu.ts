import { Colors, Lightning, Utils, Router } from "@lightningjs/sdk";
import { MyInputField } from "./InputField";
import { MyKeyboard } from "./Keyboard";


export class Menu extends Lightning.Component {

    public iconSize: number = 60;
    public focusedIndex: number = 0;
    public itemList: any;
    static override _template(): Lightning.Component.Template {
        return { }
    }

    override _init() {
        this.focusedIndex = 0;
        this.itemList = [
            {
                name: 'search',
                image: 'images/search-icon.png'
            }, 
            {
                name: 'Movies',
                image: 'images/movies.png'
            }, 
            {
                name: 'Tv',
                image: 'images/tv-icons.jpg'
            },
            {
                name: 'Tv',
                image: 'images/tv-icons.jpg'
            }
        ];
        this.items = this.itemList;
    }

    override _getFocused() {
        return this.children[this.focusedIndex];
    }

    override _handleDown() {
        this.focusedIndex = this.focusedIndex == this.itemList.length -1 ? 0 : this.focusedIndex + 1;
    }

    override _handleUp() {
        this.focusedIndex = this.focusedIndex == 0 ? this.itemList.length - 1 : this.focusedIndex - 1;
    }

    _handleClick() {
        console.log('Clicking !!!')
    }

    public showSearch = (show: boolean) => {
        this.signal('resize', show);
    }

    public filterValue = (value: string) => {
        this.signal('filter', value);
    }

    set items(itemList: any) {
        this.children = itemList.map((item: any, index: number) => {
            return  {
                type: MenuOption,
                x: 10,
                y: (index * 90) + 10,
                item,
                signals: {
                    showSearch: this.showSearch,
                    filtered: this.filterValue,
                }
            }
        });
    }
}

class MenuOption extends Lightning.Component {
    static override _template(): Lightning.Component.Template<Lightning.Component.TemplateSpecLoose> {
        return {
            MenuItem: {
                rect: true,
                x: 0,
                y: 0,
                h: 60,
                w: 60,
                Highlight: {
                    rect: true, 
                    w: 25, 
                    h: 5, 
                    x: ((w: number) => w/3),
                    y: ((y: number) => y + 10), 
                    color: Colors('red').get(),
                    visible: false,
                },
                SearchElement: {
                    type: MyInputField,
                    x: 200,
                    y: 100,
                    h: 200,
                    w: 700,
                    visible: false,
                },
                Keyboard: {
                    type: MyKeyboard,
                    x: 200,
                    y: 200,
                    visible: false,
                }
            }
        }
    }


    override _init() {
        this.tag('MenuItem').patch({src: Utils.asset(this.item.image),});
        this.tag('Keyboard').patch({signals: {ouputText: this.enterValues}})
        this._setState('MyInputField');
    }

    public enterValues = (value: string) => {
        this.fireAncestors('$getFilterText', value);
        this.signal('filtered', value);
    }

    get InputField() {
        return this.tag('SearchElement')?.getByRef('InputFieldWrapper')?.getByRef('InputField');
    }

    get KeyBoard() {
        return this.tag('Keyboard')?.getByRef('Keyboard');
    }

    get SearchElement() {
        return this.tag('SearchElement');
    }

    get KeyboardElement() {
        return this.tag('Keyboard');
    }
    
    override _handleEnter(){
        console.log('coming to enter!!!!', this.item);
        if (this.item.name === 'search') {
            this.signal('showSearch', true);
            this.tag('SearchElement').visible = true;
            this.tag('Keyboard').visible = true;
            this._setState('MyKeyboard');
        }
    }

    override _setup() {
        const inputField = this.InputField;
        this.KeyBoard.inputField(inputField);
    }

    static override _states() {
        return [
            class MyKeyboard extends this {
                override _getFocused() {
                    return this.tag('Keyboard');
                }
            },
            class MyInputField extends this {
                override _getFocused() {
                    return this.tag('InputFieldWrapper');
                }
            }
        ]
    }

    override _focus() {
        this.tag('Highlight').visible = true;
    }

    override _unfocus() {
        this.patch({smooth: {alpha: 1, scale: 1, color: Colors('white').get() }});
        this.tag('Highlight').visible = false;
        this.tag('SearchElement').visible = false;
        this.tag('Keyboard').visible = false;
        this._setState('MyInputField');
        this.signal('showSearch', false);
    }
}