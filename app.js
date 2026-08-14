(() => {
  const $ = (id) => document.getElementById(id);
  const root = document.documentElement;
  const STORAGE_THEME = 'bst-media-theme';
  const STORAGE_PRESETS = 'bst-media-presets-v1';
  const STORAGE_BITRATE_UNIT = 'bst-media-bitrate-unit';
  const STORAGE_CAMERA_RECENTS = 'bst-media-camera-recents-v1';

  const state = {
    mode: 'card',
    bitrateUnit: localStorage.getItem(STORAGE_BITRATE_UNIT) === 'MBps' ? 'MBps' : 'Mbps',
    cameraPreset: null,
  };

  const defaults = {
    card: { bitrate: 250, capacity: 160, margin: 10 },
    shoot: { bitrate: 250, hours: 3, days: 4, margin: 20, copies: 2 },
    copy: { volume: 780, unit: 'GB', speed: 650, efficiency: 75, copies: 1 }
  };

  const PRORES_TARGET_1080_2997 = {
    'ProRes 422 HQ': 220,
    'ProRes 422': 147,
    'ProRes 422 LT': 102,
    'ProRes 422 Proxy': 45,
    'ProRes 4444': 330,
    'ProRes 4444 XQ': 500,
  };

  const sonyAllI4K = {
    kind: 'fixed',
    rates: { '23.98': 240, '24': 240, '25': 250, '29.97': 300, '50': 500, '59.94': 600 },
    note: 'All-Intra · 4:2:2 10 bit'
  };
  const sonyAllIHD = {
    kind: 'fixed',
    rates: { '23.98': 89, '25': 93, '29.97': 111, '50': 185, '59.94': 222 },
    note: 'All-Intra · 4:2:2 10 bit'
  };
  const sonyS4K = {
    kind: 'fixed',
    rates: { '23.98': 100, '25': 140, '29.97': 140, '50': 200, '59.94': 200, '100': 280, '119.88': 280 },
    note: 'Long GOP · 4:2:2 10 bit'
  };
  const sonyHS4K = {
    kind: 'fixed',
    rates: { '23.98': 100, '50': 200, '59.94': 200, '100': 280, '119.88': 280 },
    note: 'HEVC Long GOP · 4:2:2 10 bit'
  };
  const sonySHD = {
    kind: 'fixed',
    rates: { '23.98': 50, '25': 50, '29.97': 50, '50': 50, '59.94': 50, '100': 100, '119.88': 100 },
    note: 'Long GOP · preset 4:2:2 10 bit / débit haut'
  };

  function sonyMirrorCamera(codecNames = { allI:'XAVC S-I', long:'XAVC S', hs:'XAVC HS' }) {
    return {
      'DCI 4K': { width:4096, height:2160, codecs: { [codecNames.allI]: sonyAllI4K } },
      'UHD 4K': { width:3840, height:2160, codecs: {
        [codecNames.allI]: sonyAllI4K,
        [codecNames.long]: sonyS4K,
        [codecNames.hs]: sonyHS4K,
      }},
      'HD': { width:1920, height:1080, codecs: {
        [codecNames.allI]: sonyAllIHD,
        [codecNames.long]: sonySHD,
      }},
    };
  }

  function proResSpec(name, note='ProRes · débit cible VBR') {
    return { kind:'prores', target1080:PRORES_TARGET_1080_2997[name], note };
  }
  function brawSpec(baseFps, baseMBps, note='Blackmagic RAW · débit constant') {
    return { kind:'scaledMBps', baseFps, baseMBps, note };
  }

  const CAMERA_DB = {
    'SONY': {
      'FX30': sonyMirrorCamera(),
      'FX3': sonyMirrorCamera(),
      'FX5': sonyMirrorCamera({ allI:'XAVC S-I', long:'XAVC S-L 422', hs:'XAVC HS-L 422' }),
      'FX6': {
        'DCI 4K': { width:4096, height:2160, codecs:{ 'XAVC-I': sonyAllI4K } },
        'UHD 4K': { width:3840, height:2160, codecs:{
          'XAVC-I': sonyAllI4K,
          'XAVC-L': { kind:'fixed', rates:{ '23.98':100, '25':100, '29.97':100, '50':150, '59.94':150 }, note:'Long GOP · VBR' }
        }},
        'HD': { width:1920, height:1080, codecs:{
          'XAVC-I': sonyAllIHD,
          'XAVC-L 50': { kind:'fixed', rates:{ '23.98':50, '25':50, '29.97':50, '50':50, '59.94':50 }, note:'Long GOP · VBR · 50 Mb/s max' },
          'XAVC-L 35': { kind:'fixed', rates:{ '23.98':35, '25':35, '29.97':35, '50':35, '59.94':35 }, note:'Long GOP · VBR · 35 Mb/s max' },
        }},
      },
    },
    'ARRI': {
      'ALEXA 35': {
        '4.6K Open Gate': { width:4608, height:3164, codecs:{
          'ProRes 422 HQ': proResSpec('ProRes 422 HQ'), 'ProRes 4444': proResSpec('ProRes 4444'), 'ProRes 4444 XQ': proResSpec('ProRes 4444 XQ')
        }, fps:['24','25','30','48','50','60'] },
        '4K 16:9': { width:4096, height:2304, codecs:{
          'ProRes 422 HQ': proResSpec('ProRes 422 HQ'), 'ProRes 4444': proResSpec('ProRes 4444'), 'ProRes 4444 XQ': proResSpec('ProRes 4444 XQ')
        }, fps:['24','25','30','48','50','60','75','100'] },
        'UHD': { width:3840, height:2160, codecs:{
          'ProRes 422 HQ': proResSpec('ProRes 422 HQ'), 'ProRes 4444': proResSpec('ProRes 4444'), 'ProRes 4444 XQ': proResSpec('ProRes 4444 XQ')
        }, fps:['24','25','30','48','50','60','100','120'] },
        'HD': { width:1920, height:1080, codecs:{
          'ProRes 422 HQ': proResSpec('ProRes 422 HQ'), 'ProRes 4444': proResSpec('ProRes 4444'), 'ProRes 4444 XQ': proResSpec('ProRes 4444 XQ')
        }, fps:['24','25','30','48','50','60','100','120'] },
      },
      'ALEXA Mini LF': {
        '4.5K Open Gate': { width:4448, height:3096, codecs:{
          'ProRes 422 HQ': proResSpec('ProRes 422 HQ'), 'ProRes 4444': proResSpec('ProRes 4444'), 'ProRes 4444 XQ': proResSpec('ProRes 4444 XQ')
        }, fps:['24','25','30','40'] },
        'UHD': { width:3840, height:2160, codecs:{
          'ProRes 422 HQ': proResSpec('ProRes 422 HQ'), 'ProRes 4444': proResSpec('ProRes 4444'), 'ProRes 4444 XQ': proResSpec('ProRes 4444 XQ')
        }, fps:['24','25','30','48','50','60'] },
        'HD': { width:1920, height:1080, codecs:{
          'ProRes 422 HQ': proResSpec('ProRes 422 HQ'), 'ProRes 4444': proResSpec('ProRes 4444'), 'ProRes 4444 XQ': proResSpec('ProRes 4444 XQ')
        }, fps:['24','25','30','48','50','60','75','90'] },
      },
    },
    'BLACKMAGIC': {
      'Cinema 4K': {
        '4K DCI': { width:4096, height:2160, fps:['24','25','30','50','60'], codecs:{
          'BRAW 3:1': brawSpec(30,136), 'BRAW 5:1': brawSpec(30,82), 'BRAW 8:1': brawSpec(30,51), 'BRAW 12:1': brawSpec(30,35),
          'ProRes 422 HQ': proResSpec('ProRes 422 HQ'), 'ProRes 422': proResSpec('ProRes 422'), 'ProRes 422 LT': proResSpec('ProRes 422 LT'), 'ProRes Proxy': proResSpec('ProRes 422 Proxy')
        }},
        'UHD': { width:3840, height:2160, fps:['24','25','30','50','60'], codecs:{
          'BRAW 3:1': brawSpec(30,127), 'BRAW 5:1': brawSpec(30,77), 'BRAW 8:1': brawSpec(30,48), 'BRAW 12:1': brawSpec(30,32),
          'ProRes 422 HQ': proResSpec('ProRes 422 HQ'), 'ProRes 422': proResSpec('ProRes 422'), 'ProRes 422 LT': proResSpec('ProRes 422 LT'), 'ProRes Proxy': proResSpec('ProRes 422 Proxy')
        }},
        'HD': { width:1920, height:1080, fps:['24','25','30','50','60','100','120'], codecs:{
          'BRAW 3:1': brawSpec(30,33), 'BRAW 5:1': brawSpec(30,20), 'BRAW 8:1': brawSpec(30,13), 'BRAW 12:1': brawSpec(30,8.4),
          'ProRes 422 HQ': proResSpec('ProRes 422 HQ'), 'ProRes 422': proResSpec('ProRes 422'), 'ProRes 422 LT': proResSpec('ProRes 422 LT'), 'ProRes Proxy': proResSpec('ProRes 422 Proxy')
        }},
      },
      'Cinema 6K': {
        '6K': { width:6144, height:3456, fps:['24','25','30','50'], codecs:{
          'BRAW 3:1': brawSpec(30,323), 'BRAW 5:1': brawSpec(30,194), 'BRAW 8:1': brawSpec(30,121), 'BRAW 12:1': brawSpec(30,81)
        }},
        '4K DCI': { width:4096, height:2160, fps:['24','25','30','50','60'], codecs:{
          'BRAW 3:1': brawSpec(30,136), 'BRAW 5:1': brawSpec(30,82), 'BRAW 8:1': brawSpec(30,51), 'BRAW 12:1': brawSpec(30,35),
          'ProRes 422 HQ': proResSpec('ProRes 422 HQ'), 'ProRes 422': proResSpec('ProRes 422'), 'ProRes 422 LT': proResSpec('ProRes 422 LT'), 'ProRes Proxy': proResSpec('ProRes 422 Proxy')
        }},
        'UHD': { width:3840, height:2160, fps:['24','25','30','50','60'], codecs:{
          'ProRes 422 HQ': proResSpec('ProRes 422 HQ'), 'ProRes 422': proResSpec('ProRes 422'), 'ProRes 422 LT': proResSpec('ProRes 422 LT'), 'ProRes Proxy': proResSpec('ProRes 422 Proxy')
        }},
        'HD': { width:1920, height:1080, fps:['24','25','30','50','60'], codecs:{
          'ProRes 422 HQ': proResSpec('ProRes 422 HQ'), 'ProRes 422': proResSpec('ProRes 422'), 'ProRes 422 LT': proResSpec('ProRes 422 LT'), 'ProRes Proxy': proResSpec('ProRes 422 Proxy')
        }},
      },
      'URSA Mini Pro 4.6K': {
        '4.6K': { width:4608, height:2592, fps:['24','25','30','50','60','100','120'], codecs:{
          'BRAW 3:1': brawSpec(30,183), 'BRAW 5:1': brawSpec(30,110), 'BRAW 8:1': brawSpec(30,68), 'BRAW 12:1': brawSpec(30,46),
          'ProRes 422 HQ': proResSpec('ProRes 422 HQ'), 'ProRes 422': proResSpec('ProRes 422'), 'ProRes 422 LT': proResSpec('ProRes 422 LT'), 'ProRes Proxy': proResSpec('ProRes 422 Proxy')
        }},
        'UHD': { width:3840, height:2160, fps:['24','25','30','50','60','100','120'], codecs:{
          'BRAW 3:1': brawSpec(30,127), 'BRAW 5:1': brawSpec(30,76), 'BRAW 8:1': brawSpec(30,48), 'BRAW 12:1': brawSpec(30,32),
          'ProRes 422 HQ': proResSpec('ProRes 422 HQ'), 'ProRes 422': proResSpec('ProRes 422'), 'ProRes 422 LT': proResSpec('ProRes 422 LT'), 'ProRes Proxy': proResSpec('ProRes 422 Proxy')
        }},
        'HD': { width:1920, height:1080, fps:['24','25','30','50','60','100','120'], codecs:{
          'BRAW 3:1': brawSpec(30,33), 'BRAW 5:1': brawSpec(30,20), 'BRAW 8:1': brawSpec(30,12), 'BRAW 12:1': brawSpec(30,8),
          'ProRes 422 HQ': proResSpec('ProRes 422 HQ'), 'ProRes 422': proResSpec('ProRes 422'), 'ProRes 422 LT': proResSpec('ProRes 422 LT'), 'ProRes Proxy': proResSpec('ProRes 422 Proxy')
        }},
      },
      'URSA Mini Pro 12K': {
        '12K': { width:12288, height:6480, fps:['24','25','30','50','60'], codecs:{
          'BRAW 5:1': brawSpec(24,578), 'BRAW 8:1': brawSpec(24,361), 'BRAW 12:1': brawSpec(24,241), 'BRAW 18:1': brawSpec(24,160)
        }},
        '8K': { width:8192, height:4320, fps:['24','25','30','50','60','100','120'], codecs:{
          'BRAW 5:1': brawSpec(24,257), 'BRAW 8:1': brawSpec(24,161), 'BRAW 12:1': brawSpec(24,107), 'BRAW 18:1': brawSpec(24,71)
        }},
        '6K S16': { width:6144, height:3240, fps:['24','25','30','50','60','100','120'], codecs:{
          'BRAW 5:1': brawSpec(24,146), 'BRAW 8:1': brawSpec(24,91), 'BRAW 12:1': brawSpec(24,61), 'BRAW 18:1': brawSpec(24,40)
        }},
        '4K': { width:4096, height:2160, fps:['24','25','30','50','60','100','120'], codecs:{
          'BRAW 5:1': brawSpec(24,161), 'BRAW 8:1': brawSpec(24,107), 'BRAW 12:1': brawSpec(24,80), 'BRAW 18:1': brawSpec(24,53)
        }},
      },
    },
  };

  const wizardState = { brand:null, camera:null, resolution:null, codec:null, fps:null };

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
    updateCameraPresetSummary();
    renderCameraWizard();
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

  function cameraRateFor(selection) {
    const mode = CAMERA_DB?.[selection.brand]?.[selection.camera]?.[selection.resolution];
    const spec = mode?.codecs?.[selection.codec];
    const fps = Number(selection.fps);
    if (!mode || !spec || !fps) return null;
    if (spec.kind === 'fixed') return Number(spec.rates[String(selection.fps)] ?? spec.rates[selection.fps]);
    if (spec.kind === 'scaledMBps') return spec.baseMBps * 8 * (fps / spec.baseFps);
    if (spec.kind === 'prores') {
      const pixelRatio = (mode.width * mode.height) / (1920 * 1080);
      return spec.target1080 * pixelRatio * (fps / 29.97);
    }
    return null;
  }

  function cameraSelectionLabel(sel) {
    return `${sel.camera} · ${sel.resolution} · ${sel.codec} · ${sel.fps}p`;
  }

  function cameraSelectionNote(sel) {
    const mode = CAMERA_DB?.[sel.brand]?.[sel.camera]?.[sel.resolution];
    return mode?.codecs?.[sel.codec]?.note || '';
  }

  function cameraFpsList(mode, spec) {
    if (spec.kind === 'fixed') return Object.keys(spec.rates);
    return mode.fps || ['24','25','30','50','60'];
  }

  function makeWizardChip(value, active, extra='') {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.value = value;
    btn.textContent = `${value}${extra}`;
    btn.classList.toggle('active', active);
    return btn;
  }

  function renderCameraWizard() {
    const brandBox = $('cameraBrandChips');
    brandBox.innerHTML = '';
    Object.keys(CAMERA_DB).forEach(brand => brandBox.appendChild(makeWizardChip(brand, wizardState.brand === brand)));

    const modelStep = $('cameraModelStep');
    const modelBox = $('cameraModelChips');
    modelBox.innerHTML = '';
    if (wizardState.brand) {
      Object.keys(CAMERA_DB[wizardState.brand]).forEach(camera => modelBox.appendChild(makeWizardChip(camera, wizardState.camera === camera)));
      modelStep.hidden = false;
    } else modelStep.hidden = true;

    const resolutionStep = $('cameraResolutionStep');
    const resolutionBox = $('cameraResolutionChips');
    resolutionBox.innerHTML = '';
    const camera = wizardState.brand && wizardState.camera ? CAMERA_DB[wizardState.brand][wizardState.camera] : null;
    if (camera) {
      Object.keys(camera).forEach(res => resolutionBox.appendChild(makeWizardChip(res, wizardState.resolution === res)));
      resolutionStep.hidden = false;
    } else resolutionStep.hidden = true;

    const codecStep = $('cameraCodecStep');
    const codecBox = $('cameraCodecChips');
    codecBox.innerHTML = '';
    const mode = camera && wizardState.resolution ? camera[wizardState.resolution] : null;
    if (mode) {
      Object.keys(mode.codecs).forEach(codec => codecBox.appendChild(makeWizardChip(codec, wizardState.codec === codec)));
      codecStep.hidden = false;
    } else codecStep.hidden = true;

    const fpsStep = $('cameraFpsStep');
    const fpsBox = $('cameraFpsChips');
    fpsBox.innerHTML = '';
    const spec = mode && wizardState.codec ? mode.codecs[wizardState.codec] : null;
    if (spec) {
      cameraFpsList(mode, spec).forEach(fps => fpsBox.appendChild(makeWizardChip(fps, String(wizardState.fps) === String(fps), 'p')));
      fpsStep.hidden = false;
    } else fpsStep.hidden = true;

    const rate = cameraRateFor(wizardState);
    const result = $('cameraChoiceResult');
    const useBtn = $('useCameraPresetBtn');
    if (rate) {
      $('cameraChoiceLabel').textContent = cameraSelectionLabel(wizardState);
      $('cameraChoiceBitrate').textContent = formatBitrate(rate);
      $('cameraChoiceNote').textContent = cameraSelectionNote(wizardState);
      result.hidden = false;
      useBtn.disabled = false;
    } else {
      result.hidden = true;
      useBtn.disabled = true;
    }
    renderCameraRecents();
  }

  function loadCameraRecents() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_CAMERA_RECENTS) || '[]');
      return Array.isArray(raw) ? raw.filter(x => x && x.brand && x.camera && x.resolution && x.codec && x.fps && Number(x.bitrate) > 0).slice(0,3) : [];
    } catch { return []; }
  }

  function saveCameraRecent(preset) {
    const recents = loadCameraRecents().filter(r => cameraSelectionLabel(r) !== cameraSelectionLabel(preset));
    recents.unshift(preset);
    localStorage.setItem(STORAGE_CAMERA_RECENTS, JSON.stringify(recents.slice(0,3)));
    renderCameraRecents();
  }

  function renderCameraRecents() {
    const recents = loadCameraRecents();
    const block = $('cameraRecentBlock');
    const box = $('cameraRecentChips');
    box.innerHTML = '';
    block.hidden = recents.length === 0;
    recents.forEach((preset, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.recentIndex = String(index);
      btn.innerHTML = `<strong>${preset.camera} · ${preset.resolution}</strong><small>${preset.codec} · ${preset.fps}p</small>`;
      box.appendChild(btn);
    });
  }

  function updateCameraPresetSummary() {
    if (!state.cameraPreset) {
      $('cameraPresetSummary').textContent = 'Choisir une caméra';
      $('cameraPresetSummaryDetail').textContent = 'Sony · ARRI · Blackmagic';
      return;
    }
    $('cameraPresetSummary').textContent = cameraSelectionLabel(state.cameraPreset);
    $('cameraPresetSummaryDetail').textContent = formatBitrate(state.cameraPreset.bitrate);
  }

  function clearCameraPreset() {
    state.cameraPreset = null;
    updateCameraPresetSummary();
  }

  function applyCameraPreset(preset, closeDialog = true) {
    const bitrate = Number(preset.bitrate || cameraRateFor(preset));
    if (!bitrate) return;
    const full = { ...preset, bitrate };
    state.cameraPreset = full;
    setBitrateInputFromMbps(bitrate);
    $('presetSelect').value = '';
    $('deletePresetBtn').disabled = true;
    updateCameraPresetSummary();
    saveCameraRecent(full);
    updateAll();
    if (closeDialog && $('cameraPresetDialog').open) $('cameraPresetDialog').close();
  }

  function openCameraWizard() {
    Object.assign(wizardState, { brand:null, camera:null, resolution:null, codec:null, fps:null });
    if (state.cameraPreset) {
      Object.assign(wizardState, {
        brand:state.cameraPreset.brand, camera:state.cameraPreset.camera, resolution:state.cameraPreset.resolution,
        codec:state.cameraPreset.codec, fps:state.cameraPreset.fps
      });
    }
    renderCameraWizard();
    $('cameraPresetDialog').showModal();
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
    clearCameraPreset();
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
  $('cameraPresetBtn').addEventListener('click', openCameraWizard);

  $('cameraBrandChips').addEventListener('click', e => {
    const btn = e.target.closest('button[data-value]'); if (!btn) return;
    Object.assign(wizardState, { brand:btn.dataset.value, camera:null, resolution:null, codec:null, fps:null }); renderCameraWizard();
  });
  $('cameraModelChips').addEventListener('click', e => {
    const btn = e.target.closest('button[data-value]'); if (!btn) return;
    Object.assign(wizardState, { camera:btn.dataset.value, resolution:null, codec:null, fps:null }); renderCameraWizard();
  });
  $('cameraResolutionChips').addEventListener('click', e => {
    const btn = e.target.closest('button[data-value]'); if (!btn) return;
    Object.assign(wizardState, { resolution:btn.dataset.value, codec:null, fps:null }); renderCameraWizard();
  });
  $('cameraCodecChips').addEventListener('click', e => {
    const btn = e.target.closest('button[data-value]'); if (!btn) return;
    Object.assign(wizardState, { codec:btn.dataset.value, fps:null }); renderCameraWizard();
  });
  $('cameraFpsChips').addEventListener('click', e => {
    const btn = e.target.closest('button[data-value]'); if (!btn) return;
    wizardState.fps = btn.dataset.value; renderCameraWizard();
  });
  $('useCameraPresetBtn').addEventListener('click', () => {
    const bitrate = cameraRateFor(wizardState); if (!bitrate) return;
    applyCameraPreset({ ...wizardState, bitrate });
  });
  $('cameraRecentChips').addEventListener('click', e => {
    const btn = e.target.closest('button[data-recent-index]'); if (!btn) return;
    const preset = loadCameraRecents()[Number(btn.dataset.recentIndex)]; if (preset) applyCameraPreset(preset);
  });
  document.querySelectorAll('[data-close-dialog]').forEach(btn => btn.addEventListener('click', () => $(btn.dataset.closeDialog).close()));
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); }));

  $('bitrateChips').addEventListener('click', e => {
    const btn = e.target.closest('button[data-value]');
    if (!btn) return;
    setBitrateInputFromMbps(Number(btn.dataset.value));
    clearCameraPreset();
    $('presetSelect').value = '';
    $('deletePresetBtn').disabled = true;
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
    clearCameraPreset();
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
    clearCameraPreset();
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
    clearCameraPreset();
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
  setTheme(storedTheme || 'light');
  syncBitrateUnitUI();
  setBitrateInputFromMbps(250);
  renderCameraWizard();
  updateCameraPresetSummary();
  renderPresets();
  switchMode('card');
  updateAll();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
})();
