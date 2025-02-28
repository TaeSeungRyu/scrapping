class TaskQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  // 작업 추가
  addTask(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.processQueue(); // 큐 실행
    });
  }

  // 큐 실행
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const { task, resolve, reject } = this.queue.shift();

    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.isProcessing = false;
      this.processQueue(); // 다음 작업 실행
    }
  }
}

module.exports = {
  TaskQueue,
};
