var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Modal, Button, Input, List, Card, Spin } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SettingOutlined, LoadingOutlined, } from "@ant-design/icons";
import "./App.css";
import DiceThreeJS from "./components/DiceThreeJS";
var App = function () {
    var _a = useState([]), questions = _a[0], setQuestions = _a[1];
    var _b = useState(null), randomQuestion = _b[0], setRandomQuestion = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(""), newQuestion = _d[0], setNewQuestion = _d[1];
    var _e = useState(""), newAnswer = _e[0], setNewAnswer = _e[1];
    var _f = useState(false), isConfigModalVisible = _f[0], setIsConfigModalVisible = _f[1];
    var _g = useState(false), isEditModalVisible = _g[0], setIsEditModalVisible = _g[1];
    var _h = useState(null), editIndex = _h[0], setEditIndex = _h[1];
    var _j = useState(false), showCard = _j[0], setShowCard = _j[1];
    var _k = useState(false), isInitialModalVisible = _k[0], setIsInitialModalVisible = _k[1]; // Modal inicial
    var _l = useState(false), showAnswer = _l[0], setShowAnswer = _l[1]; // Para mostrar respuesta de pregunta
    var _m = useState(true), isPlayerModalVisible = _m[0], setIsPlayerModalVisible = _m[1]; // Modal para seleccionar cantidad de jugadores - inicia abierto
    var _o = useState(2), numPlayers = _o[0], setNumPlayers = _o[1];
    // Estados para el dado
    var _p = useState(false), showDice = _p[0], setShowDice = _p[1];
    var diceFaces = useState(["1", "2", "3", "4", "Hable", "Alto"])[0];
    // Colores para las fichas de los jugadores - modificados para contraste con azul
    var PLAYER_COLORS = ["#FF5733", "#FFD700", "#2ECC71", "#E74C3C"];
    var TOKEN_RADIUS = 28; // px
    // Define las variables como un objeto
    var customIndicator = (_jsx(LoadingOutlined, { spin: true, style: { fontSize: "48px", color: "#0047ab" } }));
    var buttonStyles = {
        "--button-bg-color": "#4bacd6", // Amarillo dorado para el botón
        "--button-color": "#f5f5f5", // Texto negro para mejor contraste con amarillo
        "--button-border-color": "#f5f5f5",
        "--button-border": "4px solid #f5f5f5",
        "--button-box-shadow": "0px 4px 10px rgba(0, 0, 0, 0.2)",
    };
    var _q = useState([]), players = _q[0], setPlayers = _q[1];
    var _r = useState(null), draggedPlayerId = _r[0], setDraggedPlayerId = _r[1];
    var _s = useState({
        x: 0,
        y: 0,
    }), dragOffset = _s[0], setDragOffset = _s[1];
    // cargar preguntas desde el servidor
    useEffect(function () {
        var loadQuestions = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, data, savedQuestions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/questions.json")];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        savedQuestions = JSON.parse(localStorage.getItem("questions") || "null");
                        if (savedQuestions) {
                            setQuestions(savedQuestions);
                        }
                        else {
                            setQuestions(data);
                            localStorage.setItem("questions", JSON.stringify(data));
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        loadQuestions();
    }, []);
    // obtener una pregunta aleatoria sin repetir
    var getRandomQuestion = function () {
        setShowAnswer(false);
        setShowCard(false);
        setLoading(true);
        if (questions.length === 0) {
            setRandomQuestion(null);
            return;
        }
        var randomIndex = Math.floor(Math.random() * questions.length);
        var selectedQuestion = questions[randomIndex];
        //Eliminar del Array de preguntas
        var remainingQuestions = questions.filter(function (_, index) { return index !== randomIndex; });
        setQuestions(remainingQuestions);
        setRandomQuestion(selectedQuestion);
        setTimeout(function () {
            setLoading(false);
            setShowCard(true);
        }, 1000);
    };
    // guardar preguntas en el navegador
    var saveQuestions = function () {
        localStorage.setItem("questions", JSON.stringify(questions));
    };
    // actualizar pregunta
    var updateQuestion = function () {
        if (newQuestion.trim() !== "" &&
            newAnswer.trim() !== "" &&
            editIndex !== null) {
            var updatedQuestions = __spreadArray([], questions, true);
            updatedQuestions[editIndex] = {
                question: newQuestion,
                answer: newAnswer,
            };
            setQuestions(updatedQuestions);
            setNewQuestion("");
            setNewAnswer("");
            setEditIndex(null);
            setIsEditModalVisible(false);
            saveQuestions();
        }
    };
    // eliminar pregunta
    var deleteQuestion = function (index) {
        var updatedQuestions = questions.filter(function (_, i) { return i !== index; });
        setQuestions(updatedQuestions);
        saveQuestions();
    };
    // agregar nueva pregunta
    var addNewQuestion = function () {
        if (newQuestion.trim() !== "" && newAnswer.trim() !== "") {
            var updatedQuestions = __spreadArray(__spreadArray([], questions, true), [
                { question: newQuestion, answer: newAnswer },
            ], false);
            setQuestions(updatedQuestions);
            setNewQuestion("");
            setNewAnswer("");
            saveQuestions();
        }
    };
    // resetear preguntas
    var resetQuestions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localStorage.removeItem("questions");
                    return [4 /*yield*/, fetch("/questions.json")];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setQuestions(data);
                    localStorage.setItem("questions", JSON.stringify(data));
                    return [2 /*return*/];
            }
        });
    }); };
    // Opción para usar preguntas precargadas
    var usePreloadedQuestions = function () {
        resetQuestions();
        setIsInitialModalVisible(false); // Cierra el modal inicial
    };
    // Opción para empezar desde preguntas vacías
    var createNewQuestions = function () {
        setQuestions([]); // Limpia las preguntas
        localStorage.setItem("questions", JSON.stringify([])); // Actualiza el localStorage
        setIsInitialModalVisible(false); // Cierra el modal inicial
        setIsConfigModalVisible(true);
    };
    //#region Trivia y Preguntas
    // Drag & drop handlers
    var handleMouseDown = function (e, playerId) {
        e.preventDefault();
        setDraggedPlayerId(playerId);
        var player = players.find(function (p) { return p.id === playerId; });
        if (player) {
            setDragOffset({
                x: e.clientX - player.x,
                y: e.clientY - player.y,
            });
        }
        document.body.style.userSelect = "none";
    };
    // Touch handlers para móvil
    var handleTouchStart = function (e, playerId) {
        e.preventDefault();
        var touch = e.touches[0];
        setDraggedPlayerId(playerId);
        var player = players.find(function (p) { return p.id === playerId; });
        if (player) {
            setDragOffset({
                x: touch.clientX - player.x,
                y: touch.clientY - player.y,
            });
        }
        document.body.style.userSelect = "none";
    };
    var handleMouseMove = function (e) {
        if (draggedPlayerId !== null) {
            setPlayers(function (prev) {
                return prev.map(function (p) {
                    return p.id === draggedPlayerId
                        ? __assign(__assign({}, p), { x: Math.max(TOKEN_RADIUS, Math.min(window.innerWidth - TOKEN_RADIUS, e.clientX - dragOffset.x)), y: Math.max(TOKEN_RADIUS, Math.min(window.innerHeight - TOKEN_RADIUS, e.clientY - dragOffset.y)) }) : p;
                });
            });
        }
    };
    var handleTouchMove = function (e) {
        if (draggedPlayerId !== null) {
            e.preventDefault();
            var touch_1 = e.touches[0];
            setPlayers(function (prev) {
                return prev.map(function (p) {
                    return p.id === draggedPlayerId
                        ? __assign(__assign({}, p), { x: Math.max(TOKEN_RADIUS, Math.min(window.innerWidth - TOKEN_RADIUS, touch_1.clientX - dragOffset.x)), y: Math.max(TOKEN_RADIUS, Math.min(window.innerHeight - TOKEN_RADIUS, touch_1.clientY - dragOffset.y)) }) : p;
                });
            });
        }
    };
    var handleMouseUp = function () {
        setDraggedPlayerId(null);
        document.body.style.userSelect = "auto";
    };
    var handleTouchEnd = function () {
        setDraggedPlayerId(null);
        document.body.style.userSelect = "auto";
    };
    useEffect(function () {
        if (draggedPlayerId !== null) {
            // Mouse events
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            // Touch events
            window.addEventListener("touchmove", handleTouchMove, { passive: false });
            window.addEventListener("touchend", handleTouchEnd);
            return function () {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
                window.removeEventListener("touchmove", handleTouchMove);
                window.removeEventListener("touchend", handleTouchEnd);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draggedPlayerId]);
    // Función para recalcular posiciones seguras
    var calculateSafePositions = function () {
        var boardW = window.innerWidth;
        var boardH = window.innerHeight;
        var isMobile = boardW <= 768;
        var safeMarginX = isMobile ? 100 : 150;
        var safeMarginY = isMobile ? 80 : 100;
        return [
            { x: safeMarginX, y: safeMarginY },
            { x: boardW - safeMarginX, y: safeMarginY },
            { x: safeMarginX, y: boardH - safeMarginY },
            { x: boardW - safeMarginX, y: boardH - safeMarginY },
        ];
    };
    // Inicializar jugadores cuando se selecciona la cantidad
    useEffect(function () {
        if (!isPlayerModalVisible) {
            var positions_1 = calculateSafePositions();
            setPlayers(Array.from({ length: numPlayers }).map(function (_, i) { return ({
                id: i,
                color: PLAYER_COLORS[i],
                x: positions_1[i].x,
                y: positions_1[i].y,
            }); }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlayerModalVisible, numPlayers]);
    // Reposicionar fichas al redimensionar la ventana
    useEffect(function () {
        var handleResize = function () {
            if (!isPlayerModalVisible && players.length > 0) {
                var positions_2 = calculateSafePositions();
                setPlayers(function (prev) {
                    return prev.map(function (player, i) {
                        var _a, _b;
                        return (__assign(__assign({}, player), { x: ((_a = positions_2[i]) === null || _a === void 0 ? void 0 : _a.x) || player.x, y: ((_b = positions_2[i]) === null || _b === void 0 ? void 0 : _b.y) || player.y }));
                    });
                });
            }
        };
        window.addEventListener("resize", handleResize);
        return function () { return window.removeEventListener("resize", handleResize); };
    }, [isPlayerModalVisible, players.length]);
    return (_jsxs("div", { className: "container", style: {
            padding: "20px",
            position: "relative",
            width: "100%",
            height: "100vh",
            overflow: "hidden",
            zIndex: 2,
        }, children: [_jsxs(Modal, { className: "modalpregunta", title: "Selecciona una opci\u00F3n", open: isInitialModalVisible, footer: null, closable: false, children: [_jsx(Button, { type: "primary", onClick: usePreloadedQuestions, style: { width: "100%", marginBottom: "10px", minHeight: "50px" }, children: "Preguntas RCP" }), _jsx(Button, { type: "default", onClick: createNewQuestions, style: { width: "100%", minHeight: "50px" }, children: "Crear Mis Propias Preguntas" })] }), randomQuestion === null && loading && _jsx("h2", { children: "No hay m\u00E1s preguntas" }), loading && randomQuestion !== null && (_jsx("div", { className: "flex justify-center items-center", style: { margin: "25px", padding: "25px" }, children: _jsx(Spin, { indicator: customIndicator }) })), randomQuestion && !loading && showCard && (_jsx("div", { style: {
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100vh",
                    zIndex: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }, children: _jsxs(Card, { className: "fade-in cartapregunta", bordered: false, style: {
                        position: "relative",
                        minWidth: 320,
                        maxWidth: 420,
                        width: "90vw",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    }, bodyStyle: { paddingTop: 48 }, children: [_jsx(Button, { type: "text", onClick: function () { return setShowCard(false); }, style: {
                                position: "absolute",
                                top: 8,
                                right: 8,
                                zIndex: 101,
                                fontSize: 20,
                            }, children: "\u2715" }), _jsx("h2", { style: { fontSize: "1.9rem", fontWeight: "bold" }, children: randomQuestion.question }), !showAnswer && (_jsx(Button, { style: {
                                marginTop: "10px",
                                backgroundColor: "#2b2926",
                                color: "white",
                                borderColor: "#2b2926",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                            }, onClick: function () { return setShowAnswer(true); }, children: "Ver Respuesta" })), showAnswer && (_jsx("p", { style: {
                                marginTop: "10px",
                                color: "#4bacd9",
                                fontSize: "1.6rem",
                                fontWeight: "semibold",
                            }, children: randomQuestion.answer }))] }) })), " ", _jsx("div", { style: {
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                    position: "relative",
                    zIndex: 50,
                }, children: _jsx(Button, { type: "default", className: "custom-button", onClick: getRandomQuestion, style: __assign({ minHeight: "50px", width: "220px", fontSize: "16px", fontWeight: "bold" }, buttonStyles), children: "OBTENER PREGUNTA" }) }), " ", _jsx(Button, { type: "default", onClick: function () { return setShowDice(true); }, className: "dice-button", style: __assign({ position: "absolute", top: "20px", left: "20px", width: "60px", height: "60px", borderRadius: "12px", fontSize: "24px", display: "flex", alignItems: "center", justifyContent: "center" }, buttonStyles), title: showDice ? "Cerrar dado" : "Activar dado", children: "\uD83C\uDFB2" }), " ", _jsx(Button, { type: "default", icon: _jsx(SettingOutlined, {}), onClick: function () { return setIsConfigModalVisible(true); }, className: "settings-button", style: {
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    width: "50px",
                    height: "50px",
                    borderRadius: "8px",
                }, title: "Configurar preguntas" }), _jsxs(Modal, { title: "Configurar Preguntas", open: isConfigModalVisible, onCancel: function () { return setIsConfigModalVisible(false); }, footer: null, children: [_jsx("h3", { children: "Agregar Nueva Pregunta" }), _jsx(Input, { placeholder: "Escribe una nueva pregunta", value: newQuestion, onChange: function (e) { return setNewQuestion(e.target.value); }, style: { marginBottom: "10px" } }), _jsx(Input, { placeholder: "Escribe la respuesta", value: newAnswer, onChange: function (e) { return setNewAnswer(e.target.value); }, style: { marginBottom: "10px" } }), _jsx(Button, { type: "primary", icon: _jsx(PlusOutlined, {}), onClick: addNewQuestion, style: { marginTop: "10px", minHeight: "50px" }, children: "Agregar Pregunta" }), _jsx("h3", { style: { marginTop: "20px" }, children: "Listado de Preguntas" }), _jsx(List, { dataSource: questions, renderItem: function (item, index) { return (_jsx(List.Item, { actions: [
                                _jsx(Button, { type: "link", icon: _jsx(EditOutlined, {}), onClick: function () {
                                        setEditIndex(index);
                                        setNewQuestion(item.question);
                                        setNewAnswer(item.answer || "");
                                        setIsEditModalVisible(true);
                                    }, children: "Editar" }),
                                _jsx(Button, { style: { minHeight: "50px" }, type: "link", icon: _jsx(DeleteOutlined, {}), danger: true, onClick: function () { return deleteQuestion(index); }, children: "Eliminar" }),
                            ], children: item.question })); } }), _jsx(Button, { type: "default", danger: true, style: { marginTop: "20px", minHeight: "50px" }, onClick: resetQuestions, children: "Restaurar Preguntas Predeterminadas" })] }), _jsxs(Modal, { title: "Editar Pregunta", open: isEditModalVisible, onCancel: function () { return setIsEditModalVisible(false); }, onOk: updateQuestion, okText: "Guardar", cancelText: "Cancelar", children: [_jsx(Input, { placeholder: "Edita la pregunta", value: newQuestion, onChange: function (e) { return setNewQuestion(e.target.value); } }), _jsx(Input, { placeholder: "Edita la respuesta", value: newAnswer, onChange: function (e) { return setNewAnswer(e.target.value); } })] }), _jsxs(Modal, { title: "Selecciona la cantidad de jugadores", open: isPlayerModalVisible, footer: null, closable: false, centered: true, children: [_jsx("div", { style: { display: "flex", justifyContent: "center", gap: 16 }, children: [2, 3].map(function (n) { return (_jsx(Button, { type: numPlayers === n ? "primary" : "default", onClick: function () { return setNumPlayers(n); }, style: {
                                width: 60,
                                height: 60,
                                fontSize: 24,
                                borderRadius: "50%",
                            }, children: n }, n)); }) }), _jsx(Button, { type: "primary", style: {
                            marginTop: 24,
                            width: "100%",
                            minHeight: "50px",
                            borderRadius: 8,
                        }, onClick: function () { return setIsPlayerModalVisible(false); }, children: "Comenzar" })] }), " ", players.map(function (player) { return (_jsx("div", { className: "player-token", onMouseDown: function (e) { return handleMouseDown(e, player.id); }, onTouchStart: function (e) { return handleTouchStart(e, player.id); }, style: {
                    position: "absolute",
                    left: player.x - TOKEN_RADIUS,
                    top: player.y - TOKEN_RADIUS,
                    width: TOKEN_RADIUS * 2,
                    height: TOKEN_RADIUS * 2,
                    borderRadius: "50%",
                    background: player.color,
                    border: "3px solid #fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    cursor: "grab",
                    zIndex: 10,
                    display: isPlayerModalVisible ? "none" : "block",
                    transition: draggedPlayerId === player.id ? "none" : "box-shadow 0.2s",
                    touchAction: "none", // Prevenir scroll en móvil durante drag
                }, children: _jsxs("span", { style: {
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 22,
                        lineHeight: "".concat(TOKEN_RADIUS * 2, "px"),
                        textAlign: "center",
                        width: "100%",
                        display: "block",
                        userSelect: "none",
                    }, children: [player.id + 1, " "] }) }, player.id)); }), " ", showDice && (_jsxs("div", { style: {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    backgroundColor: "transparent",
                    zIndex: 200,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                }, children: [_jsx(Button, { onClick: function () { return setShowDice(false); }, style: __assign({ position: "absolute", top: 20, right: 20, zIndex: 210, fontSize: 18, pointerEvents: "auto" }, buttonStyles), children: "\u2715 Cerrar" }), _jsx("div", { style: {
                            width: "100%",
                            height: "100%",
                            pointerEvents: "auto",
                        }, children: _jsx(DiceThreeJS, { showDice: showDice, diceFaces: diceFaces }) })] }))] }));
};
export default App;
