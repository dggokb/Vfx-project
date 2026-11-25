el('smokeForm').value='jump';
el('plumes').value='1';
el('kind').value='Fumaça';
el('kind').dispatchEvent(new Event('input'));
requestAnimationFrame(tick)
