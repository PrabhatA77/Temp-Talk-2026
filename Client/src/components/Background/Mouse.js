export default class Mouse {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.isDown = false;

    // Standard Mouse Events
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mouseup", this.handleMouseUp);

    // NEW: Mobile Touch Events
    window.addEventListener("touchstart", this.handleTouchStart, { passive: false });
    window.addEventListener("touchmove", this.handleTouchMove, { passive: false });
    window.addEventListener("touchend", this.handleMouseUp); 
  }

  handleMouseMove = (event) => {
    this.x = event.clientX;
    this.y = event.clientY;
  };

  // Handle the first tap on the screen
  handleTouchStart = (event) => {
    this.x = event.touches[0].clientX;
    this.y = event.touches[0].clientY;
    this.isDown = true; // Triggers the ripple effect!
  };

  // Handle dragging a finger across the screen
  handleTouchMove = (event) => {
    this.x = event.touches[0].clientX;
    this.y = event.touches[0].clientY;
  };

  handleMouseDown = () => {
    this.isDown = true;
  };

  handleMouseUp = () => {
    this.isDown = false;
  };

  destroy() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mouseup", this.handleMouseUp);
    
    // Clean up touch events
    window.removeEventListener("touchstart", this.handleTouchStart);
    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleMouseUp);
  }
}