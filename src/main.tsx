import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {MyThree, HSAttr }from './tree.tsx'
import React from 'react';


const heartsteelRoot = document.getElementById("root-for-heartsteel-test");
if (heartsteelRoot) {
  ReactDOM.createRoot(heartsteelRoot).render(
    <App />
  )
}

const hsAttr: HSAttr = {
  width: Number(document.getElementById('heartsteel-root')!.getAttribute('hs-width')!),
  scale: Number(document.getElementById('heartsteel-root')!.getAttribute('hs-scale')!),
  height: Number(document.getElementById('heartsteel-root')!.getAttribute('hs-height')!),
  action: document.getElementById('heartsteel-root')!.getAttribute('hs-action')!,
  model: document.getElementById('heartsteel-root')!.getAttribute('hs-model')!,
  debugMode: document.getElementById('heartsteel-root')!.getAttribute('hs-mode')! == "debug",
};
console.log("Get hsAttr: ", hsAttr);

ReactDOM.createRoot(document.getElementById('heartsteel-root')!).render(
  <div>
    <React.StrictMode>
      <MyThree {...hsAttr}/>
    </React.StrictMode>
  </div>
)