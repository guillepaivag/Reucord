(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6991010c"],{"3a5e":function(t,e,s){"use strict";var r=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"text-center",staticStyle:{"margin-top":"40vh"}},[s("b-spinner",{attrs:{variant:"primary",label:"Text Centered"}})],1)},a=[],n={name:"loading"},c=n,o=s("2877"),i=Object(o["a"])(c,r,a,!1,null,null,null);e["a"]=i.exports},"3fb9":function(t,e,s){"use strict";var r=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},a=[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"posicion"},[s("h2",[t._v("HUBO UN PROBLEMA...")])])}],n={name:"errores",props:{codigo:String,titulo:String,mensaje:String,direccionPrincipal:String}},c=n,o=(s("6e65"),s("2877")),i=Object(o["a"])(c,r,a,!1,null,"41481506",null);e["a"]=i.exports},"6e65":function(t,e,s){"use strict";s("73d1")},"73d1":function(t,e,s){},8202:function(t,e,s){"use strict";var r=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},a=[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"container mt-5"},[s("hr"),s("h5",{staticClass:"display-4"},[t._v("Muy pronto")]),s("hr")])}],n={name:"proximamente"},c=n,o=s("2877"),i=Object(o["a"])(c,r,a,!1,null,null,null);e["a"]=i.exports},e066:function(t,e,s){"use strict";s.r(e);var r=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"container"},[t.system.loading?s("div",[s("loading")],1):t.system.error?s("div",[s("error")],1):s("div",{staticClass:"row mt-3"},[s("div",{staticClass:"col-md-9"},[s("button",{staticClass:"btn btn-outline-primary mb-3",attrs:{type:"button"},on:{click:function(e){t.bcVistaGrafica=!t.bcVistaGrafica}}},[t._v(" Cambiar vista ")]),t.bcVistaGrafica?s("div",[s("proximamente")],1):s("div",[s("table",{staticClass:"table table-hover table-responsive-lg"},[t._m(0),s("tbody",[s("tr",{staticClass:"table-secondary"},[s("th",{attrs:{scope:"row"}},[t._v("1")]),s("td",[t._v("Metropol.")]),s("td",[t._v(t._s(t.getBC.metrop[0]))]),s("td",[t._v(t._s(t.getBC.metrop[1]))]),s("td",[t._v(t._s(t.getBC.metrop[2]))]),s("td",[t._v(t._s(t.getBC.metrop[3]))])]),s("tr",{staticClass:"table-secondary"},[s("th",{attrs:{scope:"row"}},[t._v("2")]),s("td",[t._v("Este")]),s("td",[t._v(t._s(t.getBC.este[0]))]),s("td",[t._v(t._s(t.getBC.este[1]))]),s("td",[t._v(t._s(t.getBC.este[2]))]),s("td",[t._v(t._s(t.getBC.este[3]))])]),s("tr",{staticClass:"table-secondary"},[s("th",{attrs:{scope:"row"}},[t._v("3")]),s("td",[t._v("Sur")]),s("td",[t._v(t._s(t.getBC.sur[0]))]),s("td",[t._v(t._s(t.getBC.sur[1]))]),s("td",[t._v(t._s(t.getBC.sur[2]))]),s("td",[t._v(t._s(t.getBC.sur[3]))])]),s("tr",{staticClass:"table-secondary"},[s("th",{attrs:{scope:"row"}},[t._v("4")]),s("td",[t._v("Central")]),s("td",[t._v(t._s(t.getBC.central[0]))]),s("td",[t._v(t._s(t.getBC.central[1]))]),s("td",[t._v(t._s(t.getBC.central[2]))]),s("td",[t._v(t._s(t.getBC.central[3]))])]),s("tr",{staticClass:"table-secondary"},[s("th",{attrs:{scope:"row"}},[t._v("5")]),s("td",[t._v("Norte")]),s("td",[t._v(t._s(t.getBC.norte[0]))]),s("td",[t._v(t._s(t.getBC.norte[1]))]),s("td",[t._v(t._s(t.getBC.norte[2]))]),s("td",[t._v(t._s(t.getBC.norte[3]))])])])])])]),s("div",{staticClass:"col-md-3"})])])},a=[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("thead",[s("tr",[s("th",{attrs:{scope:"col"}},[t._v("Item")]),s("th",{attrs:{scope:"col"}},[t._v("Sistema")]),s("th",{attrs:{scope:"col"}},[t._v("BC-01")]),s("th",{attrs:{scope:"col"}},[t._v("BC-02")]),s("th",{attrs:{scope:"col"}},[t._v("BC-03")]),s("th",{attrs:{scope:"col"}},[t._v("BC-04")])])])}],n=(s("96cf"),s("1da1")),c=s("5530"),o=s("3a5e"),i=s("3fb9"),l=s("8202"),_=s("2f62"),v={name:"",data:function(){return{bcVistaGrafica:!1,system:{loading:!0,error:!1}}},components:{loading:o["a"],error:i["a"],proximamente:l["a"]},methods:Object(c["a"])({},Object(_["c"])(["setTotal_BC"])),created:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){var s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,t.axios.post("/eq23kvAnalisis/bc/total");case 3:s=e.sent,t.setTotal_BC(s.data),e.next=11;break;case 7:e.prev=7,e.t0=e["catch"](0),t.system.error=!0,console.log(e.t0);case 11:return e.prev=11,t.system.loading=!1,e.finish(11);case 14:case"end":return e.stop()}}),e,null,[[0,7,11,14]])})))()},computed:Object(c["a"])({},Object(_["b"])(["getBC"])),updated:function(){}},d=v,u=s("2877"),p=Object(u["a"])(d,r,a,!1,null,null,null);e["default"]=p.exports}}]);
//# sourceMappingURL=chunk-6991010c.9c0c9549.js.map