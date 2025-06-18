// Function to display a selection popover for templates
function showTemplateSelection(btn, targetElement) {
    // Remove any existing selection UI
    const existingSelection = document.querySelector('#templateSelection');
    if (existingSelection) {
      existingSelection.remove();
    }

    // Create container with modern clean styling
    const container = document.createElement('div');
    container.id = 'templateSelection';
    Object.assign(container.style, {
      position: 'absolute',
      zIndex: 100000,
      background: '#ffffff',
      border: '1px solid #e0e0e0',
      padding: '8px',
      borderRadius: '6px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
      width: '220px',
      overflow: 'hidden'
    });

    // Position container right under the floating button
    const rect = btn.getBoundingClientRect();
    container.style.top = rect.bottom + window.scrollY + 4 + 'px';
    container.style.left = rect.left + window.scrollX + 'px';

    // Create a preview area at the top of the container
    const preview = document.createElement('div');
    preview.id = 'templatePreview';
    Object.assign(preview.style, {
      padding: '6px 8px',
      marginBottom: '8px',
      fontSize: '13px',
      color: '#555',
      background: '#f9f9f9',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      height: '80px',
      overflow: 'auto'
    });
    preview.textContent = 'Hover over a template to preview its content.';
    container.appendChild(preview);

    // Load saved templates from chrome.storage.local
    chrome.storage.local.get(['templates'], (res) => {
      const templates = res.templates || [];
      if (templates.length === 0) {
        const noTemplatesMsg = document.createElement('div');
        noTemplatesMsg.textContent = 'No templates saved.';
        noTemplatesMsg.style.color = '#757575';
        noTemplatesMsg.style.fontSize = '14px';
        container.appendChild(noTemplatesMsg);
      } else {
        templates.forEach((template) => {
          const templateButton = document.createElement('button');
          templateButton.textContent = template.name;
          // Clean, modern styling for each template button
          Object.assign(templateButton.style, {
            display: 'block',
            width: '100%',
            background: 'none',
            color: '#424242',
            border: 'none',
            textAlign: 'left',
            padding: '6px 8px',
            margin: '4px 0',
            fontSize: '14px',
            cursor: 'pointer',
            outline: 'none'
          });
          // Add hover effect and preview update
          templateButton.addEventListener('mouseenter', () => {
            preview.textContent = template.content;
            templateButton.style.background = '#f5f5f5';
          });
          templateButton.addEventListener('mouseleave', () => {
            preview.textContent = 'Hover over a template to preview its content.';
            templateButton.style.background = 'none';
          });
          // On click, insert the template content into the target field and remove the popover
          templateButton.addEventListener('click', () => {
            insertTemplateIntoField(template.content, targetElement); // Use the generic insert function
            container.remove();
            btn.remove(); // Also remove the insert button
            document.removeEventListener('click', outsideClickListener);
          });
          container.appendChild(templateButton);
        });
      }
    });

    // Add event listener to close the dropdown and remove the insert button when clicking outside of it
    const outsideClickListener = (event) => {
      if (!container.contains(event.target) && event.target !== btn) {
        container.remove();
        btn.remove(); // Remove the insert button as well
        document.removeEventListener('click', outsideClickListener);
      }
    };

    // Add the listener after a short delay to avoid immediate removal when clicking the button itself
    setTimeout(() => {
      document.addEventListener('click', outsideClickListener);
    }, 0);

    document.body.appendChild(container);
}

// Function to insert the template into a generic text field (input, textarea, or contenteditable)
function insertTemplateIntoField(templateContent, targetElement) {
  if (targetElement.tagName === 'TEXTAREA' || targetElement.tagName === 'INPUT') {
    // For textarea and input, insert content directly into the value
    targetElement.value += templateContent;
  } else if (targetElement.isContentEditable) {
    // For contenteditable elements, use innerHTML
    targetElement.innerHTML += templateContent;
  }
}

// Function to set up the floating button on focus
function setupFocusHandler() {
    let focusedElement = null;
  
    document.addEventListener('focusin', (e) => {
      const el = e.target;
      if (el.isContentEditable || el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        focusedElement = el;
  
        // Remove existing UI
        const existingBtn = document.querySelector('#emailTemplateBtn');
        if (existingBtn) existingBtn.remove();
        const existingSelection = document.querySelector('#templateSelection');
        if (existingSelection) existingSelection.remove();
  
        // Create insert button
        const btn = document.createElement('button');
        btn.textContent = 'ℹ️';
        btn.id = 'emailTemplateBtn';
        Object.assign(btn.style, {
          position: 'absolute',
          zIndex: 99999,
          padding: '6px 10px',
          fontSize: '13px',
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        });
  
        const rect = el.getBoundingClientRect();
        btn.style.top = (rect.bottom + window.scrollY + 4) + 'px';
        btn.style.left = (rect.left + window.scrollX) + 'px';
  
        document.body.appendChild(btn);
  
        // Only remove the button if clicked outside both the input and the button
        const generalOutsideClickListener = (event) => {
          if (
            event.target !== btn &&
            event.target !== focusedElement &&
            !btn.contains(event.target)
          ) {
            btn.remove();
            document.removeEventListener('click', generalOutsideClickListener);
          }
        };
  
        // Add listener after a short delay
        setTimeout(() => {
          document.addEventListener('click', generalOutsideClickListener);
        }, 0);
  
        // Button click opens dropdown
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          showTemplateSelection(btn, el);
        };
      }
    });
  }
  

// Set up once the DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setupFocusHandler();
} else {
  document.addEventListener('DOMContentLoaded', setupFocusHandler);
}
