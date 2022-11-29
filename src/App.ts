/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2022 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Lightning, Router, Colors } from '@lightningjs/sdk'
import { Menu } from './Widgets/Menu'
import routes from './router'
import { FilterBy } from './Widgets/filterBy'
import { Dialog } from './Widgets/dialog'

interface AppTemplateSpec extends Lightning.Component.TemplateSpec {
  Background: {
    Logo: object
    Mystery: object
    Text: object
  }
}

export class App
  extends Router.App
  implements Lightning.Component, Lightning.Component.ImplementTemplateSpec<any>
{
  /*
   * The following properties exist to make it more convenient to access elements
   * below in a type-safe way. They are optional.
   *
   * See https://lightningjs.io/docs/#/lightning-core-reference/TypeScript/Components/TemplateSpecs?id=using-a-template-spec
   * for more information.
   */
  // readonly Background = this.getByRef('Background')!
  // readonly Logo = this.Background.getByRef('Logo')!
  // readonly Text = this.Background.getByRef('Text')!
  // readonly Mystery = this.Background.getByRef('Mystery')!

  static override _template(): Lightning.Component.Template<Lightning.Component.TemplateSpecLoose> {
    return {
      Content: {
        ...super._template(),
      },

      Widgets: {
        Menu: {
          rect: true,
          w: 80,
          h: window.innerHeight,
          color: Colors('black').alpha(0.1).get(),
          zIndex: 1000,
          shader: { type: Lightning.shaders.Inversion, amount: 0 },
          type: Menu,
          visible: false,
        },
        FilterBy: {
          x: 1620,
          y: 50,
          rect: true,
          w: 200,
          h: 50,
          color: Colors('white').alpha(0.7).get(),
          zIndex: 1000,
          type: FilterBy,
          visible: false,
        },
        Dialog: {
          type: Dialog,
          visible: false,
        },
      },
    }
  }

  override _setup() {
    Router.startRouter(routes, this)
  }

  get dialog() {
    return this.tag('Dialog')
  }

  override _handleAppClose() {
    this.dialog.visible = true
    this.dialog.open({
      heading: 'Closing App!!',
      message: 'Are you sure you want to close this APP?',
      actions: [
        {
          label: 'Cancel',
          action: () => {
            this.dialog.visible = false
            this.dialog.close()
          },
        },
        {
          label: 'Yes',
          action: () => {
            this.application.closeApp()
          },
        },
      ],
    })
  }
}
