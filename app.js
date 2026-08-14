(() => {
  const $ = (id) => document.getElementById(id);
  const root = document.documentElement;
  const STORAGE_THEME = 'bst-media-theme';
  const STORAGE_PRESETS = 'bst-media-presets-v1';
  const STORAGE_BITRATE_UNIT = 'bst-media-bitrate-unit';

  const state = {
    mode: 'card',
    bitrateUnit: localStorage.getItem(STORAGE_BITRATE_UNIT) === 'MBps' ? 'MBps' : 'Mbps',
  };

  const defaults = {
    card: { bitrate: 250, capacity: 160, margin: 10 },
    shoot: { bitrate: 250, hours: 3, days: 4, margin: 20, copies: 2 },
    copy: { volume: 780, unit: 'GB', speed: 650, efficiency: 75, copies: 1 }
  };

  const CAMERA_PRESETS = [
    // Sony FX6 — official Sony 4K recording bitrates
    { camera: 'Sony FX6', name: 'XAVC-I 4K · 23.98/24p', bitrate: 240 },
    { camera: 'Sony FX6', name: 'XAVC-I 4K · 25p', bitrate: 250 },
    { camera: 'Sony FX6', name: 'XAVC-I 4K · 29.97p', bitrate: 300 },
    { camera: 'Sony FX6', name: 'XAVC-I 4K · 50p', bitrate: 500 },
    { camera: 'Sony FX6', name: 'XAVC-I 4K · 59.94p', bitrate: 600 },
    { camera: 'Sony FX6', name: 'XAVC-L 4K · 23.98/25/29.97p', bitrate: 100 },
    { camera: 'Sony FX6', name: 'XAVC-L 4K · 50/59.94p', bitrate: 150 },

    // Sony FX3 — main 4K 10-bit 4:2:2 formats
    { camera: 'Sony FX3', name: 'XAVC S-I 4K · 23.98/24p', bitrate: 240 },
    { camera: 'Sony FX3', name: 'XAVC S-I 4K · 25p', bitrate: 250 },
    { camera: 'Sony FX3', name: 'XAVC S-I 4K · 29.97p', bitrate: 300 },
    { camera: 'Sony FX3', name: 'XAVC S-I 4K · 50p', bitrate: 500 },
    { camera: 'Sony FX3', name: 'XAVC S-I 4K · 59.94p', bitrate: 600 },
    { camera: 'Sony FX3', name: 'XAVC S 4K 422 10b · 23.98p', bitrate: 100 },
    { camera: 'Sony FX3', name: 'XAVC S 4K 422 10b · 25/29.97p', bitrate: 140 },
    { camera: 'Sony FX3', name: 'XAVC S 4K 422 10b · 50/59.94p', bitrate: 200 },
    { camera: 'Sony FX3', name: 'XAVC S 4K 422 10b · 100/119.88p', bitrate: 280 },
    { camera: 'Sony FX3', name: 'XAVC HS 4K 422 10b · 23.98p (High)', bitrate: 100 },
    { camera: 'Sony FX3', name: 'XAVC HS 4K 422 10b · 50/59.94p (High)', bitrate: 200 },
    { camera: 'Sony FX3', name: 'XAVC HS 4K 422 10b · 100/119.88p', bitrate: 280 },

    // Sony FX5 — current official Sony XAVC settings. X-OCN intentionally excluded here:
    // its effective rate varies with LT/C1/C2 + imager mode + project frame rate.
    { camera: 'Sony FX5', name: 'XAVC S-I 4K · 23.98/24p', bitrate: 240 },
    { camera: 'Sony FX5', name: 'XAVC S-I 4K · 25p', bitrate: 250 },
    { camera: 'Sony FX5', name: 'XAVC S-I 4K · 29.97p', bitrate: 300 },
    { camera: 'Sony FX5', name: 'XAVC S-I 4K · 50p', bitrate: 500 },
    { camera: 'Sony FX5', name: 'XAVC S-I 4K · 59.94p', bitrate: 600 },
    { camera: 'Sony FX5', name: 'XAVC S-L 422 4K · 23.98p', bitrate: 100 },
    { camera: 'Sony FX5', name: 'XAVC S-L 422 4K · 25/29.97p', bitrate: 140 },
    { camera: 'Sony FX5', name: 'XAVC S-L 422 4K · 50/59.94p', bitrate: 200 },
    { camera: 'Sony FX5', name: 'XAVC S-L 422 4K · 100/119.88p', bitrate: 280 },
    { camera: 'Sony FX5', name: 'XAVC HS-L 422 4K · 23.98p (High)', bitrate: 100 },
    { camera: 'Sony FX5', name: 'XAVC HS-L 422 4K · 50/59.94p (High)', bitrate: 200 },
    { camera: 'Sony FX5', name: 'XAVC HS-L 422 4K · 100/119.88p', bitrate: 280 }
  ];

  function clampNumber(value, fallback, min = 0, max = Infinity) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function formatNumber(value, digits = 1) {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value);
  }

  function formatStorage(gb, digits = 2) {
    if (!Number.isFinite(gb) || gb < 0) return '—';
    if (gb >= 1000) return `${formatNumber(gb / 1000, digits)} To`;
    return `${formatNumber(gb, gb < 10 ? 2 : 1)} Go`;
  }

  function formatDuration(seconds, roundToMinute = true) {
    if (!Number.isFinite(seconds) || seconds < 0) return '—';
    if (seconds < 60 && !roundToMinute) return `${Math.max(1, Math.round(seconds))} s`;
    let mins = roundToMinute ? Math.round(seconds / 60) : Math.floor(seconds / 60);
    if (mins < 60) return `${Math.max(1, mins)} min`;
    const hours = Math.floor(mins / 60);
    mins %= 60;
    if (!mins) return `${hours} h`;
    return `${hours} h ${String(mins).padStart(2, '0')} min`;
  }

  function formatHours(hours) {
    if (!Number.isFinite(hours)) return '—';
    if (Math.abs(hours - Math.round(hours)) < 0.001) return `${Math.round(hours)} h`;
    return `${formatNumber(hours, 2)} h`;
  }

  function setActiveChip(container, value) {
    if (!container) return;
    [...container.querySelectorAll('button[data-value]')].forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.value) === Number(value));
    });
  }

  function bitrateUnitLabel() {
    return state.bitrateUnit === 'MBps' ? 'MB/s' : 'Mb/s';
  }

  function bitrateToDisplay(mbps) {
    return state.bitrateUnit === 'MBps' ? mbps / 8 : mbps;
  }

  function bitrateToMbps(value) {
    return state.bitrateUnit === 'MBps' ? value * 8 : value;
  }

  function inputNumber(value, digits = 2) {
    const rounded = Number(value.toFixed(digits));
    return String(rounded);
  }

  function getBitrate() {
    const fallbackDisplay = bitrateToDisplay(250);
    const displayValue = clampNumber($('bitrateInput').value, fallbackDisplay, 0.01, 100000);
    return bitrateToMbps(displayValue);
  }

  function setBitrateInputFromMbps(mbps) {
    $('bitrateInput').value = inputNumber(bitrateToDisplay(mbps));
  }

  function formatBitrate(mbps) {
    const display = bitrateToDisplay(mbps);
    return `${formatNumber(display, state.bitrateUnit === 'MBps' ? 2 : 2)} ${bitrateUnitLabel()}`;
  }

  function syncBitrateUnitUI() {
    $('bitrateUnitLabel').textContent = bitrateUnitLabel();
    $('presetBitrateUnit').textContent = bitrateUnitLabel();
    [...$('bitrateUnit').querySelectorAll('button[data-unit]')].forEach(btn => {
      btn.classList.toggle('active', btn.dataset.unit === state.bitrateUnit);
    });
    [...$('bitrateChips').querySelectorAll('button[data-value]')].forEach(btn => {
      btn.textContent = inputNumber(bitrateToDisplay(Number(btn.dataset.value)));
    });
  }

  function setBitrateUnit(unit) {
    const currentMbps = getBitrate();
    state.bitrateUnit = unit === 'MBps' ? 'MBps' : 'Mbps';
    localStorage.setItem(STORAGE_BITRATE_UNIT, state.bitrateUnit);
    syncBitrateUnitUI();
    setBitrateInputFromMbps(currentMbps);
    renderCameraPresets();
    renderPresets();
    updateAll();
  }

  function syncBitrateChip() {
    setActiveChip($('bitrateChips'), getBitrate());
  }

  function updateCard() {
    const bitrate = getBitrate();
    const capacity = clampNumber($('cardCapacity').value, 160, 0.1, 100000);
    const margin = clampNumber($('cardMargin').value, 10, 0, 50);
    const seconds = capacity * 8000 / bitrate;
    const perMinuteGB = bitrate * 60 / 8000;
    const perHourGB = bitrate * 3600 / 8000;
    const usableGB = capacity * (1 - margin / 100);
    const safeSeconds = usableGB * 8000 / bitrate;

    $('cardResult').textContent = formatDuration(seconds);
    $('cardState').textContent = `CARTE ${formatStorage(capacity, 1)} · ${formatBitrate(bitrate)}`;
    $('cardDetail').textContent = `≈ ${formatNumber(seconds / 60, 0)} min au total`;
    $('cardPerMinute').textContent = formatStorage(perMinuteGB, 2);
    $('cardPerHour').textContent = formatStorage(perHourGB, 1);
    $('cardSafe').textContent = formatDuration(safeSeconds);
    $('cardUsable').textContent = formatStorage(usableGB, 1);
    setActiveChip($('cardCapacityChips'), capacity);
  }

  function nextDriveSizeTB(requiredGB) {
    const sizes = [0.25, 0.5, 1, 2, 4, 8, 12, 16, 20, 24, 32];
    const requiredTB = requiredGB / 1000;
    return sizes.find(v => v >= requiredTB) || Math.ceil(requiredTB / 8) * 8;
  }

  function updateShoot() {
    const bitrate = getBitrate();
    const hours = clampNumber($('shootHours').value, 3, 0.1, 1000);
    const days = clampNumber($('shootDays').value, 4, 1, 1000);
    const margin = clampNumber($('shootMargin').value, 20, 0, 100);
    const copies = Math.round(clampNumber($('shootCopies').value, 2, 1, 5));
    const totalHours = hours * days;
    const rawGB = bitrate * totalHours * 3600 / 8000;
    const perCopyGB = rawGB * (1 + margin / 100);
    const totalGB = perCopyGB * copies;
    const driveTB = nextDriveSizeTB(perCopyGB);

    $('shootResult').textContent = formatStorage(perCopyGB, 2);
    $('shootState').textContent = `PAR COPIE · MARGE TOURNAGE ${formatNumber(margin, 0)} %`;
    $('shootDetail').textContent = `${formatHours(totalHours)} de rushes · ${formatStorage(rawGB, 2)} de données brutes`;
    $('shootRaw').textContent = formatStorage(rawGB, 2);
    $('shootPerCopy').textContent = formatStorage(perCopyGB, 2);
    $('shootTotal').textContent = formatStorage(totalGB, 2);
    $('shootDuration').textContent = formatHours(totalHours);

    const rec = $('shootRecommendation');
    rec.querySelector('strong').textContent = `${copies} × SSD ${formatNumber(driveTB, driveTB < 1 ? 2 : 0)} To`;
    rec.querySelector('small').textContent = copies === 2 ? 'pour MASTER + BACKUP' : `pour ${copies} copie${copies > 1 ? 's' : ''} indépendante${copies > 1 ? 's' : ''}`;
  }

  function updateCopy() {
    const volume = clampNumber($('copyVolume').value, 780, 0.1, 1000000);
    const unit = $('copyVolumeUnit').value;
    const volumeGB = unit === 'TB' ? volume * 1000 : volume;
    const speed = clampNumber($('copySpeed').value, 650, 1, 100000);
    const efficiency = clampNumber($('copyEfficiency').value, 75, 10, 100);
    const copies = Math.round(clampNumber($('copyCount').value, 1, 1, 5));
    const theorySeconds = volumeGB * 1000 / speed;
    const realSeconds = theorySeconds / (efficiency / 100);
    const totalSeconds = realSeconds * copies;
    const effective = speed * efficiency / 100;

    $('copyResult').textContent = formatDuration(realSeconds);
    $('copyState').textContent = `ESTIMATION RÉALISTE · ${formatNumber(efficiency, 0)} %`;
    $('copyDetail').textContent = `${formatStorage(volumeGB, 2)} à ${formatNumber(speed, 0)} Mo/s`;
    $('copyTheory').textContent = formatDuration(theorySeconds);
    $('copyReal').textContent = formatDuration(realSeconds);
    $('copyEffective').textContent = `${formatNumber(effective, 0)} Mo/s`;
    $('copyAll').textContent = formatDuration(totalSeconds);
    setActiveChip($('copyVolumeChips'), volumeGB);
    setActiveChip($('copySpeedChips'), speed);
  }

  function updateAll() {
    syncBitrateChip();
    updateCard();
    updateShoot();
    updateCopy();
  }

  function switchMode(mode) {
    state.mode = mode;
    [...$('modeTabs').querySelectorAll('button[data-mode]')].forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
    document.querySelectorAll('[data-mode-content]').forEach(section => {
      const active = section.dataset.modeContent === mode;
      section.hidden = !active;
      section.classList.toggle('active', active);
    });
    $('bitratePanel').hidden = mode === 'copy';
  }


  function setTheme(theme) {
    const dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    $('themeToggle').textContent = dark ? 'LIGHT' : 'DARK';
    $('themeColor').setAttribute('content', dark ? '#111315' : '#F3F1EC');
    localStorage.setItem(STORAGE_THEME, dark ? 'dark' : 'light');
  }

  function loadPresets() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_PRESETS) || '[]');
      return Array.isArray(raw) ? raw.filter(p => p && typeof p.name === 'string' && Number(p.bitrate) > 0) : [];
    } catch { return []; }
  }

  function savePresets(presets) {
    localStorage.setItem(STORAGE_PRESETS, JSON.stringify(presets));
    renderPresets();
  }

  function renderCameraPresets() {
    const select = $('cameraPresetSelect');
    const current = select.value;
    select.innerHTML = '<option value="">Sony FX6 / FX3 / FX5…</option>';
    const cameras = [...new Set(CAMERA_PRESETS.map(p => p.camera))];
    cameras.forEach(camera => {
      const group = document.createElement('optgroup');
      group.label = camera;
      CAMERA_PRESETS.forEach((p, index) => {
        if (p.camera !== camera) return;
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = `${p.name} · ${formatBitrate(p.bitrate)}`;
        group.appendChild(option);
      });
      select.appendChild(group);
    });
    if (current !== '' && CAMERA_PRESETS[Number(current)]) select.value = current;
  }

  function renderPresets() {
    const select = $('presetSelect');
    const current = select.value;
    const presets = loadPresets();
    select.innerHTML = '<option value="">Mes presets…</option>';
    presets.forEach((p, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = `${p.name} · ${formatBitrate(Number(p.bitrate))}`;
      select.appendChild(option);
    });
    if (current && presets[Number(current)]) select.value = current;
    $('deletePresetBtn').disabled = !select.value;
  }

  function resetMode(mode) {
    if (mode === 'card') {
      setBitrateInputFromMbps(defaults.card.bitrate);
      $('cardCapacity').value = defaults.card.capacity;
      $('cardMargin').value = defaults.card.margin;
    } else if (mode === 'shoot') {
      setBitrateInputFromMbps(defaults.shoot.bitrate);
      $('shootHours').value = defaults.shoot.hours;
      $('shootDays').value = defaults.shoot.days;
      $('shootMargin').value = defaults.shoot.margin;
      $('shootCopies').value = defaults.shoot.copies;
    } else if (mode === 'copy') {
      $('copyVolume').value = defaults.copy.volume;
      $('copyVolumeUnit').value = defaults.copy.unit;
      $('copySpeed').value = defaults.copy.speed;
      $('copyEfficiency').value = defaults.copy.efficiency;
      $('copyCount').value = defaults.copy.copies;
    }
    $('cameraPresetSelect').value = '';
    $('presetSelect').value = '';
    $('deletePresetBtn').disabled = true;
    updateAll();
  }

  $('modeTabs').addEventListener('click', e => {
    const btn = e.target.closest('button[data-mode]');
    if (btn) switchMode(btn.dataset.mode);
  });

  $('bitrateUnit').addEventListener('click', e => {
    const btn = e.target.closest('button[data-unit]');
    if (btn && btn.dataset.unit !== state.bitrateUnit) setBitrateUnit(btn.dataset.unit);
  });

  $('themeToggle').addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  $('tipsBtn').addEventListener('click', () => $('tipsDialog').showModal());
  document.querySelectorAll('[data-close-dialog]').forEach(btn => btn.addEventListener('click', () => $(btn.dataset.closeDialog).close()));
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); }));

  $('bitrateChips').addEventListener('click', e => {
    const btn = e.target.closest('button[data-value]');
    if (!btn) return;
    setBitrateInputFromMbps(Number(btn.dataset.value));
    $('cameraPresetSelect').value = '';
    $('presetSelect').value = '';
    $('deletePresetBtn').disabled = true;
    updateAll();
  });

  $('cameraPresetSelect').addEventListener('change', () => {
    const index = $('cameraPresetSelect').value;
    if (index === '') return;
    const preset = CAMERA_PRESETS[Number(index)];
    if (!preset) return;
    $('presetSelect').value = '';
    $('deletePresetBtn').disabled = true;
    setBitrateInputFromMbps(Number(preset.bitrate));
    updateAll();
  });

  $('cardCapacityChips').addEventListener('click', e => {
    const btn = e.target.closest('button[data-value]');
    if (!btn) return;
    $('cardCapacity').value = btn.dataset.value;
    updateCard();
  });

  $('copyVolumeChips').addEventListener('click', e => {
    const btn = e.target.closest('button[data-value]');
    if (!btn) return;
    const volumeGB = Number(btn.dataset.value);
    if (volumeGB >= 1000) {
      $('copyVolume').value = inputNumber(volumeGB / 1000);
      $('copyVolumeUnit').value = 'TB';
    } else {
      $('copyVolume').value = inputNumber(volumeGB);
      $('copyVolumeUnit').value = 'GB';
    }
    updateCopy();
  });

  $('copySpeedChips').addEventListener('click', e => {
    const btn = e.target.closest('button[data-value]');
    if (!btn) return;
    $('copySpeed').value = btn.dataset.value;
    updateCopy();
  });

  $('bitrateInput').addEventListener('input', () => {
    $('cameraPresetSelect').value = '';
    $('presetSelect').value = '';
    $('deletePresetBtn').disabled = true;
    updateAll();
  });

  const liveInputs = ['cardCapacity','cardMargin','shootHours','shootDays','shootMargin','shootCopies','copyVolume','copyVolumeUnit','copySpeed','copyEfficiency','copyCount'];
  liveInputs.forEach(id => $(id).addEventListener('input', updateAll));
  $('copyVolumeUnit').addEventListener('change', updateCopy);

  document.querySelectorAll('[data-reset]').forEach(btn => btn.addEventListener('click', () => resetMode(btn.dataset.reset)));

  $('addPresetBtn').addEventListener('click', () => {
    $('presetName').value = '';
    $('presetBitrate').value = inputNumber(bitrateToDisplay(getBitrate()));
    $('presetBitrateUnit').textContent = bitrateUnitLabel();
    $('presetDialog').showModal();
    setTimeout(() => $('presetName').focus(), 50);
  });

  $('presetForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('presetName').value.trim();
    const presetDisplay = clampNumber($('presetBitrate').value, bitrateToDisplay(getBitrate()), 0.01, 100000);
    const bitrate = bitrateToMbps(presetDisplay);
    if (!name) return;
    const presets = loadPresets();
    presets.push({ name, bitrate });
    savePresets(presets);
    setBitrateInputFromMbps(bitrate);
    $('presetDialog').close();
    renderPresets();
    $('cameraPresetSelect').value = '';
    $('presetSelect').value = String(presets.length - 1);
    $('deletePresetBtn').disabled = false;
    updateAll();
  });

  $('presetSelect').addEventListener('change', () => {
    const index = $('presetSelect').value;
    $('deletePresetBtn').disabled = index === '';
    if (index === '') return;
    const preset = loadPresets()[Number(index)];
    if (!preset) return;
    $('cameraPresetSelect').value = '';
    setBitrateInputFromMbps(Number(preset.bitrate));
    updateAll();
  });

  $('deletePresetBtn').addEventListener('click', () => {
    const index = $('presetSelect').value;
    if (index === '') return;
    const presets = loadPresets();
    presets.splice(Number(index), 1);
    savePresets(presets);
    $('presetSelect').value = '';
    $('deletePresetBtn').disabled = true;
  });

  const storedTheme = localStorage.getItem(STORAGE_THEME);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(storedTheme || (prefersDark ? 'dark' : 'light'));
  syncBitrateUnitUI();
  setBitrateInputFromMbps(250);
  renderCameraPresets();
  renderPresets();
  switchMode('card');
  updateAll();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
})();
