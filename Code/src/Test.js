// var __reflect = (this && this.__reflect) || function(p, c, t) {
//     p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
// };
// var __extends = this && this.__extends || function __extends(t, e) {
//     function r() {
//         this.constructor = t;
//     }
//     for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
//     r.prototype = e.prototype, t.prototype = new r();
// };
// var Test = (function() {
//     function Test() {}
//     Test.Test = function(code) {
//         console.log("Begin Test");
//         var p = new dmt.CodeParser(code);
//         var h = new dmt.CodeHandle(window);
//         //  let val = h.Express(p.tk);
//         //  console.log(p.tk);
//         var val = h.Run(p.tk);
//         console.log("End Test");
//         console.log(h.globalCode);
//         // let ts = p.tk.tks.filter((fi) => {
//         //     return fi.type == 17;
//         // });
//         // console.log(ts.map((fi) => {
//         //     return fi.tks;
//         // }));
//         return val;
//     };
//     return Test;
// }());
// __reflect(Test.prototype, "Test");
// window["__reflect"] = function(p, c, t) {
//     console.log(p);
// };
// var TestExtend = (function() {
//     function TestExtend() {
//         this.id = "TestExtend";
//         console.log("TestExtend constructor");
//     }
//     TestExtend.prototype.Set = function(id) {
//         console.log("TestExtend Set", id);
//     };
//     TestExtend.StaticSet = function(id) {
//         console.log("TestExtend StaticSet", id);
//     };
//     Object.defineProperty(TestExtend.prototype, "val", {
//         get: function() {
//             return "1";
//         },
//         set: function(v) {},
//         enumerable: true,
//         configurable: true
//     });
//     Object.defineProperty(TestExtend, "staticVal", {
//         get: function() {
//             return "1";
//         },
//         set: function(v) {},
//         enumerable: true,
//         configurable: true
//     });
//     return TestExtend;
// }());
// __reflect(TestExtend.prototype, "TestExtend");
// var TestExtend1 = (function(_super) {
//     __extends(TestExtend1, _super);

//     function TestExtend1() {
//         var _this = _super.call(this) || this;
//         console.log("TestExtend1 constructor");
//         return _this;
//     }
//     return TestExtend1;
// }(TestExtend));
// __reflect(TestExtend1.prototype, "TestExtend1");
// var TestExtend2 = (function(_super) {
//     __extends(TestExtend2, _super);

//     function TestExtend2() {
//         var _this = _super.call(this) || this;
//         console.log("TestExtend2 constructor");
//         return _this;
//     }
//     return TestExtend2;
// }(TestExtend1));
// __reflect(TestExtend2.prototype, "TestExtend2");
// var TestExtend3 = (function() {
//     return function() {
//         console.log("TestExtend3 constructor");
//     };
// })();
// TestExtend3.prototype.Set = function(id) {
//     console.log(id);
// };
// TestExtend3.prototype.StaticSet = function(id) {
//     console.log(id);
// };
// window["__reflect"] = null;
// //# sourceMappingURL=Test.js.map