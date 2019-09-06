import { __decorate, __extends, __read, __spread, __values } from "tslib";
import Vue from 'vue';
import Component from 'vue-class-component';
import { renderTemplate } from './renderer';
var CanvasState = /** @class */ (function (_super) {
    __extends(CanvasState, _super);
    function CanvasState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.styleGuide = {
            name: '',
            templates: []
        };
        _this.renderResults = [];
        _this.auto = true;
        _this.styleGuideTranslateX = 0;
        _this.styleGuideTranslateY = 0;
        _this.styleGuideScale = 1;
        _this.canvasWidth = 1200;
        _this.canvasHeight = 400;
        _this.selection = {
            kind: 'none'
        };
        _this.changedContents = new Set();
        _this.mousedownX = 0;
        _this.mousedownY = 0;
        _this.mouseupX = 0;
        _this.mouseupY = 0;
        _this.mousePressing = false;
        return _this;
    }
    CanvasState_1 = CanvasState;
    CanvasState.create = function (styleGuide) {
        var canvasState = new CanvasState_1();
        canvasState.styleGuide = styleGuide;
        canvasState.styleGuideScale = Math.min(canvasState.canvasWidth / canvasState.styleGuideWidth, canvasState.canvasHeight / canvasState.styleGuideHeight);
        canvasState.styleGuideTranslateX = (canvasState.canvasWidth - canvasState.styleGuideWidth) * canvasState.styleGuideScale;
        canvasState.styleGuideTranslateY = (canvasState.canvasHeight - canvasState.styleGuideHeight) * canvasState.styleGuideScale;
        canvasState.applyChanges();
        return canvasState;
    };
    CanvasState.prototype.applyChanges = function () {
        var e_1, _a;
        var _this = this;
        try {
            for (var _b = __values(this.changedContents), _c = _b.next(); !_c.done; _c = _b.next()) {
                var content = _c.value;
                if (content.kind === 'text') {
                    content.characters = Array.from(content.text).map(function (t) { return ({ text: t }); });
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
        this.renderResults = this.styleGuide.templates.map(function (t) {
            var selection;
            if (_this.selection.kind === 'template') {
                selection = {
                    kind: 'template',
                    id: _this.selection.template.id
                };
            }
            else if (_this.selection.kind === 'content') {
                var content_1 = _this.selection.content;
                selection = {
                    kind: 'content',
                    id: _this.selection.template.id,
                    index: _this.selection.template.contents.findIndex(function (c) { return c === content_1; })
                };
            }
            return {
                html: renderTemplate(t, _this.styleGuide.templates, true, selection),
                x: t.x,
                y: t.y,
            };
        });
    };
    CanvasState.prototype.applyChangesIfAuto = function () {
        if (this.auto) {
            this.applyChanges();
        }
    };
    Object.defineProperty(CanvasState.prototype, "styleGuideWidth", {
        get: function () {
            return Math.max.apply(Math, __spread(this.styleGuide.templates.map(function (t) { return t.x + t.width; })));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasState.prototype, "styleGuideHeight", {
        get: function () {
            return Math.max.apply(Math, __spread(this.styleGuide.templates.map(function (t) { return t.y + t.height; })));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasState.prototype, "isDragging", {
        get: function () {
            return !equal(this.mouseupX, this.mousedownX) || !(this.mouseupY, this.mousedownY);
        },
        enumerable: true,
        configurable: true
    });
    CanvasState.prototype.mapX = function (x) {
        return (x - ((this.styleGuideTranslateX - this.styleGuideWidth / 2) * this.styleGuideScale + this.styleGuideWidth / 2)) / this.styleGuideScale;
    };
    CanvasState.prototype.mapY = function (y) {
        return (y - ((this.styleGuideTranslateY - this.styleGuideHeight / 2) * this.styleGuideScale + this.styleGuideHeight / 2)) / this.styleGuideScale;
    };
    var CanvasState_1;
    CanvasState = CanvasState_1 = __decorate([
        Component
    ], CanvasState);
    return CanvasState;
}(Vue));
export { CanvasState };
function equal(n1, n2) {
    var diff = n1 - n2;
    return diff < Number.EPSILON && diff > -Number.EPSILON;
}
