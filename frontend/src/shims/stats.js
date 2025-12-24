// Lightweight shim for stats.js so that @react-three/drei's Stats import
// does not break Vite's native ESM handling. We do not actually use <Stats />
// in this project, so a no-op implementation is sufficient.

export default class StatsMock {
  constructor() {
    this.dom = document.createElement('div');
  }
  begin() {}
  end() {}
  update() {}
}
