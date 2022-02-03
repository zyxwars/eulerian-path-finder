var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function o(e){e.forEach(t)}function l(e){return"function"==typeof e}function r(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function s(e,t){e.appendChild(t)}function i(e,t,n){e.insertBefore(t,n||null)}function c(e){e.parentNode.removeChild(e)}function d(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function u(e){return document.createElement(e)}function a(e){return document.createTextNode(e)}function f(){return a(" ")}function g(e,t,n,o){return e.addEventListener(t,n,o),()=>e.removeEventListener(t,n,o)}function h(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function p(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function $(e,t,n,o){null===n?e.style.removeProperty(t):e.style.setProperty(t,n,o?"important":"")}let m;function b(e){m=e}function v(){if(!m)throw new Error("Function called outside component initialization");return m}function x(){const e=v();return(t,n)=>{const o=e.$$.callbacks[t];if(o){const l=function(e,t,n=!1){const o=document.createEvent("CustomEvent");return o.initCustomEvent(e,n,!1,t),o}(t,n);o.slice().forEach((t=>{t.call(e,l)}))}}}const y=[],k=[],w=[],O=[],_=Promise.resolve();let j=!1;function E(e){w.push(e)}const S=new Set;let z=0;function C(){const e=m;do{for(;z<y.length;){const e=y[z];z++,b(e),I(e.$$)}for(b(null),y.length=0,z=0;k.length;)k.pop()();for(let e=0;e<w.length;e+=1){const t=w[e];S.has(t)||(S.add(t),t())}w.length=0}while(y.length);for(;O.length;)O.pop()();j=!1,S.clear(),b(e)}function I(e){if(null!==e.fragment){e.update(),o(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(E)}}const q=new Set;let L;function M(){L={r:0,c:[],p:L}}function P(){L.r||o(L.c),L=L.p}function A(e,t){e&&e.i&&(q.delete(e),e.i(t))}function B(e,t,n,o){if(e&&e.o){if(q.has(e))return;q.add(e),L.c.push((()=>{q.delete(e),o&&(n&&e.d(1),o())})),e.o(t)}}function D(e){e&&e.c()}function T(e,n,r,s){const{fragment:i,on_mount:c,on_destroy:d,after_update:u}=e.$$;i&&i.m(n,r),s||E((()=>{const n=c.map(t).filter(l);d?d.push(...n):o(n),e.$$.on_mount=[]})),u.forEach(E)}function F(e,t){const n=e.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function N(e,t){-1===e.$$.dirty[0]&&(y.push(e),j||(j=!0,_.then(C)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function H(t,l,r,s,i,d,u,a=[-1]){const f=m;b(t);const g=t.$$={fragment:null,ctx:null,props:d,update:e,not_equal:i,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(l.context||(f?f.$$.context:[])),callbacks:n(),dirty:a,skip_bound:!1,root:l.target||f.$$.root};u&&u(g.root);let h=!1;if(g.ctx=r?r(t,l.props||{},((e,n,...o)=>{const l=o.length?o[0]:n;return g.ctx&&i(g.ctx[e],g.ctx[e]=l)&&(!g.skip_bound&&g.bound[e]&&g.bound[e](l),h&&N(t,e)),n})):[],g.update(),h=!0,o(g.before_update),g.fragment=!!s&&s(g.ctx),l.target){if(l.hydrate){const e=function(e){return Array.from(e.childNodes)}(l.target);g.fragment&&g.fragment.l(e),e.forEach(c)}else g.fragment&&g.fragment.c();l.intro&&A(t.$$.fragment),T(t,l.target,l.anchor,l.customElement),C()}b(f)}class R{$destroy(){F(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function V(t){let n,l,r,d,f=(t[0].solutionOrder?t[0].solutionOrder:t[0].edges.size)+"";return{c(){n=u("div"),l=a(f),h(n,"class","node svelte-182922q"),$(n,"left",t[0].x+"px"),$(n,"top",t[0].y+"px"),$(n,"background-color",t[0].isSelected?"red":t[0].edges.size%2==0?"chartreuse":"yellow"),$(n,"outline-color",t[0].isSelected?"darkred":t[0].edges.size%2==0?"forestgreen":"darkgoldenrod")},m(e,o){var c;i(e,n,o),s(n,l),r||(d=[g(n,"click",t[1]),g(n,"contextmenu",(c=t[2],function(e){return e.preventDefault(),c.call(this,e)})),g(n,"dblclick",t[2])],r=!0)},p(e,[t]){1&t&&f!==(f=(e[0].solutionOrder?e[0].solutionOrder:e[0].edges.size)+"")&&p(l,f),1&t&&$(n,"left",e[0].x+"px"),1&t&&$(n,"top",e[0].y+"px"),1&t&&$(n,"background-color",e[0].isSelected?"red":e[0].edges.size%2==0?"chartreuse":"yellow"),1&t&&$(n,"outline-color",e[0].isSelected?"darkred":e[0].edges.size%2==0?"forestgreen":"darkgoldenrod")},i:e,o:e,d(e){e&&c(n),r=!1,o(d)}}}function X(e,t,n){let{node:o}=t;const l=x();return e.$$set=e=>{"node"in e&&n(0,o=e.node)},[o,()=>{l("node_selected",o)},()=>{l("node_deleted",o)}]}class Y extends R{constructor(e){super(),H(this,e,X,V,r,{node:0})}}function G(t){let n,o,l,r;return{c(){n=u("div"),o=u("div"),h(o,"class","edge svelte-54e2i6"),h(n,"class","edge-area svelte-54e2i6"),$(n,"left",t[0].x+"px"),$(n,"top",t[0].y+"px"),$(n,"width",t[0].width+"px"),$(n,"height",t[0].height+"px"),$(n,"transform","rotate("+t[0].angleDeg+"deg)")},m(e,c){i(e,n,c),s(n,o),l||(r=g(n,"click",t[1]),l=!0)},p(e,[t]){1&t&&$(n,"left",e[0].x+"px"),1&t&&$(n,"top",e[0].y+"px"),1&t&&$(n,"width",e[0].width+"px"),1&t&&$(n,"height",e[0].height+"px"),1&t&&$(n,"transform","rotate("+e[0].angleDeg+"deg)")},i:e,o:e,d(e){e&&c(n),l=!1,r()}}}function J(e,t,n){let{edge:o}=t;const l=x();return e.$$set=e=>{"edge"in e&&n(0,o=e.edge)},[o,()=>{l("edge_deleted",o)}]}class K extends R{constructor(e){super(),H(this,e,J,G,r,{edge:0})}}function Q(t){let n,o,l,r,d,a,p,$,m,b,v,x,y;return{c(){n=u("div"),o=u("div"),l=u("button"),l.textContent="[ESC]",r=f(),d=u("h3"),d.innerHTML='Visual implementation of <a href="https://en.wikipedia.org/wiki/Eulerian_path#Fleury&#39;s_algorithm">Fleury&#39;s algorithm</a>',a=f(),p=u("h3"),p.textContent="Basic controls:",$=f(),m=u("ol"),m.innerHTML="<li>Left click to <strong>create node.</strong></li> \n      <li>Right or double click to <strong>delete node.</strong></li> \n      <li>Select two nodes to <strong>connect</strong> them.</li> \n      <li>Click on an edge to <strong>delete</strong> it.</li>",b=f(),v=u("a"),v.textContent="Source code",h(l,"class","close svelte-5qj3cp"),h(d,"class","svelte-5qj3cp"),h(p,"class","svelte-5qj3cp"),h(v,"href","https://github.com/zyxwars/eulerian-path-finder"),h(v,"class","source svelte-5qj3cp"),h(o,"class","tutorial svelte-5qj3cp"),h(n,"class","wrapper svelte-5qj3cp")},m(e,c){i(e,n,c),s(n,o),s(o,l),s(o,r),s(o,d),s(o,a),s(o,p),s(o,$),s(o,m),s(o,b),s(o,v),x||(y=g(l,"click",t[0]),x=!0)},p:e,i:e,o:e,d(e){e&&c(n),x=!1,y()}}}function U(e){const t=x();return[()=>{t("tutorial_closed")}]}class W extends R{constructor(e){super(),H(this,e,U,Q,r,{})}}function Z(e,t,n){const o=e.slice();return o[19]=t[n],o}function ee(e,t,n){const o=e.slice();return o[22]=t[n],o}function te(t){let n,o;return n=new W({}),n.$on("tutorial_closed",t[9]),{c(){D(n.$$.fragment)},m(e,t){T(n,e,t),o=!0},p:e,i(e){o||(A(n.$$.fragment,e),o=!0)},o(e){B(n.$$.fragment,e),o=!1},d(e){F(n,e)}}}function ne(e){let t,n;return t=new K({props:{edge:e[22]}}),t.$on("edge_deleted",e[8]),{c(){D(t.$$.fragment)},m(e,o){T(t,e,o),n=!0},p(e,n){const o={};2&n&&(o.edge=e[22]),t.$set(o)},i(e){n||(A(t.$$.fragment,e),n=!0)},o(e){B(t.$$.fragment,e),n=!1},d(e){F(t,e)}}}function oe(e){let t,n;return t=new Y({props:{node:e[19]}}),t.$on("node_selected",e[6]),t.$on("node_deleted",e[7]),{c(){D(t.$$.fragment)},m(e,o){T(t,e,o),n=!0},p(e,n){const o={};1&n&&(o.node=e[19]),t.$set(o)},i(e){n||(A(t.$$.fragment,e),n=!0)},o(e){B(t.$$.fragment,e),n=!1},d(e){F(t,e)}}}function le(e){let t,n,l,r,$,m,b,v,x,y,k,w,O,_=e[2]&&te(e),j=e[1],E=[];for(let t=0;t<j.length;t+=1)E[t]=ne(ee(e,j,t));const S=e=>B(E[e],1,1,(()=>{E[e]=null}));let z=Object.values(e[0]),C=[];for(let t=0;t<z.length;t+=1)C[t]=oe(Z(e,z,t));const I=e=>B(C[e],1,1,(()=>{C[e]=null}));return{c(){t=u("main"),_&&_.c(),n=f(),l=u("div"),r=u("h4"),$=a("Is solvable: "),m=a(e[3]),b=f();for(let e=0;e<E.length;e+=1)E[e].c();v=f();for(let e=0;e<C.length;e+=1)C[e].c();x=f(),y=u("button"),y.textContent="Calculate Path",h(r,"class","is-solvable svelte-e0ce7l"),h(l,"class","background svelte-e0ce7l"),h(y,"class","action-btn svelte-e0ce7l"),h(t,"class","svelte-e0ce7l")},m(o,c){i(o,t,c),_&&_.m(t,null),s(t,n),s(t,l),s(l,r),s(r,$),s(r,m),s(t,b);for(let e=0;e<E.length;e+=1)E[e].m(t,null);s(t,v);for(let e=0;e<C.length;e+=1)C[e].m(t,null);s(t,x),s(t,y),k=!0,w||(O=[g(l,"click",e[5]),g(y,"click",e[10])],w=!0)},p(e,[o]){if(e[2]?_?(_.p(e,o),4&o&&A(_,1)):(_=te(e),_.c(),A(_,1),_.m(t,n)):_&&(M(),B(_,1,1,(()=>{_=null})),P()),(!k||8&o)&&p(m,e[3]),258&o){let n;for(j=e[1],n=0;n<j.length;n+=1){const l=ee(e,j,n);E[n]?(E[n].p(l,o),A(E[n],1)):(E[n]=ne(l),E[n].c(),A(E[n],1),E[n].m(t,v))}for(M(),n=j.length;n<E.length;n+=1)S(n);P()}if(193&o){let n;for(z=Object.values(e[0]),n=0;n<z.length;n+=1){const l=Z(e,z,n);C[n]?(C[n].p(l,o),A(C[n],1)):(C[n]=oe(l),C[n].c(),A(C[n],1),C[n].m(t,x))}for(M(),n=z.length;n<C.length;n+=1)I(n);P()}},i(e){if(!k){A(_);for(let e=0;e<j.length;e+=1)A(E[e]);for(let e=0;e<z.length;e+=1)A(C[e]);k=!0}},o(e){B(_),E=E.filter(Boolean);for(let e=0;e<E.length;e+=1)B(E[e]);C=C.filter(Boolean);for(let e=0;e<C.length;e+=1)B(C[e]);k=!1},d(e){e&&c(t),_&&_.d(),d(E,e),d(C,e),w=!1,o(O)}}}function re(e,t,n){let o=[],l=0,r=null,s=[],i=!0,c=!1,d=[];var u;u=()=>{window.addEventListener("keypress",(e=>{n(2,i=!i)})),window.addEventListener("keydown",(e=>{"Escape"===e.key&&n(2,i=!i)})),window.addEventListener("mouseup",(()=>{c&&(c=!1,n(0,o=Object.assign({},d)))}))},v().$$.on_mount.push(u);let a=!1;const f=()=>{let e=0;for(let t of Object.values(o)){if(0===t.edges.size)return"circuit not closed";t.edges.size%2==1&&e++}return 2===e?"Eulerian path":0===e&&"Eulerian cycle"},g=(e,t)=>{let n=1;t[e]=!0;for(let l of o[e].edges)!1===t[l]&&(n+=g(l,t));return n},h=(e,t)=>{let n={};for(let e of Object.keys(o))n[e]=!1;const l=g(e,n);o[e].edges.delete(t),o[t].edges.delete(e),n={};for(let e of Object.keys(o))n[e]=!1;const r=g(e,n);return o[e].edges.add(t),o[t].edges.add(e),l>r},p=()=>{if(!f())return;const e=Object.values(o);d={};for(let t of e)d[t.id]=Object.assign(Object.assign({},t),{edges:new Set([...t.edges])});let t=null;e:{for(let n of e)if(n.edges.size%2==1){t=n;break e}t=e[0]}e.forEach((e=>e.solutionOrder=""));let l=1;for(t.solutionOrder=1;0!==t.edges.size;){let e=null;e:{const n=[...t.edges];for(let l of n)if(!h(t.id,l)){e=o[l];break e}const[l]=t.edges;e=o[l]}t.edges.delete(e.id),e.edges.delete(t.id),console.log(`${t.id} -> ${e.id}`),e.solutionOrder=""===e.solutionOrder?++l:`${e.solutionOrder},${++l}`,t=e}n(0,o=Object.assign({},o)),c=!0};return[o,s,i,a,p,e=>{const t=++l;n(0,o[t]={id:t,solutionOrder:"",x:e.clientX,y:e.clientY,isSelected:!1,edges:new Set},o),n(3,a=f())},e=>{const t=e.detail;return t===r?(t.isSelected=!1,n(0,o=Object.assign({},o)),void(r=null)):r?(e=>{if(e.edges.has(r.id)&&r.edges.has(e.id))return;e.isSelected=!1,r.isSelected=!1,e.edges.add(r.id),r.edges.add(e.id);const t=Math.atan2(r.y-e.y,r.x-e.x);n(1,s=[...s,{x:r.x+30,y:r.y+5,width:(Math.abs(r.x-e.x)**2+Math.abs(r.y-e.y)**2)**.5,height:50,angleDeg:180+180*t/Math.PI,node1Id:r.id,node2Id:e.id}]),n(0,o=Object.assign({},o)),r=null,n(3,a=f())})(t):(t.isSelected=!0,n(0,o=Object.assign({},o)),void(r=t))},e=>{for(let t of Object.values(o))t.edges.delete(e.detail.id);n(1,s=s.filter((t=>t.node1Id!==e.detail.id&&t.node2Id!==e.detail.id))),e.detail.isSelected&&(r=null),delete o[e.detail.id],n(0,o=Object.assign({},o)),n(3,a=f())},e=>{for(let t of Object.values(o))t.id===e.detail.node1Id?t.edges.delete(e.detail.node2Id):t.id===e.detail.node2Id&&t.edges.delete(e.detail.node1Id);n(0,o=Object.assign({},o)),n(1,s=s.filter((t=>t!==e.detail))),n(3,a=f())},()=>n(2,i=!1),()=>p()]}return new class extends R{constructor(e){super(),H(this,e,re,le,r,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
