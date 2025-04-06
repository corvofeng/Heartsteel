import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Draggable from 'react-draggable'; // 引入 Draggable

interface DrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  width?: string; // 抽屉宽度，默认为 300px
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onToggle, children, width = '300px' }) => {
  // 动态调整宽度，手机端宽度更小
  const drawerWidth = window.innerWidth <= 768 ? '60%' : width; // 手机端宽度调整为 60%

  const [isDragging, setIsDragging] = useState(false); // 用于区分拖动和点击

  const handleStart = () => {
    setIsDragging(false); // 开始拖动时重置状态
  };

  const handleDrag = () => {
    setIsDragging(true); // 拖动过程中设置为 true
  };

  const handleStop = (e: any) => {
    // 如果没有拖动，则触发点击事件
    if (!isDragging) {
      e.stopPropagation();
      onToggle();
    }
  };

  return (
    <div>
      {/* 遮罩层 */}
      {isOpen && (
        <div
          onClick={onToggle} // 点击遮罩层关闭抽屉
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明背景
            zIndex: 999, // 遮罩层在抽屉下方
          }}
        />
      )}

      {/* 抽屉容器 */}
      <motion.div
        initial={{ x: '100%' }} // 初始状态：完全隐藏
        animate={{ x: isOpen ? '0%' : '100%' }} // 打开时显示，隐藏时完全移出屏幕
        transition={{ type: 'spring', stiffness: 300, damping: 30 }} // 弹性动画
        style={{
          position: 'fixed',
          top: '0',
          right: '0',
          width: drawerWidth,
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          padding: '20px',
          overflowY: 'auto', // 支持滚动
        }}
      >
        {/* 抽屉内容 */}
        {children}
      </motion.div>

      {/* 可拖动的抽屉开关按钮 */}
      <Draggable
        handle=".draggable-handle" // 仅允许拖动指定的元素
        onStart={handleStart} // 拖动开始时触发
        onDrag={handleDrag} // 拖动过程中触发
        onStop={handleStop} // 拖动结束时触发
      >
        <div // 使用 div 包裹按钮，确保 Draggable 正常工作
          style={{
            position: 'absolute', // 保证按钮在页面上可见
            zIndex: 1001,
          }}
        >
          <motion.button
            className="draggable-handle" // 添加类名，指定可拖动区域
            initial={{ opacity: 0.8 }}
            whileHover={{
              opacity: 1,
              scale: 1.1,
              boxShadow: '0 0 10px rgba(0, 123, 255, 0.6)', // 光晕效果
            }} // 悬停时的动画效果
            whileTap={{ scale: 0.95 }} // 点击时的动画效果
            style={{
              padding: '8px',
              background: 'linear-gradient(135deg, #6A5ACD, #00BFFF)', // 渐变背景
              color: '#fff',
              border: 'none',
              borderRadius: '50%', // 圆形按钮
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // 默认阴影
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* 按钮内容为空，保持小巧优雅 */}
          </motion.button>
        </div>
      </Draggable>
    </div>
  );
};

export default Drawer;