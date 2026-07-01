// Constants for wave animation behavior
const WAVE_THRESH = 3;
const CHAR_MULT = 3;
const ANIM_STEP = 40;
const WAVE_BUF = 5;

/**
 * 2D ASCII ripple animation instance for a container and background canvas
 */
const createASCIIShift2D = (container, opts = {}) => {
  let isAnim = false;
  let waves = [];
  let animId = null;
  let charsData = [];
  
  // Canvas background
  const canvas = document.getElementById('bg-ascii-canvas');
  let ctx = null;
  let grid = [];
  const CELL_SIZE = 16; // 16px grid for background ASCII
  
  // options
  const cfg = {
    dur: 1000,
    chars: '.,·-─~+:;=*π""┐┌┘┴┬╗╔╝╚╬╠╣╩╦║░▒▓█▄▀▌▐■!?&#$@0123456789*',
    preserveSpaces: true,
    spread: 1,
    ...opts
  };

  const initCanvas = () => {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', () => {
        clearTimeout(canvas.resizeTimeout);
        canvas.resizeTimeout = setTimeout(resizeCanvas, 200);
    });
  };

  const resizeCanvas = () => {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    grid = [];
    const cols = Math.ceil(canvas.width / CELL_SIZE);
    const rows = Math.ceil(canvas.height / CELL_SIZE);
    
    // Fill the background grid
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid.push({
                x: i * CELL_SIZE + CELL_SIZE/2,
                y: j * CELL_SIZE + CELL_SIZE/2,
                origChar: ' ' // Invisible until glitched
            });
        }
    }
  };

  // Setup: wrap every character in a span to track its 2D position
  const setupChars = () => {
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      let node;
      while(node = walker.nextNode()) {
          if(node.textContent.trim().length > 0) {
              textNodes.push(node);
          }
      }
      
      textNodes.forEach(node => {
          const text = node.textContent;
          const words = text.split(/(\s+)/); // split by whitespace but keep it
          const frag = document.createDocumentFragment();
          
          words.forEach(word => {
              if (word.length === 0) return;
              if (/^\s+$/.test(word)) {
                  frag.appendChild(document.createTextNode(word));
              } else {
                  const wordSpan = document.createElement('span');
                  wordSpan.className = 'ascii-word';
                  wordSpan.style.display = 'inline-block';
                  wordSpan.style.whiteSpace = 'nowrap';
                  
                  for (let i = 0; i < word.length; i++) {
                      const span = document.createElement('span');
                      span.className = 'ascii-char';
                      span.textContent = word[i];
                      span.style.display = 'inline-block';
                      span.style.textAlign = 'center';
                      wordSpan.appendChild(span);
                  }
                  frag.appendChild(wordSpan);
              }
          });
          node.parentNode.replaceChild(frag, node);
      });
      
      // Lock the width of each word to prevent layout shifting when chars scramble
      setTimeout(() => {
          container.querySelectorAll('.ascii-word').forEach(word => {
              const rect = word.getBoundingClientRect();
              word.style.width = `${rect.width}px`;
          });
          // Now measure positions after layout is locked
          updateCharPositions();
      }, 50);
  };
  
  const updateCharPositions = () => {
      charsData = [];
      const spans = container.querySelectorAll('.ascii-char');
      
      spans.forEach(span => {
          const rect = span.getBoundingClientRect();
          charsData.push({
              el: span,
              origChar: span.textContent,
              // Store document-relative coordinates to handle scrolling
              docX: rect.left + window.scrollX + rect.width / 2,
              docY: rect.top + window.scrollY + rect.height / 2,
              x: 0,
              y: 0
          });
      });
  };

  /**
   * Starts a new wave animation from current cursor pos
   */
  const startWave = (mouseX, mouseY) => {
    waves.push({
      startX: mouseX,
      startY: mouseY,
      startTime: Date.now(),
      id: Math.random()
    });

    if (!isAnim) start();
  };

  /**
   * Clean up expired waves that have exceeded their duration
   */
  const cleanupWaves = (t) => {
    waves = waves.filter((w) => t - w.startTime < cfg.dur);
  };

  /**
   * Calculates wave fx for a character
   */
  const calcWaveEffect = (charData, t) => {
    let shouldAnim = false;
    let resultChar = charData.origChar;
    let minIntens = Infinity;
    let maxDampen = 0;

    for (const w of waves) {
      if (Math.abs(charData.y - w.startY) > 15) continue;
        
      const pixelDist = Math.abs(charData.x - w.startX);
      // Limit range to ~250px, ends smoothly with dampening
      if (pixelDist > 250) continue;
      
      const dampen = Math.max(0, 1 - (pixelDist / 250));
      
      const age = t - w.startTime;
      
      // Wave travels at 600px per second for a wider, faster spread
      const waveRadius = (age / 1000) * 600;
      const distFromLeadingEdge = waveRadius - pixelDist;

      if (distFromLeadingEdge >= 0) {
        shouldAnim = true;
        const intens = distFromLeadingEdge;
        
        // Use the freshest wave (minimum intensity) to allow interruptions
        if (intens < minIntens) {
            minIntens = intens;
            maxDampen = dampen;
            
            // Glitch active for the first 30px of the wave
            if (intens <= 30) {
              const charIdx =
                (Math.floor(pixelDist * 0.5) + Math.floor(age / 40)) % cfg.chars.length;
              resultChar = cfg.chars[charIdx];
            } else {
              resultChar = charData.origChar;
            }
        }
      }
    }

    return { shouldAnim, char: resultChar, intens: minIntens === Infinity ? 0 : minIntens, dampen: maxDampen };
  };

  /**
   * Stops the animation and resets to original text
   */
  const stop = () => {
    charsData.forEach(c => {
        if (c.el.textContent !== c.origChar) {
            c.el.textContent = c.origChar;
        }
    });
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    container.classList.remove("as");
    isAnim = false;
  };

  /**
   * Start the animation loop
   */
  const start = () => {
    if (isAnim) return;

    isAnim = true;
    container.classList.add("as");

    const animate = () => {
      const t = Date.now();

      // Clean up expired waves first
      cleanupWaves(t);

      if (waves.length === 0) {
        stop();
        return;
      }

      // Generate scrambled text in DOM
      charsData.forEach((c) => {
          // Dynamically compute current viewport position based on scroll
          c.x = c.docX - window.scrollX;
          c.y = c.docY - window.scrollY;
          
          const res = calcWaveEffect(c, t);
          const targetChar = res.shouldAnim ? res.char : c.origChar;
          if (c.el.textContent !== targetChar) {
              c.el.textContent = targetChar;
          }
          
          if (res.shouldAnim && res.intens > 0) {
             const fadePx = 150; // 150px of wave travel to fade out
             
             if (res.intens <= 30) {
                // Solid green during glitch, but dampened near the 250px edge
                c.el.style.color = `color-mix(in srgb, hsl(142, 100%, 30%) ${Math.round(res.dampen * 100)}%, currentColor)`;
             } else if (res.intens < 30 + fadePx) {
                const fadeProg = (res.intens - 30) / fadePx;
                
                if (fadeProg < 0.2) {
                    // Quick pop from White into Green
                    const localProg = fadeProg / 0.2;
                    const mixColor = `color-mix(in srgb, hsl(142, 100%, 30%) ${Math.round(localProg * 100)}%, #ffffff)`;
                    c.el.style.color = `color-mix(in srgb, ${mixColor} ${Math.round(res.dampen * 100)}%, currentColor)`;
                } else {
                    // Slow fade from Green into original font color
                    const localProg = (fadeProg - 0.2) / 0.8;
                    const greenIntensity = (1 - localProg) * res.dampen;
                    c.el.style.color = `color-mix(in srgb, hsl(142, 100%, 30%) ${Math.round(greenIntensity * 100)}%, currentColor)`;
                }
             } else {
                if (c.el.style.color !== '') c.el.style.color = '';
             }
          } else {
             if (c.el.style.color !== '') c.el.style.color = '';
          }
      });
      
      // Draw background ASCII in canvas
      if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.font = 'bold 16px "Courier New", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          grid.forEach((c) => {
              const res = calcWaveEffect(c, t);
              if (res.shouldAnim && res.intens > 0) {
                 const fadePx = 150;
                 let fillStyle = '';
                 
                 if (res.intens <= 30) {
                    // Solid dark green during glitch
                    fillStyle = `rgba(0, 153, 51, ${res.dampen})`;
                 } else if (res.intens < 30 + fadePx) {
                    const fadeProg = (res.intens - 30) / fadePx;
                    
                    if (fadeProg < 0.2) {
                        const localProg = fadeProg / 0.2;
                        // White to Dark Green
                        const r = Math.round(255 * (1 - localProg) + 0 * localProg);
                        const g = Math.round(255 * (1 - localProg) + 153 * localProg);
                        const b = Math.round(255 * (1 - localProg) + 51 * localProg);
                        fillStyle = `rgba(${r}, ${g}, ${b}, ${res.dampen})`;
                    } else {
                        // Dark Green to Transparent
                        const localProg = (fadeProg - 0.2) / 0.8;
                        const greenIntensity = (1 - localProg) * res.dampen;
                        fillStyle = `rgba(0, 153, 51, ${greenIntensity})`;
                    }
                 }
                 
                 if (fillStyle !== '') {
                     ctx.fillStyle = fillStyle;
                     ctx.fillText(res.char, c.x, c.y);
                 }
              }
          });
      }
      
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
  };

  /**
   * Event handlers
   */
  let lastX = -1;
  let lastY = -1;
  
  const handleEnter = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    lastX = x;
    lastY = y;
    startWave(x, y);
  };

  const handleMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Only trigger new wave if mouse moved significantly (e.g. > 10px) to prevent spamming
    if (Math.abs(x - lastX) > 10 || Math.abs(y - lastY) > 10) {
        startWave(x, y);
        lastX = x;
        lastY = y;
    }
  };

  const handleLeave = () => {
    // Let the wave finish organically
  };

  /**
   * Initializes event listeners
   */
  const init = () => {
    initCanvas();
    setupChars();
    
    const events = [
      ["mouseenter", handleEnter],
      ["mousemove", handleMove],
      ["mouseleave", handleLeave]
    ];
    // Listen on the document so the wave tracks the mouse everywhere!
    events.forEach(([evt, handler]) => document.addEventListener(evt, handler));
    
    window.addEventListener('resize', () => {
        clearTimeout(container.resizeTimeout);
        container.resizeTimeout = setTimeout(updateCharPositions, 200);
    });
  };

  /**
   * Destroys the instance and cleans up event listeners
   */
  const destroy = () => {
    waves = [];
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    stop();
    ["mouseenter", "mousemove", "mouseleave"].forEach((evt, i) =>
      document.removeEventListener(evt, [handleEnter, handleMove, handleLeave][i])
    );
  };

  // Initialize the instance
  init();

  // public API
  return { destroy };
};

/**
 * Initialize animation for the about container
 */
const initASCIIShift = () => {
  const container = document.getElementById('about-text-container');
  if (!container) return;
  
  createASCIIShift2D(container, { dur: 1000, spread: 1 });
};

// Start when DOM is fully loaded and text is injected
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initASCIIShift, 150);
});
