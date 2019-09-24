/**
 * This file is generated by 'file2variable-cli'
 * It is not mean to be edited by hand
 */
// tslint:disable
/* eslint-disable */
import { ContextMenu } from "./context-menu"
import { DraggingForSelectionLayer } from "./dragging-for-selection-layer"
import { GenerationResultModal } from "./generation-result-modal"
import { App } from "./index"
import { MaskLayer } from "./mask-layer"
import { OperationPanel } from "./operation-panel"
import { RenderLayer } from "./render-layer"
import { SelectionLayer } from "./selection-layer"
import { TemplateModelEditor } from "./template-model-editor"

// @ts-ignore
export function contextMenuTemplateHtml(this: ContextMenu) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.canvasState.contextMenuEnabled)?_c('div',{on:{"click":_vm.close}},[_c('div',{style:(_vm.maskStyle)}),_vm._v(" "),_c('div',{style:(_vm.contextMenuStyle)},[_c('button',{on:{"click":_vm.remove}},[_vm._v("remove")])])]):_vm._e()}
// @ts-ignore
export var contextMenuTemplateHtmlStatic = [  ]
// @ts-ignore
export function draggingForSelectionLayerTemplateHtml(this: DraggingForSelectionLayer) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.canvasState.isDraggingForSelection)?_c('div',{style:(_vm.draggingAreaStyle)}):_vm._e()}
// @ts-ignore
export var draggingForSelectionLayerTemplateHtmlStatic = [  ]
// @ts-ignore
export function generationResultModalTemplateHtml(this: GenerationResultModal) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{domProps:{"innerHTML":_vm._s(_vm.result)},on:{"click":function($event){return _vm.clear()}}})])}
// @ts-ignore
export var generationResultModalTemplateHtmlStatic = [  ]
// @ts-ignore
export function indexTemplateHtml(this: App) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticStyle:{"margin-left":"210px","margin-top":"10px","position":"absolute"}},[_c('render-layer',{attrs:{"canvasState":_vm.canvasState}}),_vm._v(" "),_c('selection-layer',{attrs:{"canvasState":_vm.canvasState}}),_vm._v(" "),_c('dragging-for-selection-layer',{attrs:{"canvasState":_vm.canvasState}}),_vm._v(" "),_c('mask-layer',{attrs:{"canvasState":_vm.canvasState}}),_vm._v(" "),_c('context-menu',{attrs:{"canvasState":_vm.canvasState}})],1),_vm._v(" "),_c('operation-panel',{attrs:{"canvasState":_vm.canvasState}}),_vm._v(" "),_c('generation-result-modal',{attrs:{"canvasState":_vm.canvasState}}),_vm._v(" "),_c('template-model-editor',{attrs:{"canvasState":_vm.canvasState}})],1)}
// @ts-ignore
export var indexTemplateHtmlStatic = [  ]
// @ts-ignore
export function maskLayerTemplateHtml(this: MaskLayer) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.maskStyle),attrs:{"tabindex":"0"},on:{"wheel":_vm.wheel,"mousedown":_vm.mousedown,"mouseup":_vm.mouseup,"mousemove":_vm.mousemove,"contextmenu":_vm.contextmenu,"keypress":_vm.keypress}})}
// @ts-ignore
export var maskLayerTemplateHtmlStatic = [  ]
// @ts-ignore
export function operationPanelTemplateHtml(this: OperationPanel) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(_vm.canvasState.selection.kind === 'content')?_c('div',[(_vm.canvasState.selection.content.kind === 'text')?_c('div',[_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.text},on:{"change":_vm.changeText}}),_vm._v(" "),_c('br'),_vm._v(" "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.textExpression},on:{"change":_vm.changeTextExpression}}),_vm._v(" "),_c('br'),_vm._v(" "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.fontFamily},on:{"change":_vm.changeFontFamily}}),_vm._v(" "),_c('br'),_vm._v(" "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.content.fontSize},on:{"change":_vm.changeFontSize}}),_vm._v(" "),_c('br'),_vm._v(" "),_c('input',{attrs:{"type":"color"},domProps:{"value":_vm.canvasState.selection.content.color},on:{"change":_vm.changeColor}})]):_vm._e(),_vm._v(" "),(_vm.canvasState.selection.content.kind === 'image')?_c('div',[_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.url},on:{"change":_vm.changeImageUrl}})]):_vm._e(),_vm._v(" "),_c('div',[_vm._v("\n      x\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.content.x},on:{"change":_vm.changeX}})]),_vm._v(" "),_c('div',[_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.xExpression},on:{"change":_vm.changeXExpression}})]),_vm._v(" "),_c('div',[_vm._v("\n      y\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.content.y},on:{"change":_vm.changeY}})]),_vm._v(" "),_c('div',[_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.yExpression},on:{"change":_vm.changeYExpression}})]),_vm._v(" "),_c('div',[_vm._v("\n      width\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.content.width},on:{"change":_vm.changeWidth}})]),_vm._v(" "),_c('div',[_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.widthExpression},on:{"change":_vm.changeWidthExpression}})]),_vm._v(" "),_c('div',[_vm._v("\n      height\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.content.height},on:{"change":_vm.changeHeight}})]),_vm._v(" "),_c('div',[_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.heightExpression},on:{"change":_vm.changeHeightExpression}})]),_vm._v(" "),_c('div',[_vm._v("\n      hidden\n      "),_c('input',{attrs:{"type":"checkbox"},domProps:{"checked":_vm.canvasState.selection.content.hidden},on:{"change":_vm.changeHidden}})]),_vm._v(" "),_c('div',[_vm._v("\n      if\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.if},on:{"change":_vm.changeIf}})]),_vm._v(" "),_c('div',[_vm._v("\n      repeat\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.repeat},on:{"change":_vm.changeRepeat}})]),_vm._v(" "),_c('div',[_vm._v("\n      props\n      "),_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.content.props},on:{"change":_vm.changeProps}})])]):_vm._e(),_vm._v(" "),(_vm.canvasState.selection.kind === 'template')?_c('div',[_c('div',[_vm._v("\n      x\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.template.x},on:{"change":_vm.changeX}})]),_vm._v(" "),_c('div',[_vm._v("\n      y\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.template.y},on:{"change":_vm.changeY}})]),_vm._v(" "),_c('div',[_vm._v("\n      width\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.template.width},on:{"change":_vm.changeWidth}})]),_vm._v(" "),_c('div',[_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.template.widthExpression},on:{"change":_vm.changeWidthExpression}})]),_vm._v(" "),_c('div',[_vm._v("\n      height\n      "),_c('input',{attrs:{"type":"number"},domProps:{"value":_vm.canvasState.selection.template.height},on:{"change":_vm.changeHeight}})]),_vm._v(" "),_c('div',[_c('input',{attrs:{"type":"text"},domProps:{"value":_vm.canvasState.selection.template.heightExpression},on:{"change":_vm.changeHeightExpression}})])]):_vm._e(),_vm._v(" "),_c('div',[_c('button',{on:{"click":function($event){return _vm.canvasState.applyChanges()}}},[_vm._v("apply changes")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.canvasState.auto),expression:"canvasState.auto"}],attrs:{"type":"checkbox"},domProps:{"checked":Array.isArray(_vm.canvasState.auto)?_vm._i(_vm.canvasState.auto,null)>-1:(_vm.canvasState.auto)},on:{"change":function($event){var $$a=_vm.canvasState.auto,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.$set(_vm.canvasState, "auto", $$a.concat([$$v])))}else{$$i>-1&&(_vm.$set(_vm.canvasState, "auto", $$a.slice(0,$$i).concat($$a.slice($$i+1))))}}else{_vm.$set(_vm.canvasState, "auto", $$c)}}}}),_vm._v("\n    auto\n    "),_c('button',{on:{"click":function($event){return _vm.debug()}}},[_vm._v("debug")])]),_vm._v(" "),_c('div',[_c('button',{on:{"click":function($event){return _vm.addTemplate()}}},[_vm._v("add template")]),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.addText()}}},[_vm._v("add text")]),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.addImage()}}},[_vm._v("add image")])]),_vm._v(" "),_c('div',[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.styleGuideKey),expression:"styleGuideKey"}],attrs:{"type":"text"},domProps:{"value":(_vm.styleGuideKey)},on:{"input":function($event){if($event.target.composing){ return; }_vm.styleGuideKey=$event.target.value}}}),_vm._v(" "),_c('br'),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.loadStyleGuide()}}},[_vm._v("load style guide")]),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.saveStyleGuide()}}},[_vm._v("save style guide")])]),_vm._v(" "),_c('div',[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.templateModelKey),expression:"templateModelKey"}],attrs:{"type":"text"},domProps:{"value":(_vm.templateModelKey)},on:{"input":function($event){if($event.target.composing){ return; }_vm.templateModelKey=$event.target.value}}}),_vm._v(" "),_c('br'),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.loadTemplateModel()}}},[_vm._v("load template model")]),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.saveTemplateModel()}}},[_vm._v("save template model")])]),_vm._v(" "),_c('div',[_c('button',{on:{"click":function($event){return _vm.editTemplateModel()}}},[_vm._v("edit template model")])]),_vm._v(" "),_c('div',[_c('button',{on:{"click":function($event){return _vm.generate()}}},[_vm._v("generate")])])])}
// @ts-ignore
export var operationPanelTemplateHtmlStatic = [  ]
// @ts-ignore
export function renderLayerTemplateHtml(this: RenderLayer) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.canvasStyle)},[_c('div',{style:(_vm.styleGuideStyle)},[_vm._l((_vm.canvasState.renderResults),function(r){return [_c('div',{style:({ left: r.x + 'px', top: r.y + 'px', position: 'absolute' })},[_c('div',{domProps:{"innerHTML":_vm._s(r.html)}})])]})],2)])}
// @ts-ignore
export var renderLayerTemplateHtmlStatic = [  ]
// @ts-ignore
export function selectionLayerTemplateHtml(this: SelectionLayer) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.canvasStyle)},[_c('div',{style:(_vm.styleGuideStyle)},[_vm._l((_vm.selectionAreas),function(r){return [_c('div',{style:(_vm.getSelectionAreaStyle(r))})]})],2)])}
// @ts-ignore
export var selectionLayerTemplateHtmlStatic = [  ]
// @ts-ignore
export function templateModelEditorTemplateHtml(this: TemplateModelEditor) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.canvasState.templateModelEditorVisible)?_c('div',{style:(_vm.editorStyle)},[_c('json-editor',{attrs:{"schema":_vm.schema,"initial-value":_vm.canvasState.templateModel},on:{"update-value":function($event){return _vm.updateValue($event)}}})],1):_vm._e()}
// @ts-ignore
export var templateModelEditorTemplateHtmlStatic = [  ]
/* eslint-enable */
// tslint:enable
