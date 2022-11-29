import { Keyboard, Key as BaseKey } from '@lightningjs/ui';
import { Colors, Lightning, Utils } from "@lightningjs/sdk";


export class MyKeyboard extends Lightning.Component {
    static override _template(): Lightning.Component.Template<Lightning.Component.TemplateSpecLoose> {
        return {
            Keyboard: {
                w: 600,
                h: 500,
                type: Keyboard,
                config: myKeyboardConfig,
                currentLayout: "ABC",
                maxCharacters: 24,
                signals: { onInputChanged: true },
            },
        }
    }

    override _getFocused() {
        return this.tag('Keyboard');
    }

    onInputChanged(inputData: object) {
        this.signal('ouputText', inputData.input);
    }
}

class Key extends BaseKey {
    _firstActive() {
        this.label = {
            mountY: 0.45,
        };
        this.labelColors = {
            unfocused: Colors("black").get(),
            focused: Colors('white').get()
        };
        this.backgroundColors = {
            unfocused: Colors("white").get(),
            focused: Colors(this.fireAncestors("$getThemeColor")).darker(0.5).get(),
        };
        if (this.hasFocus()) {
            this._focus();
        }
    }
    static get width() {
        return 60;
    }
    static get height() {
        return 60;
    }
}


class ActionKey extends BaseKey {
    _active() {
        this.label = {
            mountY: 0.45,
        };
        this.labelColors = {
            unfocused: Colors("black").get(),
            focused: Colors("white").get(),
        };
        this.backgroundColors = {
            unfocused: Colors("white").get(),
            focused: Colors(this.fireAncestors("$getThemeColor")).darker(0.5).get(),
        };
        if (this.hasFocus()) {
            this._focus();
        }
    }
    static get height() {
        return 60;
    }
    static get width() {
        return 160;
    }
}
class IconKey extends ActionKey {
    set icon(src) {
        this._icon = src;
        //call for _update
        this._update();
    }
    get icon() {
        return this._icon;
    }
    _update() {
        if (!this.active) {
            //blocking update if not active.
            return;
        }
        const hasFocus = this.hasFocus();
        let { focused, unfocused = 0xff000000 } = this.backgroundColors;
        //Use labelColors and label to color the icon.
        let { focused: labelFocused, unfocused: labelUnfocused = 0xffffffff } =
            this.labelColors;
        this.patch({
            Background: { color: hasFocus && focused ? focused : unfocused },
            Label: {
                src: Utils.asset(this.icon),
                color: hasFocus && labelFocused ? labelFocused : labelUnfocused,
            },
        });
    }
}

const myKeyboardConfig = {
    layouts: {
        'abc': [
            ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
            ['k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
            ['u', 'v', 'w', 'x', 'y', 'z', '_', '-', '@', '.'],
            ['Layout:ABC', 'Layout:123', 'Space', 'Backspace']
        ],
        'ABC': [
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
            ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
            ['U', 'V', 'W', 'X', 'Y', 'Z', '_', '-', '@', '.'],
            ['Layout:abc', 'Layout:123', 'Space', 'Backspace']
        ],
        '123': [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            ['Layout:abc', 'Space', 'Clear', 'Backspace']
        ]
    },
    styling: {
        align: 'center', //aligns the rows when the width of the Keyboard component is bigger than 0 (zero).
        horizontalSpacing: 20, //spacing between the keys
        verticalSpacing: 20, //spacing between the rows
        Row1: {
            x: 300
        },
        Row2: {
            spacing: 10,
        },
    },
    buttonTypes: {
        default: {
            type: Key
        },
        Backspace: {
            type: IconKey,
            w: 90,
            h: 60,
            icon: "images/backspace.png",
        },
        Layout: { type: ActionKey },
        Space: {
            type: ActionKey,
            w: 360,
            label: "space",
        },
        Clear: {
            type: ActionKey,
            label: "clear",
        },
    }
}