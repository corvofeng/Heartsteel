import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import MyThree from './tree.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
)

ReactDOM.createRoot(document.getElementById('heartsteel-root')!).render(
  <MyThree
    width={300} height={300} 
    hsAction={document.getElementById('heartsteel-root')!.getAttribute('hs-action')!}
   />
)
