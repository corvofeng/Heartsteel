import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {MyThree, HSAttr }from './tree.tsx'
import React from 'react';



ReactDOM.createRoot(document.getElementById("root-for-heartsteel-test")!).render(
  <App />
)


const hsAttr: HSAttr = {
  width: 350,
  height: 350,
  hsAction: document.getElementById('heartsteel-root')!.getAttribute('hs-action')!
};

ReactDOM.createRoot(document.getElementById('heartsteel-root')!).render(
  <div>
    <React.StrictMode>
      <MyThree {...hsAttr}/>
    </React.StrictMode>
  </div>
)