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
    card: { bitrate: 250, capacity: 160, margin: 0 },
    shoot: { bitrate: 250, hours: 3, days: 4, margin: 20, copies: 2 },
    copy: { volume: 780, unit: 'GB', speed: 650, efficiency: 75, copies: 1 }
  };

  const CAMERA_DB_URL="https://raw.githubusercontent.com/BrunoOnSet/BOS-CAMERA-DB/main/cameras.json";
  const CAMERA_DB_CACHE_KEY = "bos-camera-db-cache-v1";
  const FALLBACK_SHARED_CAMERA_DB = {"schemaVersion":1,"databaseVersion":"1.1","updated":"2026-08-18","cameras":[{"id":"fx30","name":"Sony FX30","brand":"Sony","group":"SONY","sensorWidthMm":23.3,"dof":{"label":"Super 35 / APS-C","cocMm":0.019,"cropToFF":1.5},"media":{"label":"FX30","modes":{"DCI 4K":{"width":4096,"height":2160,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"24":240,"25":250,"50":500,"23.98":240,"29.97":300,"59.94":600},"note":"All-Intra · 4:2:2 10 bit"}}},"UHD 4K":{"width":3840,"height":2160,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"24":240,"25":250,"50":500,"23.98":240,"29.97":300,"59.94":600},"note":"All-Intra · 4:2:2 10 bit"},"XAVC S":{"kind":"fixed","rates":{"25":140,"50":200,"100":280,"23.98":100,"29.97":140,"59.94":200,"119.88":280},"note":"Long GOP · 4:2:2 10 bit"},"XAVC HS":{"kind":"fixed","rates":{"50":200,"100":280,"23.98":100,"59.94":200,"119.88":280},"note":"HEVC Long GOP · 4:2:2 10 bit"}}},"HD":{"width":1920,"height":1080,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"25":93,"50":185,"23.98":89,"29.97":111,"59.94":222},"note":"All-Intra · 4:2:2 10 bit"},"XAVC S":{"kind":"fixed","rates":{"25":50,"50":50,"100":100,"23.98":50,"29.97":50,"59.94":50,"119.88":100},"note":"Long GOP · preset 4:2:2 10 bit / débit haut"}}}}}},{"id":"fx3","name":"Sony FX3","brand":"Sony","group":"SONY","sensorWidthMm":35.6,"dof":{"label":"Full Frame","cocMm":0.029,"cropToFF":1.0},"media":{"label":"FX3","modes":{"DCI 4K":{"width":4096,"height":2160,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"24":240,"25":250,"50":500,"23.98":240,"29.97":300,"59.94":600},"note":"All-Intra · 4:2:2 10 bit"}}},"UHD 4K":{"width":3840,"height":2160,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"24":240,"25":250,"50":500,"23.98":240,"29.97":300,"59.94":600},"note":"All-Intra · 4:2:2 10 bit"},"XAVC S":{"kind":"fixed","rates":{"25":140,"50":200,"100":280,"23.98":100,"29.97":140,"59.94":200,"119.88":280},"note":"Long GOP · 4:2:2 10 bit"},"XAVC HS":{"kind":"fixed","rates":{"50":200,"100":280,"23.98":100,"59.94":200,"119.88":280},"note":"HEVC Long GOP · 4:2:2 10 bit"}}},"HD":{"width":1920,"height":1080,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"25":93,"50":185,"23.98":89,"29.97":111,"59.94":222},"note":"All-Intra · 4:2:2 10 bit"},"XAVC S":{"kind":"fixed","rates":{"25":50,"50":50,"100":100,"23.98":50,"29.97":50,"59.94":50,"119.88":100},"note":"Long GOP · preset 4:2:2 10 bit / débit haut"}}}}}},{"id":"fx5","name":"Sony FX5","brand":"Sony","group":"SONY","sensorWidthMm":35.9,"dof":{"label":"Full Frame","cocMm":0.029,"cropToFF":1.0},"media":{"label":"FX5","modes":{"DCI 4K":{"width":4096,"height":2160,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"24":240,"25":250,"50":500,"23.98":240,"29.97":300,"59.94":600},"note":"All-Intra · 4:2:2 10 bit"}}},"UHD 4K":{"width":3840,"height":2160,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"24":240,"25":250,"50":500,"23.98":240,"29.97":300,"59.94":600},"note":"All-Intra · 4:2:2 10 bit"},"XAVC S-L 422":{"kind":"fixed","rates":{"25":140,"50":200,"100":280,"23.98":100,"29.97":140,"59.94":200,"119.88":280},"note":"Long GOP · 4:2:2 10 bit"},"XAVC HS-L 422":{"kind":"fixed","rates":{"50":200,"100":280,"23.98":100,"59.94":200,"119.88":280},"note":"HEVC Long GOP · 4:2:2 10 bit"}}},"HD":{"width":1920,"height":1080,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"25":93,"50":185,"23.98":89,"29.97":111,"59.94":222},"note":"All-Intra · 4:2:2 10 bit"},"XAVC S-L 422":{"kind":"fixed","rates":{"25":50,"50":50,"100":100,"23.98":50,"29.97":50,"59.94":50,"119.88":100},"note":"Long GOP · preset 4:2:2 10 bit / débit haut"}}}}}},{"id":"fx6","name":"Sony FX6","brand":"Sony","group":"SONY","sensorWidthMm":35.6,"dof":{"label":"Full Frame","cocMm":0.029,"cropToFF":1.0},"media":{"label":"FX6","modes":{"DCI 4K":{"width":4096,"height":2160,"codecs":{"XAVC-I":{"kind":"fixed","rates":{"24":240,"25":250,"50":500,"23.98":240,"29.97":300,"59.94":600},"note":"All-Intra · 4:2:2 10 bit"}}},"UHD 4K":{"width":3840,"height":2160,"codecs":{"XAVC-I":{"kind":"fixed","rates":{"24":240,"25":250,"50":500,"23.98":240,"29.97":300,"59.94":600},"note":"All-Intra · 4:2:2 10 bit"},"XAVC-L":{"kind":"fixed","rates":{"25":100,"50":150,"23.98":100,"29.97":100,"59.94":150},"note":"Long GOP · VBR"}}},"HD":{"width":1920,"height":1080,"codecs":{"XAVC-I":{"kind":"fixed","rates":{"25":93,"50":185,"23.98":89,"29.97":111,"59.94":222},"note":"All-Intra · 4:2:2 10 bit"},"XAVC-L 50":{"kind":"fixed","rates":{"25":50,"50":50,"23.98":50,"29.97":50,"59.94":50},"note":"Long GOP · VBR · 50 Mb/s max"},"XAVC-L 35":{"kind":"fixed","rates":{"25":35,"50":35,"23.98":35,"29.97":35,"59.94":35},"note":"Long GOP · VBR · 35 Mb/s max"}}}}}},{"id":"vraptor","name":"RED V-RAPTOR VV","brand":"RED","group":"ARRI / RED","sensorWidthMm":40.96,"dof":{"label":"Vista Vision","cocMm":0.033,"cropToFF":0.88}},{"id":"miniLF","name":"ARRI ALEXA Mini LF","brand":"ARRI","group":"ARRI / RED","sensorWidthMm":36.7,"dof":{"label":"Large Format","cocMm":0.03,"cropToFF":0.98},"media":{"label":"ALEXA Mini LF","modes":{"4.5K Open Gate":{"width":4448,"height":3096,"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 4444":{"kind":"prores","target1080":330,"note":"ProRes · débit cible VBR"},"ProRes 4444 XQ":{"kind":"prores","target1080":500,"note":"ProRes · débit cible VBR"}},"fps":["24","25","30","40"]},"UHD":{"width":3840,"height":2160,"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 4444":{"kind":"prores","target1080":330,"note":"ProRes · débit cible VBR"},"ProRes 4444 XQ":{"kind":"prores","target1080":500,"note":"ProRes · débit cible VBR"}},"fps":["24","25","30","48","50","60"]},"HD":{"width":1920,"height":1080,"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 4444":{"kind":"prores","target1080":330,"note":"ProRes · débit cible VBR"},"ProRes 4444 XQ":{"kind":"prores","target1080":500,"note":"ProRes · débit cible VBR"}},"fps":["24","25","30","48","50","60","75","90"]}}}},{"id":"alexa35","name":"ARRI ALEXA 35","brand":"ARRI","group":"ARRI / RED","sensorWidthMm":27.99,"dof":{"label":"Super 35","cocMm":0.023,"cropToFF":1.29},"media":{"label":"ALEXA 35","modes":{"4.6K Open Gate":{"width":4608,"height":3164,"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 4444":{"kind":"prores","target1080":330,"note":"ProRes · débit cible VBR"},"ProRes 4444 XQ":{"kind":"prores","target1080":500,"note":"ProRes · débit cible VBR"}},"fps":["24","25","30","48","50","60"]},"4K 16:9":{"width":4096,"height":2304,"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 4444":{"kind":"prores","target1080":330,"note":"ProRes · débit cible VBR"},"ProRes 4444 XQ":{"kind":"prores","target1080":500,"note":"ProRes · débit cible VBR"}},"fps":["24","25","30","48","50","60","75","100"]},"UHD":{"width":3840,"height":2160,"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 4444":{"kind":"prores","target1080":330,"note":"ProRes · débit cible VBR"},"ProRes 4444 XQ":{"kind":"prores","target1080":500,"note":"ProRes · débit cible VBR"}},"fps":["24","25","30","48","50","60","100","120"]},"HD":{"width":1920,"height":1080,"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 4444":{"kind":"prores","target1080":330,"note":"ProRes · débit cible VBR"},"ProRes 4444 XQ":{"kind":"prores","target1080":500,"note":"ProRes · débit cible VBR"}},"fps":["24","25","30","48","50","60","100","120"]}}}},{"id":"bmpcc4k","name":"Blackmagic Pocket Cinema Camera 4K","brand":"Blackmagic","group":"BLACKMAGIC","sensorWidthMm":18.96,"sensorHeightMm":10.0,"dof":{"label":"Four Thirds","cocMm":0.014,"cropToFF":1.9},"media":{"label":"Cinema 4K","modes":{"4K DCI":{"width":4096,"height":2160,"fps":["24","25","30","50","60"],"codecs":{"BRAW 3:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":136,"note":"Blackmagic RAW · débit constant"},"BRAW 5:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":82,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":51,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":35,"note":"Blackmagic RAW · débit constant"},"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}},"UHD":{"width":3840,"height":2160,"fps":["24","25","30","50","60"],"codecs":{"BRAW 3:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":127,"note":"Blackmagic RAW · débit constant"},"BRAW 5:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":77,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":48,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":32,"note":"Blackmagic RAW · débit constant"},"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}},"HD":{"width":1920,"height":1080,"fps":["24","25","30","50","60","100","120"],"codecs":{"BRAW 3:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":33,"note":"Blackmagic RAW · débit constant"},"BRAW 5:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":20,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":13,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":8.4,"note":"Blackmagic RAW · débit constant"},"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}}}}},{"id":"bmpcc6k","name":"Blackmagic Pocket Cinema Camera 6K","brand":"Blackmagic","group":"BLACKMAGIC","sensorWidthMm":23.1,"sensorHeightMm":12.99,"dof":{"label":"Super 35","cocMm":0.018,"cropToFF":1.56},"media":{"label":"Cinema 6K","modes":{"6K":{"width":6144,"height":3456,"fps":["24","25","30","50"],"codecs":{"BRAW 3:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":323,"note":"Blackmagic RAW · débit constant"},"BRAW 5:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":194,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":121,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":81,"note":"Blackmagic RAW · débit constant"}}},"4K DCI":{"width":4096,"height":2160,"fps":["24","25","30","50","60"],"codecs":{"BRAW 3:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":136,"note":"Blackmagic RAW · débit constant"},"BRAW 5:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":82,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":51,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":35,"note":"Blackmagic RAW · débit constant"},"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}},"UHD":{"width":3840,"height":2160,"fps":["24","25","30","50","60"],"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}},"HD":{"width":1920,"height":1080,"fps":["24","25","30","50","60"],"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}}}}},{"id":"ursamp46kg2","name":"Blackmagic URSA Mini Pro 4.6K G2","brand":"Blackmagic","group":"BLACKMAGIC","sensorWidthMm":25.34,"sensorHeightMm":14.25,"dof":{"label":"Super 35","cocMm":0.019,"cropToFF":1.42},"media":{"label":"URSA Mini Pro 4.6K","modes":{"4.6K":{"width":4608,"height":2592,"fps":["24","25","30","50","60","100","120"],"codecs":{"BRAW 3:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":183,"note":"Blackmagic RAW · débit constant"},"BRAW 5:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":110,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":68,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":46,"note":"Blackmagic RAW · débit constant"},"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}},"UHD":{"width":3840,"height":2160,"fps":["24","25","30","50","60","100","120"],"codecs":{"BRAW 3:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":127,"note":"Blackmagic RAW · débit constant"},"BRAW 5:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":76,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":48,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":32,"note":"Blackmagic RAW · débit constant"},"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}},"HD":{"width":1920,"height":1080,"fps":["24","25","30","50","60","100","120"],"codecs":{"BRAW 3:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":33,"note":"Blackmagic RAW · débit constant"},"BRAW 5:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":20,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":12,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":8,"note":"Blackmagic RAW · débit constant"},"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}}}}},{"id":"ursamp12k","name":"Blackmagic URSA Mini Pro 12K","brand":"Blackmagic","group":"BLACKMAGIC","sensorWidthMm":27.03,"sensorHeightMm":14.25,"dof":{"label":"Super 35","cocMm":0.02,"cropToFF":1.33},"media":{"label":"URSA Mini Pro 12K","modes":{"12K":{"width":12288,"height":6480,"fps":["24","25","30","50","60"],"codecs":{"BRAW 5:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":578,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":361,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":241,"note":"Blackmagic RAW · débit constant"},"BRAW 18:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":160,"note":"Blackmagic RAW · débit constant"}}},"8K":{"width":8192,"height":4320,"fps":["24","25","30","50","60","100","120"],"codecs":{"BRAW 5:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":257,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":161,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":107,"note":"Blackmagic RAW · débit constant"},"BRAW 18:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":71,"note":"Blackmagic RAW · débit constant"}}},"6K S16":{"width":6144,"height":3240,"fps":["24","25","30","50","60","100","120"],"codecs":{"BRAW 5:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":146,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":91,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":61,"note":"Blackmagic RAW · débit constant"},"BRAW 18:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":40,"note":"Blackmagic RAW · débit constant"}}},"4K":{"width":4096,"height":2160,"fps":["24","25","30","50","60","100","120"],"codecs":{"BRAW 5:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":161,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":107,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":80,"note":"Blackmagic RAW · débit constant"},"BRAW 18:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":53,"note":"Blackmagic RAW · débit constant"}}}}}},{"id":"ff","name":"Full Frame 36 mm","brand":"Générique","group":"GÉNÉRIQUE","sensorWidthMm":36.0,"dof":{"label":"Full Frame","cocMm":0.029,"cropToFF":1.0}},{"id":"s35","name":"Super 35","brand":"Générique","group":"GÉNÉRIQUE","sensorWidthMm":24.89,"dof":{"label":"Super 35","cocMm":0.019,"cropToFF":1.5}},{"id":"apsc","name":"APS-C","brand":"Générique","group":"GÉNÉRIQUE","sensorWidthMm":23.5,"dof":{"label":"APS-C","cocMm":0.019,"cropToFF":1.53}},{"id":"mft","name":"Micro 4/3","brand":"Générique","group":"GÉNÉRIQUE","sensorWidthMm":17.3,"dof":{"label":"Micro 4/3","cocMm":0.014,"cropToFF":2.08}},{"id":"oneinch","name":"1 pouce","brand":"Générique","group":"GÉNÉRIQUE","sensorWidthMm":13.2,"dof":{"label":"1 pouce","cocMm":0.011,"cropToFF":2.73}}],"notes":"V1.1: profils MEDIA centralisés + Blackmagic ajoutées à la liste commune."};

  function sharedDbToMediaDb(data) {
    if (!data || !Array.isArray(data.cameras)) return null;
    const grouped = {};
    for (const camera of data.cameras) {
      if (!camera?.media?.modes) continue;
      const brand = String(camera.brand || camera.group || 'AUTRES').toUpperCase();
      const label = String(camera.media.label || camera.name || camera.id);
      grouped[brand] ||= {};
      grouped[brand][label] = camera.media.modes;
    }
    return Object.keys(grouped).length ? grouped : null;
  }

  let CAMERA_DB = sharedDbToMediaDb(FALLBACK_SHARED_CAMERA_DB) || {};

  function applySharedCameraDb(data) {
    const next = sharedDbToMediaDb(data);
    if (!next) return false;
    CAMERA_DB = next;
    return true;
  }

  function loadCachedSharedCameraDb() {
    try {
      const cached = JSON.parse(localStorage.getItem(CAMERA_DB_CACHE_KEY) || 'null');
      if (cached) applySharedCameraDb(cached);
    } catch (_) {}
  }

  async function refreshSharedCameraDb() {
    try {
      const res = await fetch(CAMERA_DB_URL, { cache:'no-store' });
      if (!res.ok) throw new Error(`camera db ${res.status}`);
      const data = await res.json();
      if (!applySharedCameraDb(data)) throw new Error('invalid camera db');
      try { localStorage.setItem(CAMERA_DB_CACHE_KEY, JSON.stringify(data)); } catch (_) {}
      renderCameraWizard();
      updateCameraPresetSummary();
    } catch (_) {}
  }

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
    const margin = clampNumber($('cardMargin').value, 0, 0, 50);
    const seconds = capacity * 8000 / bitrate;
    const perMinuteGB = bitrate * 60 / 8000;
    const perHourGB = bitrate * 3600 / 8000;
    const usableGB = capacity * (1 - margin / 100);
    const safeSeconds = usableGB * 8000 / bitrate;

    $('cardResult').textContent = formatDuration(safeSeconds);
    $('cardState').textContent = `CARTE ${formatStorage(capacity, 1)} · ${formatBitrate(bitrate)} · RÉSERVE ${formatNumber(margin, 0)} %`;
    $('cardDetail').textContent = `≈ ${formatNumber(safeSeconds / 60, 0)} min utilisables · ${formatNumber(seconds / 60, 0)} min théoriques à 100 %`;
    $('cardPerMinute').textContent = formatStorage(perMinuteGB, 2);
    $('cardPerHour').textContent = formatStorage(perHourGB, 1);
    $('cardSafe').textContent = formatDuration(seconds);
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
      $('cameraPresetSummaryDetail').textContent = Object.keys(CAMERA_DB).map(x => x === 'BLACKMAGIC' ? 'Blackmagic' : x[0] + x.slice(1).toLowerCase()).join(' · ');
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

  function installCustomNumberSteppers() {
    document.querySelectorAll('.number-unit-field input[type="number"], .mini-number-unit input[type="number"]').forEach(input => {
      if (input.nextElementSibling?.classList?.contains('custom-stepper')) return;
      const stepper = document.createElement('span');
      stepper.className = 'custom-stepper';
      stepper.setAttribute('aria-hidden', 'false');
      const up = document.createElement('button');
      up.type = 'button';
      up.className = 'step-up';
      up.setAttribute('aria-label', 'Augmenter');
      const down = document.createElement('button');
      down.type = 'button';
      down.className = 'step-down';
      down.setAttribute('aria-label', 'Diminuer');
      const step = direction => {
        try { direction > 0 ? input.stepUp() : input.stepDown(); }
        catch {
          const current = Number(input.value) || 0;
          const amount = Number(input.step) || 1;
          input.value = String(current + direction * amount);
        }
        input.dispatchEvent(new Event('input', { bubbles:true }));
        input.dispatchEvent(new Event('change', { bubbles:true }));
        input.focus({ preventScroll:true });
      };
      up.addEventListener('click', () => step(1));
      down.addEventListener('click', () => step(-1));
      stepper.append(up, down);
      input.insertAdjacentElement('afterend', stepper);
    });
  }

  installCustomNumberSteppers();

  const storedTheme = localStorage.getItem(STORAGE_THEME);
  setTheme(storedTheme || 'light');
  syncBitrateUnitUI();
  setBitrateInputFromMbps(250);
  loadCachedSharedCameraDb();
  renderCameraWizard();
  updateCameraPresetSummary();
  renderPresets();
  switchMode('card');
  updateAll();
  refreshSharedCameraDb();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
})();
