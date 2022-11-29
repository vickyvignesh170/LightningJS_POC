import { InputField } from '@lightningjs/ui';
import { Colors, Lightning } from "@lightningjs/sdk";

export class MyInputField extends Lightning.Component {
    static override _template() {
        return {
            InputFieldWrapper: {
                rect: true,
                h: 50,
                w: 560,
                InputField: {
                    x: 30,
                    type: InputField,
                },
            },
        }
    }

    override _active() {
        super._active();
        this.tag('InputFieldWrapper').color = Colors('#808080').get();
    }
}