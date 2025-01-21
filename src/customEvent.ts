import { EventEmitter } from "events";

// 创建一个事件发射器实例
export const customEmitter = new EventEmitter();

// // 注册事件监听器
// myEmitter.on('event', (message: string) => {
//   console.log('事件被触发:', message);
// });

// // 触发事件
// myEmitter.emit('event', 'Hello, TypeScript!');
