var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from "react";
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { hasError: false };
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function (error) {
        return { hasError: true, error: error };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        console.warn("ErrorBoundary caught an error:", error, errorInfo);
    };
    ErrorBoundary.prototype.render = function () {
        var _this = this;
        if (this.state.hasError) {
            return (this.props.fallback || (_jsx("div", { style: {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "60vh",
                    color: "white",
                    fontSize: "18px",
                    textAlign: "center",
                    padding: "20px",
                }, children: _jsxs("div", { children: [_jsx("p", { children: "Error al cargar el dado 3D" }), _jsx("p", { style: { fontSize: "14px", opacity: 0.8 }, children: "Tu navegador o dispositivo puede no soportar WebGL" }), _jsx("button", { onClick: function () {
                                return _this.setState({ hasError: false, error: undefined });
                            }, style: {
                                marginTop: "10px",
                                padding: "8px 16px",
                                backgroundColor: "#048FC9",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }, children: "Intentar de nuevo" })] }) })));
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(Component));
export default ErrorBoundary;
