class CircuitBreaker {
  constructor({ failureThreshold = 3, retryCount = 3, resetTimeout = 5000 }) {
    this.state = 'CLOSED'; // initial state
    this.failureCount = 0;
    this.successCount = 0;
    this.failureThreshold = failureThreshold; // Số lần thất bại trong HALF-OPEN để chuyển sang OPEN
    this.retryCount = retryCount;
    this.resetTimeout = resetTimeout;
    this.lastFailureTime = null;
    this.halfOpenFailureCount = 0; // Đếm số lần thất bại trong HALF-OPEN
    console.log(`CircuitBreaker initialized: state=${this.state}, failureThreshold=${this.failureThreshold}, retryCount=${this.retryCount}, resetTimeout=${this.resetTimeout}`);
  }

  // Phương thức để kiểm tra trạng thái của mạch ngắt
  isOpen() {
    if (this.state === 'OPEN' && (Date.now() - this.lastFailureTime) > this.resetTimeout) {
      this.state = 'HALF-OPEN';
      this.successCount = 0;
      this.halfOpenFailureCount = 0; // Reset khi vào HALF-OPEN
      console.log(`Circuit state changed to HALF-OPEN after ${this.resetTimeout}ms`);
    }
    return this.state === 'OPEN';
  }
  
  // Phương thức xử lý khi mạch ngắt thất bại
  fail() {
    this.failureCount++;
    console.log(`Circuit failure recorded: failureCount=${this.failureCount}`);

    // Nếu đang ở CLOSED, chuyển sang HALF-OPEN ngay sau lần thất bại đầu tiên
    if (this.state === 'CLOSED') {
      this.state = 'HALF-OPEN';
      this.halfOpenFailureCount = 0;
      console.log('Circuit state changed to HALF-OPEN due to first failure');
    }

    // Nếu đang ở HALF-OPEN, đếm số lần thất bại
    if (this.state === 'HALF-OPEN') {
      this.halfOpenFailureCount++;
      console.log(`Failure in HALF-OPEN: halfOpenFailureCount=${this.halfOpenFailureCount}`);
      if (this.halfOpenFailureCount >= this.failureThreshold) {
        this.state = 'OPEN';
        this.lastFailureTime = Date.now();
        console.log('Circuit state changed to OPEN');
      }
    }
  }

  // Phương thức xử lý khi mạch ngắt thành công
  success() {
    this.successCount++;
    console.log(`Circuit success recorded: successCount=${this.successCount}, state=${this.state}`);
    if (this.state === 'HALF-OPEN') {
      this.state = 'CLOSED';
      this.failureCount = 0;
      this.halfOpenFailureCount = 0;
      console.log('Circuit state changed to CLOSED due to success in HALF-OPEN');
    }
  }

  // Phương thức reset mạch ngắt về CLOSED
  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.halfOpenFailureCount = 0;
    this.lastFailureTime = null;
    console.log('Circuit state reset to CLOSED');
  }

  // Phương thức lấy trạng thái hiện tại
  getState() {
    return this.state;
  }

  // Phương thức lấy thông tin trạng thái để log
  getStatus() {
    return `state=${this.state}, failureCount=${this.failureCount}, successCount=${this.successCount}, halfOpenFailureCount=${this.halfOpenFailureCount}`;
  }
}

module.exports = CircuitBreaker;