(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,75157,e=>{"use strict";e.s(["cn",0,function(...e){return e.filter(Boolean).join(" ")},"formatPrice",0,function(e,t="es-MX"){let a=Number.parseFloat(e.amount);return new Intl.NumberFormat(t,{style:"currency",currency:e.currencyCode||"USD",minimumFractionDigits:2*!Number.isInteger(a)}).format(a)},"isOnSale",0,function(e,t){return!!t&&Number.parseFloat(t.amount)>Number.parseFloat(e.amount)}])},38139,77316,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(47167);let n=r.default.env.SHOPIFY_STORE_DOMAIN??"proglass-7200.myshopify.com"??"",s=r.default.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN??"7db3a94df0971b999dd34609351a787d"??"",i=r.default.env.SHOPIFY_API_VERSION??""??"2025-01",l=!!(n&&s),o=n?`https://${n}/api/${i}/graphql.json`:"";class c extends Error{status;query;constructor(e,t){super(e),this.name="ShopifyError",this.status=t?.status,this.query=t?.query}}async function d({query:e,variables:t,cache:a="force-cache"}){let r;if(!l)throw new c("Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.");try{r=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json","X-Shopify-Storefront-Access-Token":s},body:JSON.stringify({query:e,variables:t}),cache:a})}catch(t){throw new c(`Network error calling Shopify: ${t.message}`,{query:e})}if(!r.ok)throw new c(`Shopify responded ${r.status}`,{status:r.status,query:e});let n=await r.json();if(n.errors?.length)throw new c(n.errors.map(e=>e.message).join("; "),{query:e});if(!n.data)throw new c("Shopify returned no data",{query:e});return n.data}let u=`
  fragment image on Image {
    url
    altText
    width
    height
  }
`,f=`
  fragment seo on SEO {
    title
    description
  }
`,m=`
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    updatedAt
    options {
      id
      name
      optionValues {
        name
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            ...image
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    ratingMetafield: metafield(namespace: "reviews", key: "rating") {
      value
    }
    ratingCountMetafield: metafield(namespace: "reviews", key: "rating_count") {
      value
    }
    beforeImage: metafield(namespace: "custom", key: "before_image") {
      reference {
        ... on MediaImage {
          image {
            ...image
          }
        }
      }
    }
    afterImage: metafield(namespace: "custom", key: "after_image") {
      reference {
        ... on MediaImage {
          image {
            ...image
          }
        }
      }
    }
  }
  ${u}
  ${f}
`,p=`
  fragment cart on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
              image {
                ...image
              }
              product {
                id
                handle
                title
                featuredImage {
                  ...image
                }
              }
            }
          }
        }
      }
    }
  }
  ${u}
`,h=`
  mutation cartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...cart
      }
      userErrors {
        field
        message
      }
    }
  }
  ${p}
`,x=`
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
      userErrors {
        field
        message
      }
    }
  }
  ${p}
`,y=`
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
      userErrors {
        field
        message
      }
    }
  }
  ${p}
`,g=`
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...cart
      }
      userErrors {
        field
        message
      }
    }
  }
  ${p}
`,b=`
  query getProducts(
    $first: Int = 24
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
  ) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${m}
