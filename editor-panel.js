import { __decorate, __extends } from "tslib";
import Vue from 'vue';
import Component from 'vue-class-component';
import { editorPanelTemplateHtml, editorPanelTemplateHtmlStatic } from './variables';
import { styleGuide } from './data';
import { CanvasState } from './canvas-state';
var EditorPanel = /** @class */ (function (_super) {
    __extends(EditorPanel, _super);
    function EditorPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canvasState = CanvasState.create(styleGuide);
        return _this;
    }
    EditorPanel.prototype.changeText = function (e) {
        if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'text') {
            this.canvasState.selection.content.text = e.target.value;
            this.canvasState.changedContents.add(this.canvasState.selection.content);
            this.canvasState.applyChangesIfAuto();
        }
    };
    EditorPanel.prototype.changeImageUrl = function (e) {
        if (this.canvasState.selection.kind === 'content' && this.canvasState.selection.content.kind === 'image') {
            this.canvasState.selection.content.url = e.target.value;
            this.canvasState.changedContents.add(this.canvasState.selection.content);
            this.canvasState.applyChangesIfAuto();
        }
    };
    EditorPanel = __decorate([
        Component({
            render: editorPanelTemplateHtml,
            staticRenderFns: editorPanelTemplateHtmlStatic,
            props: {
                canvasState: CanvasState
            }
        })
    ], EditorPanel);
    return EditorPanel;
}(Vue));
export { EditorPanel };
