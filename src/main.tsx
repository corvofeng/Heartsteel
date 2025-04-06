import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { MyThree, HSAttr } from './tree.tsx';
import React, { useState } from 'react';
import Drawer from './components/Drawer';

const heartsteelRoot = document.getElementById('root-for-heartsteel-test');
if (heartsteelRoot) {
  ReactDOM.createRoot(heartsteelRoot).render(<App />);
}

const hsAttr: HSAttr = {
  width: Number(document.getElementById('heartsteel-root')!.getAttribute('hs-width')!),
  scale: Number(document.getElementById('heartsteel-root')!.getAttribute('hs-scale')!),
  height: Number(document.getElementById('heartsteel-root')!.getAttribute('hs-height')!),
  action: document.getElementById('heartsteel-root')!.getAttribute('hs-action')!,
  modelPath: document.getElementById('heartsteel-root')!.getAttribute('hs-model')!,
  visible: true, // 默认设置为 true
  debugMode: document.getElementById('heartsteel-root')!.getAttribute('hs-mode')! == 'debug',
};
console.log('Get hsAttr: ', hsAttr);

function AppWithVisibilityControl() {
  const [isVisible, setIsVisible] = useState(hsAttr.visible);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // 控制抽屉的开关状态

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div>
      {/* 使用 Drawer 组件 */}
      <Drawer isOpen={isDrawerOpen} onToggle={toggleDrawer}>
        <button
          onClick={toggleVisibility}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          {isVisible ? 'Hide' : 'Show'} MyThree
        </button>
      </Drawer>

      {/* MyThree 组件 */}
      <React.StrictMode>
        <MyThree {...hsAttr} visible={isVisible} />
      </React.StrictMode>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('heartsteel-root')!).render(
  <AppWithVisibilityControl />
);