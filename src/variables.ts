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
import { ExpressionEditor } from "./template-editor/expression-editor"
import { HoverLayer } from "./template-editor/hover-layer"
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
                "name": {
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
                "widthExpressionId": {
                    "type": "string"
                },
                "heightExpressionId": {
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
                "textExpressionId": {
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
                "fontSizeExpressionId": {
                    "type": "string"
                },
                "color": {
                    "type": "string"
                },
                "colorExpression": {
                    "type": "string"
                },
                "colorExpressionId": {
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
                "xExpressionId": {
                    "type": "string"
                },
                "yExpressionId": {
                    "type": "string"
                },
                "zExpressionId": {
                    "type": "string"
                },
                "widthExpression": {
                    "type": "string"
                },
                "heightExpression": {
                    "type": "string"
                },
                "widthExpressionId": {
                    "type": "string"
                },
                "heightExpressionId": {
                    "type": "string"
                },
                "if": {
                    "type": "string"
                },
                "ifId": {
                    "type": "string"
                },
                "else": {
                    "type": "boolean"
                },
                "repeat": {
                    "type": "string"
                },
                "repeatId": {
                    "type": "string"
                },
                "hidden": {
                    "type": "boolean"
                },
                "rotate": {
                    "type": "number"
                },
                "rotateExpression": {
                    "type": "string"
                },
                "rotateExpressionId": {
                    "type": "string"
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
                "urlExpressionId": {
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
                "xExpressionId": {
                    "type": "string"
                },
                "yExpressionId": {
                    "type": "string"
                },
                "zExpressionId": {
                    "type": "string"
                },
                "widthExpression": {
                    "type": "string"
                },
                "heightExpression": {
                    "type": "string"
                },
                "widthExpressionId": {
                    "type": "string"
                },
                "heightExpressionId": {
                    "type": "string"
                },
                "if": {
                    "type": "string"
                },
                "ifId": {
                    "type": "string"
                },
                "else": {
                    "type": "boolean"
                },
                "repeat": {
                    "type": "string"
                },
                "repeatId": {
                    "type": "string"
                },
                "hidden": {
                    "type": "boolean"
                },
                "rotate": {
                    "type": "number"
                },
                "rotateExpression": {
                    "type": "string"
                },
                "rotateExpressionId": {
                    "type": "string"
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
                "colorExpression": {
                    "type": "string"
                },
                "colorExpressionId": {
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
                "xExpressionId": {
                    "type": "string"
                },
                "yExpressionId": {
                    "type": "string"
                },
                "zExpressionId": {
                    "type": "string"
                },
                "widthExpression": {
                    "type": "string"
                },
                "heightExpression": {
                    "type": "string"
                },
                "widthExpressionId": {
                    "type": "string"
                },
                "heightExpressionId": {
                    "type": "string"
                },
                "if": {
                    "type": "string"
                },
                "ifId": {
                    "type": "string"
                },
                "else": {
                    "type": "boolean"
                },
                "repeat": {
                    "type": "string"
                },
                "repeatId": {
                    "type": "string"
                },
                "hidden": {
                    "type": "boolean"
                },
                "rotate": {
                    "type": "number"
                },
                "rotateExpression": {
                    "type": "string"
                },
                "rotateExpressionId": {
                    "type": "string"
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
                "propsIds": {
                    "type": "object",
                    "additionalProperties": {
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
                "xExpression": {
                    "type": "string"
                },
                "yExpression": {
                    "type": "string"
                },
                "zExpression": {
                    "type": "string"
                },
                "xExpressionId": {
                    "type": "string"
                },
                "yExpressionId": {
                    "type": "string"
                },
                "zExpressionId": {
                    "type": "string"
                },
                "if": {
                    "type": "string"
                },
                "ifId": {
                    "type": "string"
                },
                "else": {
                    "type": "boolean"
                },
                "repeat": {
                    "type": "string"
                },
                "repeatId": {
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
                "xExpressionId": {
                    "type": "string"
                },
                "yExpressionId": {
                    "type": "string"
                },
                "zExpressionId": {
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
export function templateEditorExpressionEditorTemplateHtml(this: ExpressionEditor) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.editorStyle)},[_c('json-editor',{attrs:{"schema":_vm.schema,"initial-value":_vm.ast},on:{"update-value":function($event){return _vm.updateValue($event)}}})],1)}
// @ts-ignore
export var templateEditorExpressionEditorTemplateHtmlStatic = [  ]
// @ts-ignore
export function templateEditorHoverLayerTemplateHtml(this: HoverLayer) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.canvasStyle)},[_c('div',{style:(_vm.styleGuideStyle)},[(_vm.hoverStyle)?_c('div',{style:(_vm.hoverStyle)}):_vm._e()])])}
// @ts-ignore
export var templateEditorHoverLayerTemplateHtmlStatic = [  ]
// @ts-ignore
export function templateEditorMaskLayerTemplateHtml(this: MaskLayer) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.maskStyle),attrs:{"tabindex":"0"},on:{"wheel":_vm.wheel,"mousedown":_vm.mousedown,"mouseup":_vm.mouseup,"mousemove":_vm.mousemove,"contextmenu":_vm.contextmenu,"keydown":_vm.keydown}})}
// @ts-ignore
export var templateEditorMaskLayerTemplateHtmlStatic = [  ]
// @ts-ignore
export function templateEditorOperationPanelTemplateHtml(this: OperationPanel) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.panelStyle)},[(_vm.canvasState.selection.kind === 'content')?_c('div',[(_vm.canvasState.selection.content.kind === 'text')?_c('div',[_vm._v("\n      text\n      "),_c('expression-input',{attrs:{"canvasState":_vm.canvasState,"literal":_vm.canvasState.selection.content.text,"literalType":"text","expression":_vm.canvasState.selection.content.textExpression,"expressionId":_vm.canvasState.selection.content.textExpressionId},on:{"change":_vm.changeTextExpression}}),_vm._v(" "),_c('br'),_vm._v("\n      font family\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.fontFamily},on:{"change":_vm.changeFontFamily}}),_vm._v(" "),_c('br'),_vm._v("\n      font size\n      "),_c('expression-input',{attrs:{"canvasState":_vm.canvasState,"literal":_vm.canvasState.selection.content.fontSize,"literalType":"number","expression":_vm.canvasState.selection.content.fontSizeExpression,"expressionId":_vm.canvasState.selection.content.fontSizeExpressionId},on:{"change":_vm.changeFontSizeExpression}}),_vm._v(" "),_c('br'),_vm._v("\n      color\n      "),_c('expression-input',{attrs:{"canvasState":_vm.canvasState,"literal":_vm.canvasState.selection.content.color,"literalType":"color","expression":_vm.canvasState.selection.content.colorExpression,"expressionId":_vm.canvasState.selection.content.colorExpressionId},on:{"change":_vm.changeColorExpression}})],1):_vm._e(),_vm._v(" "),(_vm.canvasState.selection.content.kind === 'image')?_c('div',[_vm._v("\n      url\n      "),_c('expression-input',{attrs:{"canvasState":_vm.canvasState,"literal":_vm.canvasState.selection.content.url,"literalType":"text","expression":_vm.canvasState.selection.content.urlExpression,"expressionId":_vm.canvasState.selection.content.urlExpressionId},on:{"change":_vm.changeImageUrlExpression}}),_vm._v(" "),_c('div',[_vm._v("\n        opacity\n        "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.content.opacity},on:{"change":_vm.changeOpacity}})])],1):_vm._e(),_vm._v(" "),(_vm.canvasState.selection.content.kind === 'color')?_c('div',[_vm._v("\n      color\n      "),_c('expression-input',{attrs:{"canvasState":_vm.canvasState,"literal":_vm.canvasState.selection.content.color,"literalType":"color","expression":_vm.canvasState.selection.content.colorExpression,"expressionId":_vm.canvasState.selection.content.colorExpressionId},on:{"change":_vm.changeColorExpression}})],1):_vm._e(),_vm._v(" "),_c('div',[_vm._v("\n      x\n      "),_c('expression-input',{attrs:{"canvasState":_vm.canvasState,"literal":_vm.canvasState.selection.content.x,"literalType":"number","expression":_vm.canvasState.selection.content.xExpression,"expressionId":_vm.canvasState.selection.content.xExpressionId},on:{"change":function($event){return _vm.changePositionExpression($event, 'x')}}})],1),_vm._v(" "),_c('div',[_vm._v("\n      y\n      "),_c('expression-input',{attrs:{"canvasState":_vm.canvasState,"literal":_vm.canvasState.selection.content.y,"literalType":"number","expression":_vm.canvasState.selection.content.yExpression,"expressionId":_vm.canvasState.selection.content.yExpressionId},on:{"change":function($event){return _vm.changePositionExpression($event, 'y')}}})],1),_vm._v(" "),_c('div',[_vm._v("\n      z\n      "),_c('expression-input',{attrs:{"canvasState":_vm.canvasState,"literal":_vm.canvasState.selection.content.z,"literalType":"number","expression":_vm.canvasState.selection.content.zExpression,"expressionId":_vm.canvasState.selection.content.zExpressionId},on:{"change":function($event){return _vm.changePositionExpression($event, 'z')}}})],1),_vm._v(" "),(_vm.canvasState.selection.content.kind === 'text' || _vm.canvasState.selection.content.kind === 'image' || _vm.canvasState.selection.content.kind === 'color')?_c('div',[_c('div',[_vm._v("\n        width\n        "),_c('expression-input',{attrs:{"canvasState":_vm.canvasState,"literal":_vm.canvasState.selection.content.width,"literalType":"number","expression":_vm.canvasState.selection.content.widthExpression,"expressionId":_vm.canvasState.selection.content.widthExpressionId},on:{"change":function($event){return _vm.changeSizeExpression($event, 'width')}}})],1),_vm._v(" "),_c('div',[_vm._v("\n        height\n        "),_c('expression-input',{attrs:{"canvasState":_vm.canvasState,"literal":_vm.canvasState.selection.content.height,"literalType":"number","expression":_vm.canvasState.selection.content.heightExpression,"expressionId":_vm.canvasState.selection.content.heihtExpressionId},on:{"change":function($event){return _vm.changeSizeExpression($event, 'height')}}})],1),_vm._v(" "),_c('div',[_vm._v("\n        rotate\n        "),_c('expression-input',{attrs:{"canvasState":_vm.canvasState,"literal":_vm.canvasState.selection.content.rotate,"literalType":"number","expression":_vm.canvasState.selection.content.rotateExpression,"expressionId":_vm.canvasState.selection.content.rotateExpressionId},on:{"change":function($event){return _vm.changeRotateExpression($event)}}})],1)]):_vm._e(),_vm._v(" "),(_vm.canvasState.selection.content.kind === 'snapshot')?_vm._l((_vm.canvasState.selection.content.snapshot.contents),function(content,i){return _c('div',[_c('div',{staticStyle:{"cursor":"pointer"},on:{"click":function($event){return _vm.selectContent(content)}}},[_vm._v("content "+_vm._s(i)+": "+_vm._s(content.kind))])])}):_vm._e(),_vm._v(" "),_c('div',[_vm._v("\n      hidden\n      "),_c('input',{attrs:{"type":"checkbox"},domProps:{"checked":_vm.canvasState.selection.content.hidden},on:{"change":_vm.changeHidden}})]),_vm._v(" "),_c('div',[_c('select',{domProps:{"value":_vm.canvasState.selection.content.else ? 'true' : 'false'},on:{"change":_vm.changeElse}},[_c('option',{attrs:{"value":"false"}},[_vm._v("if")]),_vm._v(" "),_c('option',{attrs:{"value":"true"}},[_vm._v("else if")])]),_vm._v(" "),_c('expression-input',{attrs:{"canvasState":_vm.canvasState,"expression":_vm.canvasState.selection.content.if,"expressionId":_vm.canvasState.selection.content.ifId},on:{"change":_vm.changeIf}})],1),_vm._v(" "),_c('div',[_vm._v("\n      repeat\n      "),_c('expression-input',{attrs:{"canvasState":_vm.canvasState,"expression":_vm.repeat.expression,"expressionId":_vm.canvasState.selection.content.repeatId},on:{"change":_vm.changeRepeatExpression}}),_vm._v(" "),_c('input',{staticStyle:{"width":"150px","margin-left":"25px"},attrs:{"type":"text","placeholder":"item name"},domProps:{"value":_vm.repeat.itemName},on:{"change":_vm.changeRepeatItemName}}),_vm._v(" "),_c('input',{staticStyle:{"width":"50px"},attrs:{"type":"text","placeholder":"index name"},domProps:{"value":_vm.repeat.indexName},on:{"change":_vm.changeRepeatIndexName}})],1),_vm._v(" "),(_vm.canvasState.selection.content.kind === 'reference')?_c('div',[_vm._v("\n      props\n      "),_c('span',{staticStyle:{"opacity":"0.5"}},[_vm._v(_vm._s(_vm.canvasState.selection.content.props))]),_vm._v(" "),(_vm.parameters)?_c('div',{staticStyle:{"margin-left":"10px"}},_vm._l((_vm.parameters),function(parameter){return _c('div',[_vm._v("\n          "+_vm._s(parameter)+"\n          "),_c('expression-input',{attrs:{"canvasState":_vm.canvasState,"expression":_vm.getParameterValue(parameter),"expressionId":_vm.getParameterExpressionId(parameter)},on:{"change":function($event){return _vm.changeParameterValue($event, parameter)}}})],1)}),0):_vm._e()]):_vm._e(),_vm._v(" "),(_vm.canvasState.selection.content.kind === 'text' || _vm.canvasState.selection.content.kind === 'image' || _vm.canvasState.selection.content.kind === 'color')?_c('div',[_c('button',{on:{"click":function($event){return _vm.extractAsComponent()}}},[_vm._v("extract as component")])]):_vm._e()],2):_vm._e(),_vm._v(" "),(_vm.canvasState.selection.kind === 'template')?_c('div',[_c('div',[_vm._v("\n      name\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.template.name},on:{"change":_vm.changeName}})]),_vm._v(" "),_c('div',[_vm._v("\n      x\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.template.x},on:{"change":function($event){return _vm.changePosition($event, 'x')}}})]),_vm._v(" "),_c('div',[_vm._v("\n      y\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.template.y},on:{"change":function($event){return _vm.changePosition($event, 'y')}}})]),_vm._v(" "),_c('div',[_vm._v("\n      z\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.template.z},on:{"change":function($event){return _vm.changePosition($event, 'z')}}})]),_vm._v(" "),_c('div',[_vm._v("\n      width\n      "),_c('expression-input',{attrs:{"canvasState":_vm.canvasState,"literal":_vm.canvasState.selection.template.width,"literalType":"number","expression":_vm.canvasState.selection.template.widthExpression,"expressionId":_vm.canvasState.selection.template.widthExpressionId},on:{"change":function($event){return _vm.changeSizeExpression($event, 'width')}}})],1),_vm._v(" "),_c('div',[_vm._v("\n      height\n      "),_c('expression-input',{attrs:{"canvasState":_vm.canvasState,"literal":_vm.canvasState.selection.template.height,"literalType":"number","expression":_vm.canvasState.selection.template.heightExpression,"expressionId":_vm.canvasState.selection.template.heightExpressionId},on:{"change":function($event){return _vm.changeSizeExpression($event, 'height')}}})],1),_vm._v(" "),_c('div',[_vm._v("\n      display\n      "),_c('select',{domProps:{"value":_vm.canvasState.selection.template.display},on:{"change":function($event){return _vm.changeFlex('display', $event.target.value)}}},[_c('option',{domProps:{"value":undefined}}),_vm._v(" "),_c('option',{attrs:{"value":"flex"}},[_vm._v("flex")])])]),_vm._v(" "),_c('div',[_vm._v("\n      flex direction\n      "),_c('select',{domProps:{"value":_vm.canvasState.selection.template.flexDirection},on:{"change":function($event){return _vm.changeFlex('flexDirection', $event.target.value)}}},[_c('option',{attrs:{"value":"row"}},[_vm._v("row")]),_vm._v(" "),_c('option',{attrs:{"value":"column"}},[_vm._v("column")])])]),_vm._v(" "),_c('div',[_vm._v("\n      justify content\n      "),_c('select',{domProps:{"value":_vm.canvasState.selection.template.justifyContent},on:{"change":function($event){return _vm.changeFlex('justifyContent', $event.target.value)}}},[_c('option',{attrs:{"value":"start"}},[_vm._v("start")]),_vm._v(" "),_c('option',{attrs:{"value":"end"}},[_vm._v("end")]),_vm._v(" "),_c('option',{attrs:{"value":"center"}},[_vm._v("center")]),_vm._v(" "),_c('option',{attrs:{"value":"between"}},[_vm._v("between")])])]),_vm._v(" "),_c('div',[_vm._v("\n      align items\n      "),_c('select',{domProps:{"value":_vm.canvasState.selection.template.alignItems},on:{"change":function($event){return _vm.changeFlex('alignItems', $event.target.value)}}},[_c('option',{attrs:{"value":"start"}},[_vm._v("start")]),_vm._v(" "),_c('option',{attrs:{"value":"end"}},[_vm._v("end")]),_vm._v(" "),_c('option',{attrs:{"value":"center"}},[_vm._v("center")])])]),_vm._v(" "),_c('div',[_c('button',{on:{"click":function($event){return _vm.renderToImage()}}},[_vm._v("render to image")]),_vm._v(" "),(_vm.imageUrl)?_c('img',{staticStyle:{"object-fit":"contain","width":"100%"},attrs:{"src":_vm.imageUrl}}):_vm._e()]),_vm._v(" "),_c('div',[_vm._l((_vm.canvasState.selection.template.parameters || []),function(parameter,i){return _c('div',[_vm._v("\n        parameter "+_vm._s(i)+"\n        "),_c('input',{attrs:{"type":"text"},domProps:{"value":parameter},on:{"change":function($event){return _vm.changeParameter($event, i)}}})])}),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.addParameter()}}},[_vm._v("add parameter")])],2)]):_vm._e(),_vm._v(" "),_c('div',[_c('button',{on:{"click":function($event){return _vm.debug()}}},[_vm._v("debug")])]),_vm._v(" "),_c('div',[_c('button',{on:{"click":function($event){return _vm.addTemplate()}}},[_vm._v("add template")]),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.addText()}}},[_vm._v("add text")]),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.addImage()}}},[_vm._v("add image")]),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.addColor()}}},[_vm._v("add color")])])])}
// @ts-ignore
export var templateEditorOperationPanelTemplateHtmlStatic = [  ]
// @ts-ignore
export function templateEditorRenderLayerTemplateHtml(this: RenderLayer) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.canvasStyle)},[_c('div',{style:(_vm.styleGuideStyle)},[_vm._l((_vm.canvasState.styleGuide.templates),function(r){return [_c('div',{style:(_vm.getTemplateStyle(r))},[(r.name)?_c('div',{style:(_vm.getNameStyle(r))},[_vm._v(_vm._s(r.name))]):_vm._e(),_vm._v(" "),_c('template-renderer',{attrs:{"template":r,"templates":_vm.canvasState.styleGuide.templates}})],1)]})],2)])}
// @ts-ignore
export var templateEditorRenderLayerTemplateHtmlStatic = [  ]
// @ts-ignore
export function templateEditorSelectionLayerTemplateHtml(this: SelectionLayer) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.canvasStyle)},[_c('div',{style:(_vm.styleGuideStyle)},[_vm._l((_vm.selectionRegions),function(r){return [_c('div',{style:(_vm.getSelectionAreaStyle(r))})]}),_vm._v(" "),_vm._l((_vm.canResizeRegions),function(r){return [_c('div',{style:(_vm.getResizeStyle(r))},[_vm._l((_vm.resizeRegions),function(r){return [_c('div',{style:(r)})]})],2)]})],2)])}
// @ts-ignore
export var templateEditorSelectionLayerTemplateHtmlStatic = [  ]
// @ts-ignore
export function templateEditorTemplateEditorTemplateHtml(this: TemplateEditor) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticStyle:{"display":"flex"}},[_c('div',{style:(_vm.layerPanelStyle)},[_c('layer-panel',{attrs:{"canvasState":_vm.canvasState}})],1),_vm._v(" "),_c('div',{style:(_vm.canvasStyle)},[_c('render-layer',{attrs:{"canvasState":_vm.canvasState}}),_vm._v(" "),_c('selection-layer',{attrs:{"canvasState":_vm.canvasState}}),_vm._v(" "),_c('hover-layer',{attrs:{"canvasState":_vm.canvasState}}),_vm._v(" "),_c('dragging-for-selection-layer',{attrs:{"canvasState":_vm.canvasState}}),_vm._v(" "),_c('mask-layer',{attrs:{"canvasState":_vm.canvasState}}),_vm._v(" "),_c('context-menu',{attrs:{"canvasState":_vm.canvasState}})],1),_vm._v(" "),_c('div',{style:(_vm.operationPanelStyle)},[_c('operation-panel',{attrs:{"canvasState":_vm.canvasState}})],1)])}
// @ts-ignore
export var templateEditorTemplateEditorTemplateHtmlStatic = [  ]
// @ts-ignore
export function templateModelEditorTemplateHtml(this: TemplateModelEditor) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.appState.templateModelEditorVisible)?_c('div',{style:(_vm.editorStyle)},[_c('json-editor',{attrs:{"schema":_vm.schema,"initial-value":_vm.appState.templateModel},on:{"update-value":function($event){return _vm.updateValue($event)}}})],1):_vm._e()}
// @ts-ignore
export var templateModelEditorTemplateHtmlStatic = [  ]
/* eslint-enable */
// tslint:enable
