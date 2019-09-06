import { __assign, __decorate, __extends, __values } from "tslib";
import Vue from 'vue';
import Component from 'vue-class-component';
import { CanvasState } from './canvas-state';
import { canvasMaskTemplateHtml, canvasMaskTemplateHtmlStatic } from './variables';
var CanvasMask = /** @class */ (function (_super) {
    __extends(CanvasMask, _super);
    function CanvasMask() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CanvasMask.prototype, "maskStyle", {
        get: function () {
            return {
                position: 'absolute',
                width: this.canvasState.canvasWidth + 'px',
                height: this.canvasState.canvasHeight + 'px',
                opacity: 0,
                cursor: this.canvasState.isDragging && this.canvasState.mousePressing ? 'crosshair' : 'auto'
            };
        },
        enumerable: true,
        configurable: true
    });
    CanvasMask.prototype.canvasWheel = function (e) {
        if (e.ctrlKey) {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (e.deltaY > 0) {
                this.canvasState.styleGuideScale *= 0.99;
            }
            else if (e.deltaY < 0) {
                this.canvasState.styleGuideScale *= 1.01;
            }
        }
        else {
            this.canvasState.styleGuideTranslateX -= e.deltaX;
            this.canvasState.styleGuideTranslateY -= e.deltaY;
        }
    };
    CanvasMask.prototype.canvasMousedown = function (e) {
        this.canvasState.mousedownX = e.offsetX;
        this.canvasState.mousedownY = e.offsetY;
        this.canvasState.mouseupX = e.offsetX;
        this.canvasState.mouseupY = e.offsetY;
        this.canvasState.mousePressing = true;
    };
    CanvasMask.prototype.canvasMousemove = function (e) {
        if (this.canvasState.mousePressing) {
            this.canvasState.mouseupX = e.offsetX;
            this.canvasState.mouseupY = e.offsetY;
        }
    };
    CanvasMask.prototype.canvasMouseup = function (e) {
        this.canvasState.mouseupX = e.offsetX;
        this.canvasState.mouseupY = e.offsetY;
        this.canvasState.mousePressing = false;
        var x = this.canvasState.mapX(this.canvasState.mouseupX);
        var y = this.canvasState.mapY(this.canvasState.mouseupY);
        if (this.canvasState.isDragging) {
            var mousedownX = this.canvasState.mapX(this.canvasState.mousedownX);
            var mousedownY = this.canvasState.mapY(this.canvasState.mousedownY);
            var template = selectTemplate(this.canvasState.styleGuide, { x: x, y: y }, { x: mousedownX, y: mousedownY });
            this.canvasState.selection = template ? { kind: 'template', template: template } : { kind: 'none' };
        }
        else {
            var content = selectContent(this.canvasState.styleGuide, { x: x, y: y });
            this.canvasState.selection = content ? __assign({ kind: 'content' }, content) : { kind: 'none' };
        }
        this.canvasState.applyChangesIfAuto();
    };
    CanvasMask = __decorate([
        Component({
            render: canvasMaskTemplateHtml,
            staticRenderFns: canvasMaskTemplateHtmlStatic,
            props: {
                canvasState: CanvasState
            }
        })
    ], CanvasMask);
    return CanvasMask;
}(Vue));
export { CanvasMask };
function selectTemplate(styleGuide, position1, position2) {
    var e_1, _a;
    var region = {
        x: Math.min(position1.x, position2.x),
        y: Math.min(position1.y, position2.y),
        width: Math.abs(position1.x - position2.x),
        height: Math.abs(position1.y - position2.y),
    };
    try {
        for (var _b = __values(styleGuide.templates), _c = _b.next(); !_c.done; _c = _b.next()) {
            var template = _c.value;
            var positions = [
                {
                    x: template.x,
                    y: template.y,
                },
                {
                    x: template.x + template.width,
                    y: template.y + template.height,
                },
            ];
            if (isInRegion(positions, region)) {
                return template;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return null;
}
function selectContent(styleGuide, position) {
    var e_2, _a;
    try {
        for (var _b = __values(styleGuide.templates), _c = _b.next(); !_c.done; _c = _b.next()) {
            var template = _c.value;
            if (isInRegion(position, template)) {
                var templateContent = selectReferenceContent(template, template, position, styleGuide);
                if (templateContent) {
                    return templateContent;
                }
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return null;
}
function selectReferenceContent(template, basePosition, position, styleGuide) {
    var e_3, _a;
    var _loop_1 = function (content) {
        var contentPosition = { x: content.x + basePosition.x, y: content.y + basePosition.y };
        if (content.kind === 'image' || content.kind === 'text') {
            if (isInRegion(position, __assign(__assign({}, contentPosition), { width: content.width, height: content.height }))) {
                return { value: { content: content, template: template } };
            }
        }
        else if (content.kind === 'reference') {
            var reference = styleGuide.templates.find(function (t) { return t.id === content.id; });
            if (reference) {
                var referenceContent = selectReferenceContent(reference, contentPosition, position, styleGuide);
                if (referenceContent) {
                    return { value: referenceContent };
                }
            }
        }
    };
    try {
        for (var _b = __values(template.contents), _c = _b.next(); !_c.done; _c = _b.next()) {
            var content = _c.value;
            var state_1 = _loop_1(content);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return null;
}
function isInRegion(position, region) {
    if (Array.isArray(position)) {
        return position.every(function (p) { return isInRegion(p, region); });
    }
    return position.x >= region.x && position.y >= region.y && position.x <= region.x + region.width && position.y <= region.y + region.height;
}
