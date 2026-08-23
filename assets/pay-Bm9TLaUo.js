import{c as a,j as e,A as o,r as l,a as c,R as d}from"./index-Dr6EwRCk.js";/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=a("Bitcoin",[["path",{d:"M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727",key:"yr8idg"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=a("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=a("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=a("CreditCard",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=a("IndianRupee",[["path",{d:"M6 3h12",key:"ggurg9"}],["path",{d:"M6 8h12",key:"6g4wlu"}],["path",{d:"m6 13 8.5 8",key:"u1kupk"}],["path",{d:"M6 13h3",key:"wdp6ag"}],["path",{d:"M9 13c6.667 0 6.667-10 0-10",key:"1nkvk2"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=a("Wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]),f=[{id:"paypal",label:"PayPal",icon:u,value:"paypal.me/REPLACE_ME",href:"https://paypal.me/REPLACE_ME",note:"International payments, cards, and bank transfers via PayPal."},{id:"razorpay",label:"Razorpay",icon:h,value:"razorpay.me/@REPLACE_ME",href:"https://razorpay.me/@REPLACE_ME",note:"UPI, cards, netbanking, and wallets — best for India-based payments."},{id:"crypto",label:"Crypto",icon:p,value:"REPLACE_WITH_YOUR_WALLET_ADDRESS",href:void 0,note:"BTC / ETH / USDT (TRC20) — double-check the network before sending."},{id:"upi",label:"UPI",icon:y,value:"REPLACE_ME@upi",href:void 0,note:"Any UPI app — GPay, PhonePe, Paytm, or your bank's app."}];function b({method:t}){const[r,s]=l.useState(!1),n=t.icon,i=async()=>{try{await navigator.clipboard.writeText(t.value),s(!0),setTimeout(()=>s(!1),1800)}catch{}};return e.jsxs("div",{className:"flex flex-col gap-4 rounded-md border border-stone-line bg-rice-raised p-6 shadow-soft transition-transform duration-300 ease-zen hover:-translate-y-1",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"flex h-11 w-11 items-center justify-center rounded-full bg-moss/10 text-moss-deep",children:e.jsx(n,{size:20,strokeWidth:1.6})}),e.jsx("h2",{className:"font-display text-xl text-sumi",children:t.label})]}),e.jsx("p",{className:"text-sm text-sumi-soft",children:t.note}),e.jsxs("div",{className:"mt-auto flex items-center gap-2 rounded-sm border border-stone-line-strong bg-rice px-3 py-2.5",children:[e.jsx("code",{className:"flex-1 truncate font-mono text-[13px] text-sumi",children:t.value}),e.jsx("button",{type:"button",onClick:i,"aria-label":`Copy ${t.label} details`,className:"flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-moss-deep transition-colors duration-200 hover:bg-moss/10",children:r?e.jsx(x,{size:15,strokeWidth:2}):e.jsx(m,{size:15,strokeWidth:1.8})})]}),t.href&&e.jsxs("a",{href:t.href,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center justify-center rounded-sm bg-sumi px-4 py-2.5 font-mono text-[12px] uppercase tracking-wide text-rice transition-transform duration-300 ease-zen hover:-translate-y-0.5 hover:shadow-soft",children:["Open ",t.label]})]})}function g(){return e.jsxs("main",{className:"flex min-h-[100dvh] flex-col bg-rice",children:[e.jsx("div",{className:"wrap flex items-center py-6",children:e.jsxs("a",{href:"./index.html",className:"inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-sumi/70 transition-colors duration-200 hover:text-moss-deep",children:[e.jsx(o,{size:15,strokeWidth:1.8}),"Back to portfolio"]})}),e.jsxs("div",{className:"wrap flex flex-1 flex-col justify-center py-10",children:[e.jsx("p",{className:"eyebrow mb-4",children:"Support / Payments"}),e.jsxs("h1",{className:"max-w-xl text-4xl sm:text-5xl",children:["Ways to ",e.jsx("span",{className:"italic text-moss-deep",children:"pay"})]}),e.jsx("p",{className:"mt-5 max-w-[54ch] text-lg text-sumi-soft",children:"For a completed engagement, a bounty thank-you, or just buying me a coffee — pick whichever works best for you."}),e.jsx("div",{className:"mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",children:f.map(t=>e.jsx(b,{method:t},t.id))})]}),e.jsxs("div",{className:"wrap flex flex-wrap items-center justify-between gap-2 border-t border-stone-line py-6 text-[13px] text-sumi/50",children:[e.jsxs("p",{className:"m-0",children:["© ",new Date().getFullYear()," Parshuram Kalunkhe."]}),e.jsx("p",{className:"m-0 font-mono",children:"// stay curious. stay secure."})]})]})}c.createRoot(document.getElementById("root")).render(e.jsx(d.StrictMode,{children:e.jsx(g,{})}));