`,v=`
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${p}
`;function j(e){return e?.edges.map(e=>e.node)??[]}function k(e){var t;if(!e)return null;let{images:a,variants:r,options:n,ratingMetafield:s,ratingCountMetafield:i,beforeImage:l,afterImage:o,...c}=e,d=l?.reference?.image?.url,u=o?.reference?.image?.url;return{...c,images:(t=e.title,j(a).map(e=>({...e,altText:e.altText||t}))),variants:j(r),options:n.map(e=>({id:e.id,name:e.name,values:e.optionValues.map(e=>e.name)})),featuredImage:e.featuredImage?{...e.featuredImage,altText:e.featuredImage.altText||e.title}:null,rating:function(e){if(!e)return null;try{let t=JSON.parse(e),a=Number(t.value);return Number.isFinite(a)?a:null}catch{let t=Number(e);return Number.isFinite(t)?t:null}}(s?.value),ratingCount:i?.value&&Number.parseInt(i.value,10)||null,beforeAfter:d&&u?{before:d,after:u}:null}}function w(e){return{...e,cost:{...e.cost,totalTaxAmount:e.cost.totalTaxAmount??null},lines:j(e.lines)}}async function N(e){return l?j((await d({query:b,variables:{first:e?.first??24,sortKey:e?.sortKey,reverse:e?.reverse,query:e?.query}})).products).map(k).filter(e=>!!e):[]}async function C(e=[]){return w((await d({query:h,variables:{lines:e},cache:"no-store"})).cartCreate.cart)}async function I(e){let t=await d({query:v,variables:{cartId:e},cache:"no-store"});return t.cart?w(t.cart):null}async function S(e,t){return w((await d({query:x,variables:{cartId:e,lines:t},cache:"no-store"})).cartLinesAdd.cart)}async function _(e,t){return w((await d({query:y,variables:{cartId:e,lines:t},cache:"no-store"})).cartLinesUpdate.cart)}async function E(e,t){return w((await d({query:g,variables:{cartId:e,lineIds:t},cache:"no-store"})).cartLinesRemove.cart)}e.s(["addToCart",0,S,"createCart",0,C,"getCart",0,I,"getProducts",0,N,"removeFromCart",0,E,"updateCart",0,_],77316);let $="proglass_cart_id",O=(0,a.createContext)(null);e.s(["CartProvider",0,function({children:e}){let[r,n]=(0,a.useState)(null),[s,i]=(0,a.useState)(!1),[l,o]=(0,a.useState)(!1),[c,d]=(0,a.useState)(null);(0,a.useEffect)(()=>{let e=window.localStorage.getItem($);e&&I(e).then(e=>{e?n(e):window.localStorage.removeItem($)}).catch(()=>window.localStorage.removeItem($))},[]);let u=(0,a.useCallback)(e=>{n(e),window.localStorage.setItem($,e.id)},[]),f=(0,a.useCallback)(async e=>{o(!0),d(null);try{let t=await e();u(t)}catch(e){throw d(e instanceof Error?e.message:"No se pudo actualizar el carrito"),e}finally{o(!1)}},[u]),m=(0,a.useCallback)(async(e,t=1)=>{await f(async()=>{let a=window.localStorage.getItem($);return a&&r?S(a,[{merchandiseId:e,quantity:t}]):C([{merchandiseId:e,quantity:t}])}),i(!0)},[r,f]),p=(0,a.useCallback)(async(e,t,a)=>{let n=r?.id;if(n){if(a<=0)return void await f(()=>E(n,[e]));await f(()=>_(n,[{id:e,merchandiseId:t,quantity:a}]))}},[r?.id,f]),h=(0,a.useCallback)(async e=>{let t=r?.id;t&&await f(()=>E(t,[e]))},[r?.id,f]),x=(0,a.useMemo)(()=>({cart:r,totalQuantity:r?.totalQuantity??0,isOpen:s,isUpdating:l,error:c,openCart:()=>i(!0),closeCart:()=>i(!1),toggleCart:()=>i(e=>!e),addItem:m,updateItem:p,removeItem:h}),[r,s,l,c,m,p,h]);return(0,t.jsx)(O.Provider,{value:x,children:e})},"useCart",0,function(){let e=(0,a.useContext)(O);if(!e)throw Error("useCart must be used within a CartProvider");return e}],38139)},47592,e=>{"use strict";var t=e.i(43476),a=e.i(57688),r=e.i(22016),n=e.i(56420);let s=(0,n.default)("minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]),i=(0,n.default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]),l=(0,n.default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);var o=e.i(38139),c=e.i(75157);e.s(["CartLineItem",0,function({line:e,onNavigate:n}){let{updateItem:d,removeItem:u,isUpdating:f}=(0,o.useCart)(),{merchandise:m}=e,p=m.image??m.product.featuredImage,h=m.selectedOptions.filter(e=>"Default Title"!==e.value).map(e=>e.value).join(" · ");return(0,t.jsxs)("div",{className:"flex gap-4 py-4",children:[(0,t.jsx)(r.default,{href:`/products/${m.product.handle}`,onClick:n,className:"relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-stone-soft",children:p&&(0,t.jsx)(a.default,{src:p.url,alt:p.altText,fill:!0,sizes:"80px",className:"object-cover"})}),(0,t.jsxs)("div",{className:"flex flex-1 flex-col",children:[(0,t.jsxs)("div",{className:"flex justify-between gap-2",children:[(0,t.jsx)(r.default,{href:`/products/${m.product.handle}`,onClick:n,className:"font-serif text-sm leading-snug hover:text-accent",children:m.product.title}),(0,t.jsx)("button",{type:"button",onClick:()=>u(e.id),disabled:f,"aria-label":"Quitar del carrito",className:"text-ink-soft/50 transition-colors hover:text-danger disabled:opacity-40",children:(0,t.jsx)(l,{className:"h-4 w-4",strokeWidth:1.5})})]}),h&&(0,t.jsx)("span",{className:"text-xs text-ink-soft/70",children:h}),(0,t.jsxs)("div",{className:"mt-auto flex items-center justify-between pt-2",children:[(0,t.jsxs)("div",{className:"inline-flex items-center rounded-full border border-stone",children:[(0,t.jsx)("button",{type:"button",onClick:()=>d(e.id,m.id,e.quantity-1),disabled:f,"aria-label":"Reducir cantidad",className:"px-2.5 py-1.5 text-ink-soft hover:text-ink disabled:opacity-40",children:(0,t.jsx)(s,{className:"h-3.5 w-3.5",strokeWidth:2})}),(0,t.jsx)("span",{className:"min-w-6 text-center text-sm tabular-nums",children:e.quantity}),(0,t.jsx)("button",{type:"button",onClick:()=>d(e.id,m.id,e.quantity+1),disabled:f,"aria-label":"Aumentar cantidad",className:"px-2.5 py-1.5 text-ink-soft hover:text-ink disabled:opacity-40",children:(0,t.jsx)(i,{className:"h-3.5 w-3.5",strokeWidth:2})})]}),(0,t.jsx)("span",{className:"text-sm font-medium tabular-nums",children:(0,c.formatPrice)(e.cost.totalAmount)})]})]})]})}],47592)},8341,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={cancelIdleCallback:function(){return i},requestIdleCallback:function(){return s}};for(var n in r)Object.defineProperty(a,n,{enumerable:!0,get:r[n]});let s="u">typeof self&&self.requestIdleCallback&&self.requestIdleCallback.bind(window)||function(e){let t=Date.now();return self.setTimeout(function(){e({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-t))}})},1)},i="u">typeof self&&self.cancelIdleCallback&&self.cancelIdleCallback.bind(window)||function(e){return clearTimeout(e)};("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},19083,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={ESCAPE_REGEX:function(){return i},htmlEscapeAttributeString:function(){return d},htmlEscapeJsonString:function(){return c}};for(var n in r)Object.defineProperty(a,n,{enumerable:!0,get:r[n]});let s={"&":"\\u0026",">":"\\u003e","<":"\\u003c","\u2028":"\\u2028","\u2029":"\\u2029"},i=/[&><\u2028\u2029]/g,l={"&":"&amp;",'"':"&quot;","'":"&#39;","<":"&lt;",">":"&gt;"},o=/[&"'<>]/g;function c(e){return e.replace(i,e=>s[e])}function d(e){return e.replace(o,e=>l[e])}},79520,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return v},handleClientScriptLoad:function(){return y},initScriptLoader:function(){return g}};for(var n in r)Object.defineProperty(a,n,{enumerable:!0,get:r[n]});let s=e.r(55682),i=e.r(90809),l=e.r(43476),o=s._(e.r(74080)),c=i._(e.r(71645)),d=e.r(42732),u=e.r(22737),f=e.r(8341),m=e.r(19083),p=new Map,h=new Set,x=e=>{let{src:t,id:a,onLoad:r=()=>{},onReady:n=null,dangerouslySetInnerHTML:s,children:i="",strategy:l="afterInteractive",onError:c,stylesheets:d}=e,f=a||t;if(f&&h.has(f))return;if(p.has(t)){h.add(f),p.get(t).then(r,c);return}let m=()=>{n&&n(),h.add(f)},x=document.createElement("script"),y=new Promise((e,t)=>{x.addEventListener("load",function(t){e(),r&&r.call(this,t),m()}),x.addEventListener("error",function(e){t(e)})}).catch(function(e){c&&c(e)});s?(x.innerHTML=s.__html||"",m()):i?(x.textContent="string"==typeof i?i:Array.isArray(i)?i.join(""):"",m()):t&&(x.src=t,p.set(t,y)),(0,u.setAttributesFromProps)(x,e),"worker"===l&&x.setAttribute("type","text/partytown"),x.setAttribute("data-nscript",l),d&&(e=>{if(o.default.preinit)return e.forEach(e=>{o.default.preinit(e,{as:"style"})});if("u">typeof window){let t=document.head;e.forEach(e=>{let a=document.createElement("link");a.type="text/css",a.rel="stylesheet",a.href=e,t.appendChild(a)})}})(d),document.body.appendChild(x)};function y(e){let{strategy:t="afterInteractive"}=e;"lazyOnload"===t?window.addEventListener("load",()=>{(0,f.requestIdleCallback)(()=>x(e))}):x(e)}function g(e){e.forEach(y),[...document.querySelectorAll('[data-nscript="beforeInteractive"]'),...document.querySelectorAll('[data-nscript="beforePageRender"]')].forEach(e=>{let t=e.id||e.getAttribute("src");h.add(t)})}function b(e){let{id:t,src:a="",onLoad:r=()=>{},onReady:n=null,strategy:s="afterInteractive",onError:i,stylesheets:u,...p}=e,{updateScripts:y,scripts:g,getIsSsr:b,appDir:v,nonce:j}=(0,c.useContext)(d.HeadManagerContext);j=p.nonce||j;let k=(0,c.useRef)(!1);(0,c.useEffect)(()=>{let e=t||a;k.current||(n&&e&&h.has(e)&&n(),k.current=!0)},[n,t,a]);let w=(0,c.useRef)(!1);if((0,c.useEffect)(()=>{if(!w.current){if("afterInteractive"===s)x(e);else"lazyOnload"===s&&("complete"===document.readyState?(0,f.requestIdleCallback)(()=>x(e)):window.addEventListener("load",()=>{(0,f.requestIdleCallback)(()=>x(e))}));w.current=!0}},[e,s]),("beforeInteractive"===s||"worker"===s)&&(y?(g[s]=(g[s]||[]).concat([{id:t,src:a,onLoad:r,onReady:n,onError:i,...p,nonce:j}]),y(g)):b&&b()?h.add(t||a):b&&!b()&&x({...e,nonce:j})),v){if(u&&u.forEach(e=>{o.default.preinit(e,{as:"style"})}),"beforeInteractive"===s)if(!a)return p.dangerouslySetInnerHTML&&(p.children=p.dangerouslySetInnerHTML.__html,delete p.dangerouslySetInnerHTML),(0,l.jsx)("script",{nonce:j,dangerouslySetInnerHTML:{__html:`(self.__next_s=self.__next_s||[]).push(${(0,m.htmlEscapeJsonString)(JSON.stringify([0,{...p,id:t}]))})`}});else return o.default.preload(a,p.integrity?{as:"script",integrity:p.integrity,nonce:j,crossOrigin:p.crossOrigin}:{as:"script",nonce:j,crossOrigin:p.crossOrigin}),(0,l.jsx)("script",{nonce:j,dangerouslySetInnerHTML:{__html:`(self.__next_s=self.__next_s||[]).push(${(0,m.htmlEscapeJsonString)(JSON.stringify([a,{...p,id:t}]))})`}});"afterInteractive"===s&&a&&o.default.preload(a,p.integrity?{as:"script",integrity:p.integrity,nonce:j,crossOrigin:p.crossOrigin}:{as:"script",nonce:j,crossOrigin:p.crossOrigin})}return null}Object.defineProperty(b,"__nextScript",{value:!0});let v=b;("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},3303,(e,t,a)=>{t.exports=e.r(79520)},86402,e=>{"use strict";var t=e.i(43476),a=e.i(3303),r=e.i(75679);e.s(["Analytics",0,function(){return(0,t.jsxs)(t.Fragment,{children:[r.GA_MEASUREMENT_ID&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.default,{src:`https://www.googletagmanager.com/gtag/js?id=${r.GA_MEASUREMENT_ID}`,strategy:"afterInteractive"}),(0,t.jsx)(a.default,{id:"ga4-init",strategy:"afterInteractive",children:`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${r.GA_MEASUREMENT_ID}');
            `})]}),r.KLAVIYO_PUBLIC_KEY&&(0,t.jsx)(a.default,{id:"klaviyo",strategy:"afterInteractive",src:`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${r.KLAVIYO_PUBLIC_KEY}`})]})}])},63448,63676,e=>{"use strict";var t=e.i(56420);let a=(0,t.default)("shopping-bag",[["path",{d:"M16 10a4 4 0 0 1-8 0",key:"1ltviw"}],["path",{d:"M3.103 6.034h17.794",key:"awc11p"}],["path",{d:"M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",key:"o988cm"}]]);e.s(["ShoppingBag",0,a],63448);let r=(0,t.default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,r],63676)},2971,e=>{"use strict";e.i(47167);var t=e.i(43476),a=e.i(57688),r=e.i(22016),n=e.i(56420);let s=(0,n.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]),i=(0,n.default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);var l=e.i(63448);let o=(0,n.default)("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);var c=e.i(63676),d=e.i(71645),u=e.i(77316),f=e.i(75157);function m({open:e,onClose:n}){let[s,l]=(0,d.useState)(""),[o,p]=(0,d.useState)([]),[h,x]=(0,d.useState)(!1);return((0,d.useEffect)(()=>{if(!e)return;let t=document.body.style.overflow;document.body.style.overflow="hidden";let a=e=>"Escape"===e.key&&n();return window.addEventListener("keydown",a),()=>{document.body.style.overflow=t,window.removeEventListener("keydown",a)}},[e,n]),(0,d.useEffect)(()=>{let e=s.trim(),t=!0,a=setTimeout(()=>{if(!e){p([]),x(!1);return}x(!0),(0,u.getProducts)({query:e,first:8}).then(e=>{t&&p(e)}).catch(()=>{t&&p([])}).finally(()=>{t&&x(!1)})},250*!!e);return()=>{t=!1,clearTimeout(a)}},[s]),e)?(0,t.jsxs)("div",{className:"fixed inset-0 z-50",children:[(0,t.jsx)("div",{className:"absolute inset-0 bg-ink/40",onClick:n}),(0,t.jsx)("div",{className:"absolute inset-x-0 top-0 bg-paper shadow-xl",children:(0,t.jsxs)("div",{className:"mx-auto max-w-3xl px-4 py-4 sm:px-6",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3 border-b border-stone pb-3",children:[(0,t.jsx)(i,{className:"h-5 w-5 shrink-0 text-ink-soft",strokeWidth:1.5}),(0,t.jsx)("input",{autoFocus:!0,value:s,onChange:e=>l(e.target.value),placeholder:"Buscar productos…","aria-label":"Buscar productos",className:"flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-soft/50"}),(0,t.jsx)("button",{type:"button",onClick:n,"aria-label":"Cerrar búsqueda",children:(0,t.jsx)(c.X,{className:"h-5 w-5 text-ink-soft hover:text-ink",strokeWidth:1.5})})]}),(0,t.jsxs)("div",{className:"max-h-[60vh] overflow-y-auto py-2",children:[h&&(0,t.jsx)("p",{className:"py-8 text-center text-sm text-ink-soft",children:"Buscando…"}),!h&&s.trim()&&0===o.length&&(0,t.jsxs)("p",{className:"py-8 text-center text-sm text-ink-soft",children:["Sin resultados para “",s,"”."]}),!h&&!s.trim()&&(0,t.jsx)("p",{className:"py-8 text-center text-sm text-ink-soft/70",children:"Escribe para buscar en el catálogo."}),(0,t.jsx)("ul",{className:"divide-y divide-stone",children:o.map(e=>(0,t.jsx)("li",{children:(0,t.jsxs)(r.default,{href:`/products/${e.handle}`,onClick:n,className:"flex items-center gap-4 rounded-lg px-2 py-3 hover:bg-surface",children:[(0,t.jsx)("div",{className:"relative h-14 w-14 shrink-0 overflow-hidden rounded bg-surface",children:e.featuredImage&&(0,t.jsx)(a.default,{src:e.featuredImage.url,alt:e.featuredImage.altText,fill:!0,sizes:"56px",className:"object-cover"})}),(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsx)("p",{className:"text-sm font-medium text-ink",children:e.title}),(0,t.jsx)("p",{className:"text-sm text-ink-soft",children:(0,f.formatPrice)(e.priceRange.minVariantPrice)})]})]})},e.id))})]})]})})]}):null}var p=e.i(38139);"http://localhost:3000".replace(/\/$/,"");let h="ProGlass",x=[{label:"Calzado",href:"/collections/calzado"},{label:"Visual",href:"/collections/visual"},{label:"Personal",href:"/collections/personal"},{label:"Más vendidos",href:"/collections/mas-vendidos"}],y="https://proglass-7200.myshopify.com/account";e.s(["Header",0,function(){let{totalQuantity:e,openCart:n}=(0,p.useCart)(),[u,f]=(0,d.useState)(!1),[g,b]=(0,d.useState)(!1);return(0,t.jsxs)("header",{className:"sticky top-0 z-40 border-b border-stone bg-paper/90 backdrop-blur",children:[(0,t.jsxs)("div",{className:"mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8",children:[(0,t.jsx)("button",{type:"button",onClick:()=>f(e=>!e),"aria-label":"Menú","aria-expanded":u,className:"flex h-9 w-9 items-center justify-center text-ink md:hidden",children:u?(0,t.jsx)(c.X,{className:"h-6 w-6",strokeWidth:1.5}):(0,t.jsx)(s,{className:"h-6 w-6",strokeWidth:1.5})}),(0,t.jsx)(r.default,{href:"/","aria-label":h,className:"md:flex-none",children:(0,t.jsx)(a.default,{src:"/logo.svg",alt:h,width:174,height:40,className:"h-8 w-auto sm:h-9"})}),(0,t.jsx)("nav",{className:"hidden flex-1 items-center justify-center gap-8 md:flex",children:x.map(e=>(0,t.jsx)(r.default,{href:e.href,className:"text-sm font-medium text-ink-soft transition-colors hover:text-ink",children:e.label},e.href))}),(0,t.jsxs)("div",{className:"flex items-center gap-1 sm:gap-2",children:[(0,t.jsx)("button",{type:"button",onClick:()=>b(!0),"aria-label":"Buscar",className:"flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-stone-soft",children:(0,t.jsx)(i,{className:"h-5 w-5",strokeWidth:1.5})}),(0,t.jsx)("a",{href:y,"aria-label":"Mi cuenta",className:"hidden h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-stone-soft sm:flex",children:(0,t.jsx)(o,{className:"h-5 w-5",strokeWidth:1.5})}),(0,t.jsxs)("button",{type:"button",onClick:n,"aria-label":`Abrir carrito, ${e} art\xedculos`,className:"relative flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-stone-soft",children:[(0,t.jsx)(l.ShoppingBag,{className:"h-5 w-5",strokeWidth:1.5}),e>0&&(0,t.jsx)("span",{className:"absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-paper tabular-nums",children:e})]})]})]}),u&&(0,t.jsx)("nav",{className:"border-t border-stone bg-paper md:hidden",children:(0,t.jsxs)("ul",{className:"flex flex-col px-4 py-2",children:[x.map(e=>(0,t.jsx)("li",{children:(0,t.jsx)(r.default,{href:e.href,onClick:()=>f(!1),className:"block py-3 text-base font-medium text-ink",children:e.label})},e.href)),(0,t.jsx)("li",{children:(0,t.jsx)("a",{href:y,className:"block py-3 text-base font-medium text-ink",children:"Mi cuenta"})})]})}),(0,t.jsx)(m,{open:g,onClose:()=>b(!1)})]})}],2971)},35171,e=>{"use strict";var t=e.i(43476),a=e.i(63448),r=e.i(63676),n=e.i(71645),s=e.i(47592),i=e.i(38139),l=e.i(75679),o=e.i(75157);e.s(["CartDrawer",0,function(){let{cart:e,isOpen:c,closeCart:d,totalQuantity:u,isUpdating:f,error:m}=(0,i.useCart)();(0,n.useEffect)(()=>{if(!c)return;let e=document.body.style.overflow;document.body.style.overflow="hidden";let t=e=>"Escape"===e.key&&d();return window.addEventListener("keydown",t),()=>{document.body.style.overflow=e,window.removeEventListener("keydown",t)}},[c,d]);let p=!e||0===e.lines.length;return(0,t.jsxs)("div",{className:`fixed inset-0 z-50 ${c?"":"pointer-events-none"}`,"aria-hidden":!c,children:[(0,t.jsx)("div",{onClick:d,className:`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${c?"opacity-100":"opacity-0"}`}),(0,t.jsxs)("aside",{role:"dialog","aria-label":"Carrito de compra",className:`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-xl transition-transform duration-300 ease-out ${c?"translate-x-0":"translate-x-full"}`,children:[(0,t.jsxs)("header",{className:"flex items-center justify-between border-b border-stone px-6 py-4",children:[(0,t.jsxs)("h2",{className:"font-serif text-lg",children:["Tu carrito",u>0&&` (${u})`]}),(0,t.jsx)("button",{type:"button",onClick:d,"aria-label":"Cerrar carrito",className:"text-ink-soft hover:text-ink",children:(0,t.jsx)(r.X,{className:"h-5 w-5",strokeWidth:1.5})})]}),p?(0,t.jsxs)("div",{className:"flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center",children:[(0,t.jsx)(a.ShoppingBag,{className:"h-12 w-12 text-stone",strokeWidth:1.25}),(0,t.jsx)("p",{className:"font-serif text-lg",children:"Tu carrito está vacío"}),(0,t.jsx)("p",{className:"text-sm text-ink-soft",children:"Explora el catálogo y añade tus favoritos."}),(0,t.jsx)("button",{type:"button",onClick:d,className:"mt-2 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper hover:bg-ink-soft",children:"Seguir comprando"})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"flex-1 divide-y divide-stone overflow-y-auto px-6",children:e.lines.map(e=>(0,t.jsx)(s.CartLineItem,{line:e,onNavigate:d},e.id))}),(0,t.jsxs)("footer",{className:"border-t border-stone px-6 py-5",children:[m&&(0,t.jsx)("p",{className:"mb-3 text-sm text-danger",children:m}),(0,t.jsxs)("div",{className:"mb-1 flex justify-between text-sm text-ink-soft",children:[(0,t.jsx)("span",{children:"Subtotal"}),(0,t.jsx)("span",{className:"tabular-nums",children:(0,o.formatPrice)(e.cost.subtotalAmount)})]}),(0,t.jsx)("p",{className:"mb-4 text-xs text-ink-soft/70",children:"Impuestos y envío se calculan en el checkout."}),(0,t.jsx)("a",{href:e.checkoutUrl,onClick:()=>(0,l.trackBeginCheckout)(e),className:`flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-accent-dark ${f?"pointer-events-none opacity-70":""}`,children:"Finalizar compra"})]})]})]})]})}])}]);