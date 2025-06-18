function waitForDOMAndInject() {
    document.addEventListener('DOMContentLoaded', () => {
      setupFocusHandler();
    });
  
    // Some sites load late or are single-page apps
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setupFocusHandler();
    }
  }
  
  function setupFocusHandler() {
    document.addEventListener('focusin', (e) => {
      const el = e.target;
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        document.querySelector('#emailTemplateBtn')?.remove();
  
        const btn = document.createElement('button');
        btn.textContent = '📄 Insert Template';
        btn.id = 'emailTemplateBtn';
        btn.style.position = 'absolute';
        btn.style.zIndex = 10000;
        btn.style.padding = '4px 8px';
        btn.style.fontSize = '12px';
        btn.style.background = '#1976d2';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
  
        // Position near the input
        const rect = el.getBoundingClientRect();
        btn.style.top = `${rect.top + window.scrollY - 30}px`;
        btn.style.left = `${rect.left + window.scrollX}px`;
  
        document.body.appendChild(btn);
  
        btn.onclick = () => {
          const templates = [{ name: "Intro", content: "Hi there,\n\nThanks for reaching out!" }];
          el.value += templates[0].content;
        };
      }
    });
  }
  
  waitForDOMAndInject();
  