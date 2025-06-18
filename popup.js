const templateContent = document.getElementById('templateContent');
const saveTemplate = document.getElementById('saveTemplate');
const injectTemplate = document.getElementById('injectTemplate');
const templateList = document.getElementById('templateList');

function loadTemplates() {
  chrome.storage.local.get(['templates'], (res) => {
    const templates = res.templates || [];
    templateList.innerHTML = ''; // Clear existing options
    templates.forEach((t, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = t.name;
      templateList.appendChild(opt);
    });
  });
}

saveTemplate.addEventListener('click', () => {
  const name = prompt('Template name:');
  if (!name || !templateContent.value) return;
  chrome.storage.local.get(['templates'], (res) => {
    const templates = res.templates || [];
    templates.push({ name, content: templateContent.value });
    chrome.storage.local.set({ templates }, loadTemplates);
    templateContent.value = '';
  });
});

injectTemplate.addEventListener('click', () => {
  const index = templateList.value;
  chrome.storage.local.get(['templates'], (res) => {
    if (res.templates && res.templates[index]) {
      const content = res.templates[index].content;
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (injectedContent) => {
            const active = document.activeElement;
            if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT')) {
              active.value += injectedContent;
            } else {
              alert("Click inside a textbox or textarea before injecting!");
            }
          },
          args: [content]
        });
      });
    }
  });
});

document.addEventListener('DOMContentLoaded', loadTemplates);
