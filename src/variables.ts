/**
 * This file is generated by 'file2variable-cli'
 * It is not mean to be edited by hand
 */
// tslint:disable
/* eslint-disable */
import { AppPanel } from "./app-panel"
import { App } from "./index"
import { ContextMenu } from "./template-editor/context-menu"
import { DraggingForSelectionLayer } from "./template-editor/dragging-for-selection-layer"
import { MaskLayer } from "./template-editor/mask-layer"
import { OperationPanel } from "./template-editor/operation-panel"
import { RenderLayer } from "./template-editor/render-layer"
import { SelectionLayer } from "./template-editor/selection-layer"
import { TemplateEditor } from "./template-editor/template-editor"
import { TemplateModelEditor } from "./template-model-editor"

// @ts-ignore
export function appPanelTemplateHtml(this: AppPanel) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticStyle:{"display":"flex","align-items":"center","height":"50px"}},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.styleGuideKey),expression:"styleGuideKey"}],attrs:{"type":"text"},domProps:{"value":(_vm.styleGuideKey)},on:{"input":function($event){if($event.target.composing){ return; }_vm.styleGuideKey=$event.target.value}}}),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.loadStyleGuide()}}},[_vm._v("load style guide")]),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.saveStyleGuide()}}},[_vm._v("save style guide")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.templateModelKey),expression:"templateModelKey"}],attrs:{"type":"text"},domProps:{"value":(_vm.templateModelKey)},on:{"input":function($event){if($event.target.composing){ return; }_vm.templateModelKey=$event.target.value}}}),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.loadTemplateModel()}}},[_vm._v("load template model")]),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.saveTemplateModel()}}},[_vm._v("save template model")]),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.editTemplateModel()}}},[_vm._v(_vm._s(_vm.appState.templateModelEditorVisible ? 'hide template model editor' : 'show template model editor'))]),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.precompile()}}},[_vm._v("precompile")]),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.generate()}}},[_vm._v(_vm._s(_vm.appState.graphicCanvasState ? 'back to template' : 'generate graphic'))])])}
// @ts-ignore
export var appPanelTemplateHtmlStatic = [  ]
export const distStyleguideSchemaJson = {
    "$ref": "#/definitions/StyleGuide",
    "definitions": {
        "StyleGuide": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "templates": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Template"
                    }
                }
            },
            "required": [
                "name",
                "templates"
            ],
            "additionalProperties": false
        },
        "Template": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "contents": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/TemplateContent"
                    }
                },
                "parameters": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "x": {
                    "type": "number"
                },
                "y": {
                    "type": "number"
                },
                "z": {
                    "type": "integer"
                },
                "width": {
                    "type": "number"
                },
                "height": {
                    "type": "number"
                },
                "widthExpression": {
                    "type": "string"
                },
                "heightExpression": {
                    "type": "string"
                },
                "display": {
                    "type": "string",
                    "const": "flex"
                },
                "flexDirection": {
                    "type": "string",
                    "enum": [
                        "row",
                        "column"
                    ]
                },
                "justifyContent": {
                    "type": "string",
                    "enum": [
                        "start",
                        "end",
                        "center",
                        "between"
                    ]
                },
                "alignItems": {
                    "type": "string",
                    "enum": [
                        "start",
                        "end",
                        "center"
                    ]
                },
                "marginLeft": {
                    "type": "number"
                },
                "marginRight": {
                    "type": "number"
                },
                "marginTop": {
                    "type": "number"
                },
                "marginBottom": {
                    "type": "number"
                }
            },
            "required": [
                "id",
                "contents",
                "x",
                "y",
                "width",
                "height"
            ],
            "additionalProperties": false
        },
        "TemplateContent": {
            "anyOf": [
                {
                    "$ref": "#/definitions/TemplateTextContent"
                },
                {
                    "$ref": "#/definitions/TemplateImageContent"
                },
                {
                    "$ref": "#/definitions/TemplateColorContent"
                },
                {
                    "$ref": "#/definitions/TemplateReferenceContent"
                },
                {
                    "$ref": "#/definitions/TemplateSnapshotContent"
                }
            ]
        },
        "TemplateTextContent": {
            "type": "object",
            "properties": {
                "kind": {
                    "type": "string",
                    "const": "text"
                },
                "text": {
                    "type": "string"
                },
                "textExpression": {
                    "type": "string"
                },
                "fontFamily": {
                    "type": "string"
                },
                "fontSize": {
                    "type": "number"
                },
                "fontSizeExpression": {
                    "type": "string"
                },
                "color": {
                    "type": "string"
                },
                "characters": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/TextCharacter"
                    }
                },
                "x": {
                    "type": "number"
                },
                "y": {
                    "type": "number"
                },
                "z": {
                    "type": "integer"
                },
                "width": {
                    "type": "number"
                },
                "height": {
                    "type": "number"
                },
                "xExpression": {
                    "type": "string"
                },
                "yExpression": {
                    "type": "string"
                },
                "zExpression": {
                    "type": "string"
                },
                "widthExpression": {
                    "type": "string"
                },
                "heightExpression": {
                    "type": "string"
                },
                "if": {
                    "type": "string"
                },
                "repeat": {
                    "type": "string"
                },
                "hidden": {
                    "type": "boolean"
                }
            },
            "required": [
                "kind",
                "text",
                "fontFamily",
                "fontSize",
                "color",
                "x",
                "y",
                "width",
                "height"
            ],
            "additionalProperties": false
        },
        "TextCharacter": {
            "type": "object",
            "properties": {
                "text": {
                    "type": "string"
                }
            },
            "required": [
                "text"
            ],
            "additionalProperties": false
        },
        "TemplateImageContent": {
            "type": "object",
            "properties": {
                "kind": {
                    "type": "string",
                    "const": "image"
                },
                "url": {
                    "type": "string"
                },
                "urlExpression": {
                    "type": "string"
                },
                "opacity": {
                    "type": "number"
                },
                "base64": {
                    "type": "string"
                },
                "x": {
                    "type": "number"
                },
                "y": {
                    "type": "number"
                },
                "z": {
                    "type": "integer"
                },
                "width": {
                    "type": "number"
                },
                "height": {
                    "type": "number"
                },
                "xExpression": {
                    "type": "string"
                },
                "yExpression": {
                    "type": "string"
                },
                "zExpression": {
                    "type": "string"
                },
                "widthExpression": {
                    "type": "string"
                },
                "heightExpression": {
                    "type": "string"
                },
                "if": {
                    "type": "string"
                },
                "repeat": {
                    "type": "string"
                },
                "hidden": {
                    "type": "boolean"
                }
            },
            "required": [
                "kind",
                "url",
                "x",
                "y",
                "width",
                "height"
            ],
            "additionalProperties": false
        },
        "TemplateColorContent": {
            "type": "object",
            "properties": {
                "kind": {
                    "type": "string",
                    "const": "color"
                },
                "color": {
                    "type": "string"
                },
                "x": {
                    "type": "number"
                },
                "y": {
                    "type": "number"
                },
                "z": {
                    "type": "integer"
                },
                "width": {
                    "type": "number"
                },
                "height": {
                    "type": "number"
                },
                "xExpression": {
                    "type": "string"
                },
                "yExpression": {
                    "type": "string"
                },
                "zExpression": {
                    "type": "string"
                },
                "widthExpression": {
                    "type": "string"
                },
                "heightExpression": {
                    "type": "string"
                },
                "if": {
                    "type": "string"
                },
                "repeat": {
                    "type": "string"
                },
                "hidden": {
                    "type": "boolean"
                }
            },
            "required": [
                "kind",
                "color",
                "x",
                "y",
                "width",
                "height"
            ],
            "additionalProperties": false
        },
        "TemplateReferenceContent": {
            "type": "object",
            "properties": {
                "kind": {
                    "type": "string",
                    "const": "reference"
                },
                "id": {
                    "type": "string"
                },
                "props": {
                    "type": "string"
                },
                "x": {
                    "type": "number"
                },
                "y": {
                    "type": "number"
                },
                "z": {
                    "type": "integer"
                },
                "xExpression": {
                    "type": "string"
                },
                "yExpression": {
                    "type": "string"
                },
                "zExpression": {
                    "type": "string"
                },
                "if": {
                    "type": "string"
                },
                "repeat": {
                    "type": "string"
                },
                "hidden": {
                    "type": "boolean"
                }
            },
            "required": [
                "kind",
                "id",
                "x",
                "y"
            ],
            "additionalProperties": false
        },
        "TemplateSnapshotContent": {
            "type": "object",
            "properties": {
                "kind": {
                    "type": "string",
                    "const": "snapshot"
                },
                "snapshot": {
                    "$ref": "#/definitions/Template"
                },
                "x": {
                    "type": "number"
                },
                "y": {
                    "type": "number"
                },
                "z": {
                    "type": "integer"
                },
                "xExpression": {
                    "type": "string"
                },
                "yExpression": {
                    "type": "string"
                },
                "zExpression": {
                    "type": "string"
                },
                "hidden": {
                    "type": "boolean"
                }
            },
            "required": [
                "kind",
                "snapshot",
                "x",
                "y"
            ],
            "additionalProperties": false
        }
    }
}
// @ts-ignore
export function indexTemplateHtml(this: App) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticStyle:{"display":"flex","flex-direction":"column"}},[_c('div',{staticStyle:{"height":"50px"}},[_c('app-panel',{attrs:{"appState":_vm.appState}}),_vm._v(" "),_c('template-model-editor',{attrs:{"appState":_vm.appState}})],1),_vm._v(" "),(_vm.appState.graphicCanvasState)?_c('template-editor',{attrs:{"canvasState":_vm.appState.graphicCanvasState}}):_vm._e(),_vm._v(" "),_c('template-editor',{directives:[{name:"show",rawName:"v-show",value:(!_vm.appState.graphicCanvasState),expression:"!appState.graphicCanvasState"}],attrs:{"canvasState":_vm.appState.canvasState}})],1)}
// @ts-ignore
export var indexTemplateHtmlStatic = [  ]
// @ts-ignore
export function templateEditorContextMenuTemplateHtml(this: ContextMenu) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.canvasState.contextMenuEnabled)?_c('div',{on:{"click":_vm.close}},[_c('div',{style:(_vm.maskStyle)}),_vm._v(" "),_c('div',{style:(_vm.contextMenuStyle)},[_c('button',{on:{"click":_vm.remove}},[_vm._v("remove")])])]):_vm._e()}
// @ts-ignore
export var templateEditorContextMenuTemplateHtmlStatic = [  ]
// @ts-ignore
export function templateEditorDraggingForSelectionLayerTemplateHtml(this: DraggingForSelectionLayer) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.canvasState.isDraggingForSelection)?_c('div',{style:(_vm.draggingAreaStyle)}):_vm._e()}
// @ts-ignore
export var templateEditorDraggingForSelectionLayerTemplateHtmlStatic = [  ]
// @ts-ignore
export function templateEditorMaskLayerTemplateHtml(this: MaskLayer) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.maskStyle),attrs:{"tabindex":"0"},on:{"wheel":_vm.wheel,"mousedown":_vm.mousedown,"mouseup":_vm.mouseup,"mousemove":_vm.mousemove,"contextmenu":_vm.contextmenu,"keydown":_vm.keydown}})}
// @ts-ignore
export var templateEditorMaskLayerTemplateHtmlStatic = [  ]
// @ts-ignore
export function templateEditorOperationPanelTemplateHtml(this: OperationPanel) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.panelStyle)},[(_vm.canvasState.selection.kind === 'content')?_c('div',[(_vm.canvasState.selection.content.kind === 'text')?_c('div',[_vm._v("\n      text\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.text},on:{"change":_vm.changeText}}),_vm._v(" "),_c('br'),_vm._v("\n      text f(x)\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.textExpression},on:{"change":_vm.changeTextExpression}}),_vm._v(" "),_c('br'),_vm._v("\n      font family\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.fontFamily},on:{"change":_vm.changeFontFamily}}),_vm._v(" "),_c('br'),_vm._v("\n      font size\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.content.fontSize},on:{"change":_vm.changeFontSize}}),_vm._v(" "),_c('br'),_vm._v("\n      font size f(x)\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.fontSizeExpression},on:{"change":_vm.changeFontSizeExpression}}),_vm._v(" "),_c('br'),_vm._v("\n      color\n      "),_c('input',{attrs:{"type":"color"},domProps:{"value":_vm.canvasState.selection.content.color},on:{"change":_vm.changeColor}})]):_vm._e(),_vm._v(" "),(_vm.canvasState.selection.content.kind === 'image')?_c('div',[_vm._v("\n      url\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.url},on:{"change":_vm.changeImageUrl}}),_vm._v(" "),_c('br'),_vm._v("\n      url f(x)\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.urlExpression},on:{"change":_vm.changeImageUrlExpression}}),_vm._v(" "),_c('div',[_vm._v("\n        opacity\n        "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.content.opacity},on:{"change":_vm.changeOpacity}})])]):_vm._e(),_vm._v(" "),(_vm.canvasState.selection.content.kind === 'color')?_c('div',[_vm._v("\n      color\n      "),_c('input',{attrs:{"type":"color"},domProps:{"value":_vm.canvasState.selection.content.color},on:{"change":_vm.changeColor}})]):_vm._e(),_vm._v(" "),_c('div',[_vm._v("\n      x\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.content.x},on:{"change":function($event){return _vm.changePosition($event, 'x')}}})]),_vm._v(" "),_c('div',[_vm._v("\n      x f(x)\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.xExpression},on:{"change":function($event){return _vm.changePositionExpression($event, 'x')}}})]),_vm._v(" "),_c('div',[_vm._v("\n      y\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.content.y},on:{"change":function($event){return _vm.changePosition($event, 'y')}}})]),_vm._v(" "),_c('div',[_vm._v("\n      y f(x)\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.yExpression},on:{"change":function($event){return _vm.changePositionExpression($event, 'y')}}})]),_vm._v(" "),_c('div',[_vm._v("\n      z\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.content.z},on:{"change":function($event){return _vm.changePosition($event, 'z')}}})]),_vm._v(" "),_c('div',[_vm._v("\n      z f(x)\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.zExpression},on:{"change":function($event){return _vm.changePositionExpression($event, 'z')}}})]),_vm._v(" "),(_vm.canvasState.selection.content.kind === 'text' || _vm.canvasState.selection.content.kind === 'image' || _vm.canvasState.selection.content.kind === 'color')?_c('div',[_c('div',[_vm._v("\n        width\n        "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.content.width},on:{"change":function($event){return _vm.changeSize($event, 'width')}}})]),_vm._v(" "),_c('div',[_vm._v("\n        width f(x)\n        "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.widthExpression},on:{"change":function($event){return _vm.changeSizeExpression($event, 'width')}}})]),_vm._v(" "),_c('div',[_vm._v("\n        height\n        "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.content.height},on:{"change":function($event){return _vm.changeSize($event, 'height')}}})]),_vm._v(" "),_c('div',[_vm._v("\n        height f(x)\n        "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.heightExpression},on:{"change":function($event){return _vm.changeSizeExpression($event, 'height')}}})])]):_vm._e(),_vm._v(" "),(_vm.canvasState.selection.content.kind === 'snapshot')?_vm._l((_vm.canvasState.selection.content.snapshot.contents),function(content,i){return _c('div',[_c('div',{staticStyle:{"cursor":"pointer"},on:{"click":function($event){return _vm.selectContent(content)}}},[_vm._v("content "+_vm._s(i)+": "+_vm._s(content.kind))])])}):_vm._e(),_vm._v(" "),_c('div',[_vm._v("\n      hidden\n      "),_c('input',{attrs:{"type":"checkbox"},domProps:{"checked":_vm.canvasState.selection.content.hidden},on:{"change":_vm.changeHidden}})]),_vm._v(" "),_c('div',[_vm._v("\n      if\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.if},on:{"change":_vm.changeIf}})]),_vm._v(" "),_c('div',[_vm._v("\n      repeat\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.repeat},on:{"change":_vm.changeRepeat}})]),_vm._v(" "),(_vm.canvasState.selection.content.kind === 'reference')?_c('div',[_vm._v("\n      props\n      "),_c('span',{staticStyle:{"opacity":"0.5"}},[_vm._v(_vm._s(_vm.canvasState.selection.content.props))]),_vm._v(" "),(_vm.parameters)?_c('div',_vm._l((_vm.parameters),function(parameter){return _c('div',[_vm._v("\n          "+_vm._s(parameter)+"\n          "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.getParameterValue(parameter)},on:{"change":function($event){return _vm.changeParameterValue($event, parameter)}}})])}),0):_vm._e()]):_vm._e(),_vm._v(" "),(_vm.canvasState.selection.content.kind === 'text' || _vm.canvasState.selection.content.kind === 'image' || _vm.canvasState.selection.content.kind === 'color')?_c('div',[_c('button',{on:{"click":function($event){return _vm.extractAsComponent()}}},[_vm._v("extract as component")])]):_vm._e()],2):_vm._e(),_vm._v(" "),(_vm.canvasState.selection.kind === 'template')?_c('div',[_c('div',[_vm._v("\n      x\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.template.x},on:{"change":function($event){return _vm.changePosition($event, 'x')}}})]),_vm._v(" "),_c('div',[_vm._v("\n      y\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.template.y},on:{"change":function($event){return _vm.changePosition($event, 'y')}}})]),_vm._v(" "),_c('div',[_vm._v("\n      z\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.template.z},on:{"change":function($event){return _vm.changePosition($event, 'z')}}})]),_vm._v(" "),_c('div',[_vm._v("\n      width\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.template.width},on:{"change":function($event){return _vm.changeSize($event, 'width')}}})]),_vm._v(" "),_c('div',[_vm._v("\n      width f(x)\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.template.widthExpression},on:{"change":function($event){return _vm.changeSizeExpression($event, 'width')}}})]),_vm._v(" "),_c('div',[_vm._v("\n      height\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.template.height},on:{"change":function($event){return _vm.changeSize($event, 'height')}}})]),_vm._v(" "),_c('div',[_vm._v("\n      height f(x)\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.template.heightExpression},on:{"change":function($event){return _vm.changeSizeExpression($event, 'height')}}})]),_vm._v(" "),_vm._l((_vm.canvasState.selection.template.contents),function(content,i){return _c('div',[_c('div',{staticStyle:{"cursor":"pointer"},on:{"click":function($event){return _vm.selectContent(content)}}},[_vm._v("content "+_vm._s(i)+": "+_vm._s(content.kind))])])}),_vm._v(" "),_c('div',[_vm._v("\n      display\n      "),_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.canvasState.selection.template.display),expression:"canvasState.selection.template.display"}],on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.$set(_vm.canvasState.selection.template, "display", $event.target.multiple ? $$selectedVal : $$selectedVal[0])}}},[_c('option',{domProps:{"value":undefined}}),_vm._v(" "),_c('option',{attrs:{"value":"flex"}},[_vm._v("flex")])])]),_vm._v(" "),_c('div',[_vm._v("\n      flex direction\n      "),_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.canvasState.selection.template.flexDirection),expression:"canvasState.selection.template.flexDirection"}],on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.$set(_vm.canvasState.selection.template, "flexDirection", $event.target.multiple ? $$selectedVal : $$selectedVal[0])}}},[_c('option',{attrs:{"value":"row"}},[_vm._v("row")]),_vm._v(" "),_c('option',{attrs:{"value":"column"}},[_vm._v("column")])])]),_vm._v(" "),_c('div',[_vm._v("\n      justify content\n      "),_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.canvasState.selection.template.justifyContent),expression:"canvasState.selection.template.justifyContent"}],on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.$set(_vm.canvasState.selection.template, "justifyContent", $event.target.multiple ? $$selectedVal : $$selectedVal[0])}}},[_c('option',{attrs:{"value":"start"}},[_vm._v("start")]),_vm._v(" "),_c('option',{attrs:{"value":"end"}},[_vm._v("end")]),_vm._v(" "),_c('option',{attrs:{"value":"center"}},[_vm._v("center")]),_vm._v(" "),_c('option',{attrs:{"value":"between"}},[_vm._v("between")])])]),_vm._v(" "),_c('div',[_vm._v("\n      align items\n      "),_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.canvasState.selection.template.alignItems),expression:"canvasState.selection.template.alignItems"}],on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.$set(_vm.canvasState.selection.template, "alignItems", $event.target.multiple ? $$selectedVal : $$selectedVal[0])}}},[_c('option',{attrs:{"value":"start"}},[_vm._v("start")]),_vm._v(" "),_c('option',{attrs:{"value":"end"}},[_vm._v("end")]),_vm._v(" "),_c('option',{attrs:{"value":"center"}},[_vm._v("center")])])]),_vm._v(" "),_c('div',[_c('button',{on:{"click":function($event){return _vm.renderToImage()}}},[_vm._v("render to image")]),_vm._v(" "),(_vm.imageUrl)?_c('img',{staticStyle:{"object-fit":"contain","width":"100%"},attrs:{"src":_vm.imageUrl}}):_vm._e()]),_vm._v(" "),_c('div',[_vm._l((_vm.canvasState.selection.template.parameters || []),function(parameter,i){return _c('div',[_vm._v("\n        parameter "+_vm._s(i)+"\n        "),_c('input',{attrs:{"type":"text"},domProps:{"value":parameter},on:{"change":function($event){return _vm.changeParameter($event, i)}}})])}),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.addParameter()}}},[_vm._v("add parameter")])],2)],2):_vm._e(),_vm._v(" "),_c('div',[_c('button',{on:{"click":function($event){return _vm.debug()}}},[_vm._v("debug")])]),_vm._v(" "),_c('div',[_c('button',{on:{"click":function($event){return _vm.addTemplate()}}},[_vm._v("add template")]),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.addText()}}},[_vm._v("add text")]),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.addImage()}}},[_vm._v("add image")]),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.addColor()}}},[_vm._v("add color")])])])}
// @ts-ignore
export var templateEditorOperationPanelTemplateHtmlStatic = [  ]
// @ts-ignore
export function templateEditorRenderLayerTemplateHtml(this: RenderLayer) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.canvasStyle)},[_c('div',{style:(_vm.styleGuideStyle)},[_vm._l((_vm.canvasState.styleGuide.templates),function(r){return [_c('div',{style:(_vm.getTemplateStyle(r))},[_c('template-renderer',{attrs:{"template":r,"templates":_vm.canvasState.styleGuide.templates}})],1)]})],2)])}
// @ts-ignore
export var templateEditorRenderLayerTemplateHtmlStatic = [  ]
// @ts-ignore
export function templateEditorSelectionLayerTemplateHtml(this: SelectionLayer) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.canvasStyle)},[_c('div',{style:(_vm.styleGuideStyle)},[_vm._l((_vm.selectionRegions),function(r){return [_c('div',{style:(_vm.getSelectionAreaStyle(r))})]})],2)])}
// @ts-ignore
export var templateEditorSelectionLayerTemplateHtmlStatic = [  ]
// @ts-ignore
export function templateEditorTemplateEditorTemplateHtml(this: TemplateEditor) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticStyle:{"display":"flex"}},[_c('div',{style:(_vm.canvasStyle)},[_c('render-layer',{attrs:{"canvasState":_vm.canvasState}}),_vm._v(" "),_c('selection-layer',{attrs:{"canvasState":_vm.canvasState}}),_vm._v(" "),_c('dragging-for-selection-layer',{attrs:{"canvasState":_vm.canvasState}}),_vm._v(" "),_c('mask-layer',{attrs:{"canvasState":_vm.canvasState}}),_vm._v(" "),_c('context-menu',{attrs:{"canvasState":_vm.canvasState}})],1),_vm._v(" "),_c('div',{staticStyle:{"width":"300px","right":"0","position":"absolute"}},[_c('operation-panel',{attrs:{"canvasState":_vm.canvasState}})],1)])}
// @ts-ignore
export var templateEditorTemplateEditorTemplateHtmlStatic = [  ]
// @ts-ignore
export function templateModelEditorTemplateHtml(this: TemplateModelEditor) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.appState.templateModelEditorVisible)?_c('div',{style:(_vm.editorStyle)},[_c('json-editor',{attrs:{"schema":_vm.schema,"initial-value":_vm.appState.templateModel},on:{"update-value":function($event){return _vm.updateValue($event)}}})],1):_vm._e()}
// @ts-ignore
export var templateModelEditorTemplateHtmlStatic = [  ]
/* eslint-enable */
// tslint:enable
