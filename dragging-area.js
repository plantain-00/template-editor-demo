import { __decorate, __extends } from "tslib";
import Vue from 'vue';
import Component from 'vue-class-component';
import { CanvasState } from './canvas-state';
import { draggingAreaTemplateHtml, draggingAreaTemplateHtmlStatic } from './variables';
var DraggingArea = /** @class */ (function (_super) {
    __extends(DraggingArea, _super);
    function DraggingArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DraggingArea.prototype, "draggingAreaStyle", {
        get: function () {
            return {
                position: 'absolute',
                border: '1px dashed black',
                left: Math.min(this.canvasState.mousedownX, this.canvasState.mouseupX) + 'px',
                top: Math.min(this.canvasState.mousedownY, this.canvasState.mouseupY) + 'px',
                width: Math.abs(this.canvasState.mousedownX - this.canvasState.mouseupX) + 'px',
                height: Math.abs(this.canvasState.mousedownY - this.canvasState.mouseupY) + 'px',
            };
        },
        enumerable: true,
        configurable: true
    });
    DraggingArea = __decorate([
        Component({
            render: draggingAreaTemplateHtml,
            staticRenderFns: draggingAreaTemplateHtmlStatic,
            props: {
                canvasState: CanvasState
            }
        })
    ], DraggingArea);
    return DraggingArea;
}(Vue));
export { DraggingArea };
